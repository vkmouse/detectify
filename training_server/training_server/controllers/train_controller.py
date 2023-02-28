import os
import threading
import requests

from training_server.models import WorkflowManager
from training_server.utils import zip_directory_and_upload
from training_server.utils import upload_file

workflow = WorkflowManager()
training_completed_hooks = {}


def get_training_status():
    return {
        'progress': workflow.progress,
        'status': workflow.status,
        'duration': workflow.get_duration(),
    }


def train_model_in_thread(training_params):
    batch_size = training_params['batchSize']
    dataset = training_params['dataset']
    learning_rate_base = training_params['learningRateBase']
    num_steps = training_params['numSteps']
    pretrained_model_url = training_params['pretrainedModelURL']
    warmup_learning_rate = training_params['warmupLearningRate']
    warmup_steps = training_params['warmupSteps']

    def train_model():
        workflow.execute(
            dataset,
            pretrained_model_url,
            batch_size,
            num_steps,
            learning_rate_base,
            warmup_learning_rate,
            warmup_steps,
        )
        call_training_completed_hooks()

    if not workflow.is_training():
        training_thread = threading.Thread(target=train_model)
        training_thread.start()
        return True
    return False


def release():
    if not workflow.is_training():
        workflow.reset()
        return True
    return False


def add_training_completed_hook(url, sender_data):
    training_completed_hooks[url] = sender_data


def remove_training_completed_hook(url):
    training_completed_hooks.pop(url, None)


def call_training_completed_hooks():
    hooks = training_completed_hooks.copy()
    for url in hooks:
        send_training_completed(url, hooks[url])


def send_training_completed(url, sender_data):
    try:
        resp = requests.post(
            url,
            json={
                "data": {"files": os.listdir(workflow.tfjs_model_dir)},
                "senderData": sender_data,
            },
        )
    except:
        print(resp)


def upload_exported_model(url):
    return zip_directory_and_upload(workflow.exported_model_dir, url)


def upload_ir_model(url):
    return zip_directory_and_upload(workflow.ir_model_dir, url)


def upload_web_model(url_dict):
    for filename, url in url_dict.items():
        file_path = os.path.join(workflow.tfjs_model_dir, filename)
        if not upload_file(file_path, url):
            return False
    return True
