from flask import Blueprint
from flask import request

from training_server.controllers import train_controller

model_bp = Blueprint("model", __name__)


@model_bp.route('/model/train', methods=['GET'])
def get_training_status():
    data = train_controller.get_training_status()
    return {
        "data": data,
        "message": "Success",
        "status": 200,
    }, 200


@model_bp.route('/model/train', methods=['POST'])
def train():
    training_params = request.get_json()
    request_success = train_controller.train_model_in_thread(training_params)
    if request_success:
        return {
            "message": "Accepted",
            "status": 202,
        }, 202
    return {
        "message": "Error: Training already in progress.",
        "status": 2002,
    }, 409


@model_bp.route('/model', methods=['DELETE'])
def release():
    request_success = train_controller.release()
    if request_success:
        return {
            "message": "Success",
            "status": 200,
        }, 200
    return {
        "message": "Error: Training is not completed yet.",
        "status": 2002,
    }, 400


@model_bp.route('/model/export', methods=['POST'])
def upload_models():
    upload_params = request.get_json()
    if train_controller.upload_exported_model(upload_params['exportedModelURL']):
        return {
            "message": "Error: Upload exported model failed",
            "status": 400,
        }, 400
    if train_controller.upload_ir_model(upload_params['irModelURL']):
        return {
            "message": "Error: Upload ir model failed",
            "status": 400,
        }, 400
    return {
        "message": "Success",
        "status": 200,
    }, 200


@model_bp.route('/webhooks/model/completed', methods=['POST'])
def register_training_completed():
    data = request.get_json()
    train_controller.add_training_completed_hook(data['url'], data['data'])
    return {
        "message": "Success",
        "status": 200,
    }, 200


@model_bp.route('/webhooks/model/completed', methods=['DELETE'])
def unregister_training_completed():
    data = request.get_json()
    train_controller.remove_training_completed_hook(data['url'])
    return {
        "message": "Success",
        "status": 200,
    }, 200
