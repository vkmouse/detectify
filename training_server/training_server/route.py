from flask import Blueprint
from flask import make_response
from flask import request
from flask import send_file
from training_server import controller

model_bp = Blueprint("model", __name__)
server_bp = Blueprint("server", __name__)
server_bp = Blueprint("webhooks", __name__)


@model_bp.route('/model/train', methods=['POST'])
def train():
    training_params = request.get_json()
    request_success = controller.train_model_async(training_params)
    if request_success:
        return {
            "message": "Accepted",
            "status": 202,
        }, 202
    return {
        "message": "Error: Training already in progress.",
        "status": 2002,
    }, 409


@model_bp.route('/model/exported')
def get_exported_model():
    memory_file = controller.get_exported_model()
    if memory_file:
        return send_file(memory_file, mimetype='application/zip')
    return {
        "message": "Error: Training is not completed yet.",
        "status": 2002,
    }, 400


@model_bp.route('/model/ir')
def get_ir_model():
    memory_file = controller.get_ir_model()
    if memory_file:
        return send_file(memory_file, mimetype='application/zip')
    return {
        "message": "Error: Training is not completed yet.",
        "status": 2002,
    }, 400


@model_bp.route('/model', methods=['DELETE'])
def release():
    request_success = controller.release()
    if request_success:
        return {
            "message": "Success",
            "status": 200,
        }, 200
    return {
        "message": "Error: Training is not completed yet.",
        "status": 2002,
    }, 400


@server_bp.route('/server', methods=['GET'])
def get_server_status():
    return {
        "data": {
            "status": controller.get_server_status(),
        },
        "message": "Success",
        "status": 200,
    }, 200


@server_bp.route('/webhooks/model/completed', methods=['POST'])
def register_training_completed():
    data = request.get_json()
    controller.add_training_completed_hook(data['url'], data['data'])
    return {
        "message": "Success",
        "status": 200,
    }, 200


@server_bp.route('/webhooks/model/completed', methods=['DELETE'])
def unregister_training_completed():
    data = request.get_json()
    controller.remove_training_completed_hook(data['url'])
    return {
        "message": "Success",
        "status": 200,
    }, 200
