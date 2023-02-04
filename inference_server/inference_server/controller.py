import openvino.runtime as ov
import cv2
import numpy as np

from inference_server import config
from inference_server import utils


def load_model_from_url(workspace, url):
    workspace_zip = utils.path.join(workspace, 'saved_model.zip')
    workspace_xml = utils.path.join(workspace, 'saved_model.xml')
    utils.download_file(url, workspace, 'saved_model')
    utils.unzip_file(workspace_zip, workspace)
    core = ov.Core()
    return core.compile_model(workspace_xml, "AUTO")


def load_image_from_url(workspace, url):
    id = 0
    filepath = utils.download_file(url, workspace, f'{id}')
    return cv2.imread(filepath)


def infer(model_url, image_url, threshold, width, height):
    utils.mkdir_if_not_exists(config.workspace_path)
    workspace_path = utils.path.join(config.workspace_path, utils.generate_uuid())
    utils.mkdir(workspace_path)

    image = load_image_from_url(workspace_path, image_url)
    model = load_model_from_url(workspace_path, model_url)
    (src_height, src_width, _) = image.shape
    image = cv2.resize(image, (height, width))
    image = np.expand_dims(image, axis=0)

    infer_request = model.create_infer_request()
    input_tensor = ov.Tensor(array=image, shared_memory=True)
    infer_request.set_input_tensor(input_tensor)

    infer_request.infer()

    output = infer_request.get_output_tensor()
    buffer = output.data

    utils.rmdir(workspace_path)

    results = []
    for result in buffer[0][0].tolist():
        if result[2] >= threshold:
            results.append(
                {
                    "classId": result[1],
                    "confidence": result[2],
                    "x": result[3] * src_width,
                    "y": result[4] * src_height,
                    "width": (result[5] - result[3]) * src_width,
                    "height": (result[6] - result[4]) * src_height,
                }
            )

    return results
