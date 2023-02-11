import threading
from training_server import config
from training_server import utils
from training_server.trainer import BaseTrainer

SERVER_IDLE = "Idle"
SERVER_TRAINING = "Training"
SERVER_COMPLETED = "Completed"
SERVER_STOPED = "Stopped"

server_status = {"status": SERVER_IDLE}


def get_server_status():
    return server_status["status"]


def train_model_async(training_params):
    def train_model():
        trainer = BaseTrainer()
        trainer.init_workspace()
        trainer.import_dataset(training_params['dataset'], training_params['labels'])
        trainer.set_training_params(
            pretrained_model_name=training_params['preTrainedModel'],
            num_classes=len(training_params['labels']),
            batch_size=training_params['batchSize'],
            num_steps=training_params['numSteps'],
        )
        trainer.train()
        trainer.export_model()
        trainer.export_ir_model()
        server_status["status"] = SERVER_COMPLETED

    if server_status["status"] == SERVER_IDLE:
        server_status["status"] = SERVER_TRAINING
        training_thread = threading.Thread(target=train_model)
        training_thread.start()
        return True
    return False


def get_exported_model():
    if server_status["status"] == SERVER_COMPLETED:
        return utils.zip_directory(config.workspace_exported_model)
    return None


def get_ir_model():
    if server_status["status"] == SERVER_COMPLETED:
        return utils.zip_directory(config.workspace_ir_model)
    return None


def release():
    if server_status["status"] == SERVER_IDLE or server_status["status"] == SERVER_COMPLETED:
        server_status["status"] = SERVER_IDLE
        return True
    return False
