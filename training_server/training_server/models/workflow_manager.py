import datetime
import os
import shutil
from training_server.models.dataset_builder import DatasetBuilder
from training_server.models.model_exporter import ModelExporter
from training_server.models.training_model_builder import TrainingModelBuilder
from training_server.models.trainer import Trainer
from training_server.models.workspace import Workspace
from training_server.utils import FileWatcher
from training_server.utils import site_pkg_path
from training_server.utils import workspace_path

TRAINER_IDLE = "Idle"
TRAINER_INITIALIZING = "Initializing"
TRAINER_TRAINING = "Training"
TRAINER_EXPORTING = "Exporting"
TRAINER_COMPLETED = "Completed"

workspace = Workspace(workspace_path)
dataset_builder = DatasetBuilder(
    dataset_dir=workspace.images_dir,
    labels_path=workspace.annotations_label_map_path,
    output_path=workspace.annotations_train_record_path,
)
model_builder = TrainingModelBuilder(
    pretrained_model=workspace.pretrained_model_dir,
    models_path=workspace.models_dir,
    label_map_path=workspace.annotations_label_map_path,
    input_path=workspace.annotations_train_record_path,
)
trainer = Trainer(models_dir=workspace.models_dir)
model_exporter = ModelExporter(
    site_pkg_path=site_pkg_path,
    models_dir=workspace.models_dir,
    exported_model_dir=workspace.exported_model_dir,
    ir_model_dir=workspace.ir_model_dir,
    labels_path=workspace.annotations_label_map_path,
)


class WorkflowManager:
    def __init__(self):
        self.exported_model_dir = workspace.exported_model_dir
        self.ir_model_dir = workspace.ir_model_dir
        self.models_checkpoint = os.path.join(trainer.models_dir, 'checkpoint')
        self.start_time = None
        self.end_time = None
        self.progress = None
        self.status = TRAINER_IDLE

    def execute(
        self,
        dataset,
        pretrained_model_url: str,
        batch_size: int,
        num_steps: int,
        learning_rate_base: float,
        warmup_learning_rate: float,
        warmup_steps: int,
    ):
        self.start_time = datetime.datetime.now()
        self.end_time = None
        self.progress = 0
        monitor = FileWatcher(self.models_checkpoint, self.update_progress)
        monitor.start()
        self.execute_warpper(
            dataset,
            pretrained_model_url,
            batch_size,
            num_steps,
            learning_rate_base,
            warmup_learning_rate,
            warmup_steps,
        )
        monitor.stop()
        self.end_time = datetime.datetime.now()

    def execute_warpper(
        self,
        dataset,
        pretrained_model_url: str,
        batch_size: int,
        num_steps: int,
        learning_rate_base: float,
        warmup_learning_rate: float,
        warmup_steps: int,
    ):
        self.status = TRAINER_INITIALIZING
        workspace.prepare()
        dataset_builder.build(dataset)
        model_builder.build(
            pretrained_model_url,
            batch_size,
            num_steps,
            learning_rate_base,
            warmup_learning_rate,
            warmup_steps,
        )
        self.status = TRAINER_TRAINING
        trainer.train()
        self.status = TRAINER_EXPORTING
        model_exporter.export()
        self.status = TRAINER_COMPLETED

    def update_progress(self):
        if os.path.exists(self.models_checkpoint):
            ckpt = -1
            for file_name in os.listdir(trainer.models_dir):
                if file_name.endswith(".index"):
                    ckpt_num = int(file_name.split("-")[-1].split(".")[0])
                    if ckpt_num > ckpt:
                        ckpt = ckpt_num

            total_ckpt = self.get_num_steps() / 100
            if ckpt < 2:
                self.progress = 0
            else:
                self.progress = round(((ckpt - 1) / total_ckpt) * 100, 2)

    def get_num_steps(self):
        shutil.copy(trainer.models_pipeline, "models_pipeline_copy")
        with open("models_pipeline_copy", "r") as f:
            content = f.read()
        num_steps = content.split("num_steps: ")[1].split(" # ")[0]
        os.remove("models_pipeline_copy")
        return int(num_steps)

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

    def is_training(self):
        return self.status == TRAINER_TRAINING or self.status == TRAINER_EXPORTING

    def reset(self):
        if not self.is_training():
            self.start_time = None
            self.end_time = None
            self.progress = None
            self.status = TRAINER_IDLE
