import threading
from training_server import config
from training_server import utils
from training_server.trainer import BaseTrainer

training_status = {"status": "idle"}


def train_model_async(training_params):
    def train_model():
        trainer = BaseTrainer()
        trainer.init_workspace()
        trainer.import_dataset(training_params['dataset'], training_params['labels'])
        trainer.set_training_params(
            pretrained_model_name=training_params['pre_trained_model'],
            num_classes=len(training_params['labels']),
            batch_size=training_params['batch_size'],
            num_steps=training_params['num_steps'],
        )
        trainer.train()
        trainer.export_model()
        trainer.export_ir_model()
        training_status["status"] = "completed"

    if training_status["status"] == "idle":
        training_status["status"] = "training"
        training_thread = threading.Thread(target=train_model)
        training_thread.start()
        return True
    return False


def get_exported_model():
    if training_status["status"] == "completed":
        return utils.zip_directory(config.workspace_exported_model)
    return None


def get_ir_model():
    if training_status["status"] == "completed":
        return utils.zip_directory(config.workspace_ir_model)
    return None


def release():
    if training_status["status"] == "idle" or training_status["status"] == "completed":
        training_status["status"] = "idle"
        return True
    return False
