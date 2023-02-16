import datetime
import requests
import threading

from training_server import config
from training_server import utils
from training_server.trainer import BaseTrainer

SERVER_IDLE = "Idle"
SERVER_TRAINING = "Training"
SERVER_COMPLETED = "Completed"
SERVER_STOPED = "Stopped"

server_status = {"status": SERVER_IDLE}
training_completed_hooks = {}
trainer = BaseTrainer()


def get_server_status():
    return server_status["status"]


def get_training_status():
    if trainer.start_time:
        difference = datetime.datetime.now() - trainer.start_time

        duration = ''
        if difference.days > 0:
            duration += f"{difference.days} day{'s' if difference.days > 1 else ''} "

        seconds = difference.seconds
        hours = seconds // 3600
        minutes = (seconds // 60) % 60
        seconds = seconds % 60

        if hours > 0:
            duration += f"{hours} hour{'s' if hours > 1 else ''} "

        if minutes > 0:
            duration += f"{minutes} minute{'s' if minutes > 1 else ''} "

        if seconds > 0:
            duration += f"{seconds} second{'s' if seconds > 1 else ''} "

    return {
        'progress': trainer.progress,
        'status': trainer.status,
        'duration': duration,
    }


def train_model_async(training_params):
    batch_size = training_params['batchSize']
    dataset = training_params['dataset']
    labels = training_params['labels']
    learning_rate_base = training_params['learningRateBase']
    num_steps = training_params['numSteps']
    pretrained_model = training_params['preTrainedModel']
    warmup_learning_rate = training_params['warmupLearningRate']
    warmup_steps = training_params['warmupSteps']

    def train_model():
        trainer.train_model(
            dataset=dataset,
            labels=labels,
            pretrained_model_name=pretrained_model,
            num_classes=len(labels),
            batch_size=batch_size,
            num_steps=num_steps,
            learning_rate_base=learning_rate_base,
            warmup_learning_rate=warmup_learning_rate,
            warmup_steps=warmup_steps,
        )
        server_status["status"] = SERVER_COMPLETED
        call_training_completed_hooks()

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


def add_training_completed_hook(url, data):
    training_completed_hooks[url] = data


def remove_training_completed_hook(url):
    training_completed_hooks.pop(url, None)


def call_training_completed_hooks():
    hooks = training_completed_hooks.copy()
    for url in hooks:
        send_training_completed(url, hooks[url])


def send_training_completed(url, data):
    try:
        resp = requests.post(url, json=data)
    except:
        print(resp)
