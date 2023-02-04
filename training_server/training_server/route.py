from flask import Blueprint
from flask import make_response
from flask import request
from training_server import controller

train_bp = Blueprint("infer", __name__)


@train_bp.route('/model/train', methods=['POST'])
def train():
    training_params = request.get_json()
    request_success = controller.train_model_async(training_params)
    if request_success:
        return "Training started", 202
    return "Training already in progress", 409


@train_bp.route('/model/exported')
def get_exported_model():
    memory_file = controller.get_exported_model()
    if memory_file:
        response = make_response(memory_file.read())
        response.headers['Content-Disposition'] = f'attachment; filename=exported_model.zip'
        response.headers['Content-Type'] = 'application/zip'
        return response
    return "Training is not completed yet. Please try again later.", 400


@train_bp.route('/model/ir')
def get_ir_model():
    memory_file = controller.get_ir_model()
    if memory_file:
        response = make_response(memory_file.read())
        response.headers['Content-Disposition'] = f'attachment; filename=exported_model.zip'
        response.headers['Content-Type'] = 'application/zip'
        return response
    return "Training is not completed yet. Please try again later.", 400


@train_bp.route('/model', methods=['DELETE'])
def release():
    request_success = controller.release()
    if request_success:
        return "Success", 200
    return "Training is not completed yet. Please try again later.", 400
