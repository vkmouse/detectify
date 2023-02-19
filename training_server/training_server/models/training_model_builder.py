import os
from training_server.utils import download_file
from training_server.utils import unzip_file


class TrainingModelBuilder:
    def __init__(
        self,
        pretrained_model,
        models_path,
        label_map_path,
        input_path,
    ):
        self.pretrained_model = pretrained_model
        self.models = models_path
        self.label_map_path = label_map_path
        self.input_path = input_path
        self.models_pipeline = os.path.join(self.models, 'pipeline.config')
        self.pretrained_model_pipeline = os.path.join(self.pretrained_model, 'pipeline.config')
        self.fine_tune_checkpoint = os.path.join(self.pretrained_model, 'checkpoint', 'ckpt-0')

    def build(
        self,
        pretrained_model_url: str,
        batch_size: int,
        num_steps: int,
        learning_rate_base: float,
        warmup_learning_rate: float,
        warmup_steps: int,
    ):
        zip_file_path = os.path.join(self.pretrained_model, 'pre-trained-model.zip')
        download_file(pretrained_model_url, zip_file_path)
        unzip_file(zip_file_path, self.pretrained_model)
        os.remove(zip_file_path)
        self.set_pipeline_config(
            self.get_num_classes(),
            batch_size,
            num_steps,
            learning_rate_base,
            warmup_learning_rate,
            warmup_steps,
        )

    def set_pipeline_config(
        self,
        num_classes: int,
        batch_size: int,
        num_steps: int,
        learning_rate_base: float,
        warmup_learning_rate: float,
        warmup_steps: int,
    ):
        replacements = {
            "num_classes": num_classes,
            "batch_size": batch_size,
            "fine_tune_checkpoint": self.to_pipeline_string(self.fine_tune_checkpoint),
            "num_steps": num_steps,
            "fine_tune_checkpoint_type": '"detection"',
            "use_bfloat16": "false",
            "label_map_path": self.to_pipeline_string(self.label_map_path),
            "input_path": self.to_pipeline_string(self.input_path),
            "total_steps": num_steps,
            "learning_rate_base": learning_rate_base,
            "warmup_learning_rate": warmup_learning_rate,
            "warmup_steps": warmup_steps,
        }
        with open(self.pretrained_model_pipeline, "r") as f:
            content = f.read()
        for original, replacement in replacements.items():
            content = content.replace(f"{original}: ", f"{original}: {replacement} # ")
        with open(self.models_pipeline, "w") as f:
            f.write(content)

    def to_pipeline_string(self, s):
        return f'"{s}"'.replace("\\", "/")

    def get_model_size(self):
        with open(self.pretrained_model_pipeline, "r") as f:
            content = f.read()
        model_width = content.split("width: ")[1].split("\n")[0]
        model_height = content.split("height: ")[1].split("\n")[0]
        return (int(model_width), int(model_height))

    def get_num_classes(self):
        with open(self.label_map_path, "r") as f:
            content = f.read()
        return len(content.split("item {")) - 1
