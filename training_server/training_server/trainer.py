import datetime
import json
import subprocess
import threading
import time

from object_detection import model_lib_v2
from training_server import config
from training_server import utils

TRAINER_INIT = "Initializing"
TRAINER_TRAINING = "Training"
TRAINER_EXPORT = "Exporting"
TRAINER_COMPLETED = "Completed"


class BaseTrainer:
    def __init__(self):
        self.status = None
        self.start_time = None
        self.end_time = None
        self.progress = None

    def train_model(
        self,
        dataset,
        labels,
        pretrained_model_name,
        num_classes,
        batch_size,
        num_steps,
        learning_rate_base,
        warmup_learning_rate,
        warmup_steps,
    ):
        self.status = TRAINER_INIT
        self.start_time = datetime.datetime.now()
        self.end_time = None
        self.progress = 0

        self._init_workspace()
        self._import_dataset(dataset, labels)
        self._set_training_params(
            pretrained_model_name=pretrained_model_name,
            num_classes=num_classes,
            batch_size=batch_size,
            num_steps=num_steps,
            learning_rate_base=learning_rate_base,
            warmup_learning_rate=warmup_learning_rate,
            warmup_steps=warmup_steps,
        )

        self.status = TRAINER_TRAINING
        self._train()

        self.status = TRAINER_EXPORT
        self._export_model()
        self._export_ir_model()

        self.status = TRAINER_COMPLETED
        self.end_time = datetime.datetime.now()

    def get_duration(self):
        if self.start_time:
            if self.end_time:
                difference = self.end_time - self.start_time
            else:
                difference = datetime.datetime.now() - self.start_time

            if difference.days > 0:  # X day(s) ago
                return f"{difference.days} day{'s' if difference.days > 1 else ''} ago"

            seconds = difference.seconds
            hours = seconds // 3600
            minutes = (seconds // 60) % 60
            seconds = seconds % 60

            if hours > 0:  # X hour(s) ago
                return f"{hours} hour{'s' if hours > 1 else ''} ago"
            if minutes > 0:  # X minute(s) ago
                return f"{minutes} minute{'s' if minutes > 1 else ''} age"
            return "Less than 1 minute ago"

    def _init_workspace(self):
        if utils.path.exists(config.workspace_path):
            utils.rmdir(config.workspace_path)
        utils.mkdir(config.workspace_path)
        utils.mkdir(config.workspace_models)
        utils.mkdir(config.workspace_pretrained_model)

    def _import_dataset(self, dataset, labels):
        utils.rmdir(config.workspace_annotations)
        utils.rmdir(config.workspace_images)
        utils.mkdir(config.workspace_images)
        utils.mkdir(config.workspace_annotations)
        for data in dataset:
            utils.download_file(data["imageURL"], config.workspace_images, data["filename"])
            utils.download_file(data["annotationURL"], config.workspace_images, data["filename"])
        self._generate_label_map(labels)
        self._generate_tfrecord()

    def _set_training_params(
        self,
        pretrained_model_name,
        num_classes,
        batch_size,
        num_steps,
        learning_rate_base,
        warmup_learning_rate,
        warmup_steps,
    ):
        # copy selected model to workspace/pre-trained-model
        src = utils.path.join(config.models_path, pretrained_model_name)
        utils.rmdir(config.workspace_pretrained_model)
        utils.cpdir(src, config.workspace_pretrained_model)

        # modify its pipeline config
        replacements = {
            "num_classes": num_classes,
            "batch_size": batch_size,
            "fine_tune_checkpoint": self._to_pipeline_string(config.workspace_fine_tune_checkpoint),
            "num_steps": num_steps,
            "fine_tune_checkpoint_type": '"detection"',
            "use_bfloat16": "false",
            "label_map_path": self._to_pipeline_string(config.workspace_annotations_label_map),
            "input_path": self._to_pipeline_string(config.workspace_annotations_train_record),
            "total_steps": num_steps,
            "learning_rate_base": learning_rate_base,
            "warmup_learning_rate": warmup_learning_rate,
            "warmup_steps": warmup_steps,
        }
        with open(config.workspace_pretrained_model_pipeline, "r") as f:
            content = f.read()
        for original, replacement in replacements.items():
            content = content.replace(f"{original}: ", f"{original}: {replacement} # ")
        self.model_size = {
            "width": content.split("width: ")[1].split("\n")[0],
            "height": content.split("height: ")[1].split("\n")[0],
        }

        with open(config.workspace_models_pipeline, "w") as f:
            f.write(content)
        self.num_steps = num_steps

    def _train(self):
        monitor = FileChangeMonitor(config.workspace_models_checkpoint, self._update_progress)
        monitor.start()
        model_lib_v2.train_loop(
            model_dir=config.workspace_models,
            pipeline_config_path=config.workspace_models_pipeline,
            checkpoint_every_n=100,
            checkpoint_max_to_keep=5,
        )
        monitor.stop()

    def _export_model(self):
        subprocess.run(
            [
                "python",
                config.exporter_main_v2,
                f"--trained_checkpoint_dir={config.workspace_models}",
                f"--pipeline_config_path={config.workspace_models_pipeline}",
                f"--output_directory={config.workspace_exported_model}",
            ]
        )
        utils.zip_directory(config.workspace_exported_model, 'static/exported_model.zip')

    def _export_ir_model(self):
        subprocess.run(
            [
                "mo",
                f"--saved_model_dir={config.workspace_exported_saved_model}",
                f"--tensorflow_object_detection_api_pipeline_config={config.workspace_exported_model_pipeline}",
                f"--transformations_config={config.transformations_config}",
                "--reverse_input_channels",
                f"--output_dir={config.workspace_ir_model}",
            ]
        )
        with open(config.workspace_ir_model_data, "w") as f:
            f.write(
                json.dumps(
                    {
                        "model": self.model_size,
                        "labels": self.label_map,
                    },
                    indent=4,
                )
            )
        utils.zip_directory(config.workspace_ir_model, 'static/ir_model.zip')

    def _generate_label_map(self, labels):
        self.label_map = {}
        with open(config.workspace_annotations_label_map, "w") as f:
            for i, label in enumerate(labels, start=1):
                self.label_map[i] = label
                f.write(f"item {{\n  id: {i}\n  name: '{label}'\n}}\n\n")

    def _generate_tfrecord(self):
        subprocess.run(
            [
                "python",
                config.scripts_generate_tfrecord,
                f"-x={config.workspace_images}",
                f"-l={config.workspace_annotations_label_map}",
                f"-o={config.workspace_annotations_train_record}",
            ]
        )

    def _to_pipeline_string(self, s):
        return f'"{s}"'.replace("\\", "/")

    def _update_progress(self):
        line = None
        with open(config.workspace_models_checkpoint, 'r') as file:
            line = file.readline()
        total_ckpt = self.num_steps / 100 + 1
        ckpt = int(line.split('ckpt-')[1][:-2])
        self.progress = round((ckpt / total_ckpt) * 100, 2)


class FileChangeMonitor:
    def __init__(self, filepath, callback):
        self.filepath = filepath
        self.callback = callback
        self.modified_on = 0

    def start(self):
        self.key = True
        t = threading.Thread(target=self.loop)
        t.start()

    def stop(self):
        self.key = False

    def loop(self):
        try:
            while self.key:
                time.sleep(1)
                modified = 0
                if utils.path.exists(self.filepath):
                    modified = utils.path.getmtime(self.filepath)
                if modified != self.modified_on:
                    self.modified_on = modified
                    if self.callback():
                        break
        except Exception as e:
            print(e)
