from flask import Blueprint
from flask import request
from inference_server import controller

infer_bp = Blueprint("infer", __name__)


@infer_bp.route("/predict", methods=['POST'])
def predict():
    infer_params = request.get_json()
    results = controller.infer(
        model_url=infer_params['modelURL'],
        image_url=infer_params['imageURL'],
        threshold=infer_params['threshold'],
        width=infer_params['width'],
        height=infer_params['height'],
    )
    return results
