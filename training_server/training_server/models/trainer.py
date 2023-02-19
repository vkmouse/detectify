import datetime
import os

from object_detection import model_lib_v2
from training_server.utils import FileWatcher


class Trainer:
    def __init__(self, models_dir: str):
        self.models_dir = models_dir
        self.models_pipeline = os.path.join(models_dir, 'pipeline.config')

    def train(self):
        model_lib_v2.train_loop(
            model_dir=self.models_dir,
            pipeline_config_path=self.models_pipeline,
            checkpoint_every_n=100,
            checkpoint_max_to_keep=5,
        )
