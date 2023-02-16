import json
import subprocess
from training_server import config
from training_server import utils


class BaseTrainer:
    def init_workspace(self):
        if utils.path.exists(config.workspace_path):
            utils.rmdir(config.workspace_path)
        utils.mkdir(config.workspace_path)
        utils.mkdir(config.workspace_models)
        utils.mkdir(config.workspace_pretrained_model)

    def import_dataset(self, dataset, labels):
        utils.rmdir(config.workspace_annotations)
        utils.rmdir(config.workspace_images)
        utils.mkdir(config.workspace_images)
        utils.mkdir(config.workspace_annotations)
        for data in dataset:
            utils.download_file(data["imageURL"], config.workspace_images, data["filename"])
            utils.download_file(data["annotationURL"], config.workspace_images, data["filename"])
        self._generate_label_map(labels)
        self._generate_tfrecord()

    def set_training_params(
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

    def train(self):
        subprocess.run(
            [
                "python",
                config.model_main_tf2,
                f"--model_dir={config.workspace_models}",
                f"--pipeline_config_path={config.workspace_models_pipeline}",
            ]
        )

    def export_model(self):
        subprocess.run(
            [
                "python",
                config.exporter_main_v2,
                f"--trained_checkpoint_dir={config.workspace_models}",
                f"--pipeline_config_path={config.workspace_models_pipeline}",
                f"--output_directory={config.workspace_exported_model}",
            ]
        )

    def export_ir_model(self):
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
