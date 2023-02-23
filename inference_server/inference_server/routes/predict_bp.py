from flask import Blueprint
from flask import request

from inference_server.controllers import predict_controller

predict_bp = Blueprint("predict", __name__)


@predict_bp.route('/predict', methods=['POST'])
def create_request():
    params = request.get_json()
    return predict_controller.create_request(params['modelURL'])


@predict_bp.route('/predict/<request_id>', methods=['POST'])
def infer(request_id):
    if request.content_type == "application/json":
        params = request.get_json()
        return predict_controller.infer_with_url(request_id, params['imageURL'])
    else:
        image_file = request.files.get('image')
        image_data = image_file.read()
        return predict_controller.infer_with_image(request_id, image_data)


@predict_bp.route('/predict/<request_id>', methods=['GET'])
def get_result(request_id):
    return predict_controller.get_result(request_id)
