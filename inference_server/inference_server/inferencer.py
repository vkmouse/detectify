import json
import openvino.runtime as ov
import cv2
import numpy as np

from inference_server import config
from inference_server import utils


class BaseInferencer:
    def __init__(self, model_url):
        segments = model_url.split('/')
        project_id = segments[-2]
        self.workspace = utils.path.join(config.workspace_path, project_id)
        utils.mkdir_if_not_exists(config.workspace_path)
        utils.mkdir_if_not_exists(self.workspace)

        if not utils.path.exists(self.workspace):
            BaseInferencer.download_model(model_url, self.workspace)

        self.model = BaseInferencer.load_model(self.workspace)
        data = self.load_meta_data(self.workspace)
        self.model_width = int(data['model']['width'])
        self.model_height = int(data['model']['height'])
        self.label_map = data['labels']

    def infer(self, url):
        filepath = BaseInferencer.download_image(url, self.workspace)
        image = cv2.imread(filepath)
        (self.src_height, self.src_width, _) = image.shape
        image = cv2.resize(image, (self.model_height, self.model_width))
        image = np.expand_dims(image, axis=0)

        infer_request = self.model.create_infer_request()
        input_tensor = ov.Tensor(array=image, shared_memory=True)
        infer_request.set_input_tensor(input_tensor)

        infer_request.infer()

        output = infer_request.get_output_tensor()
        self.buffer = output.data

    def parser_results(self, threshold):
        results = []
        for result in self.buffer[0][0].tolist():
            if result[2] >= threshold:
                results.append(
                    {
                        "name": self.label_map[str(int(result[1]))],
                        "confidence": result[2],
                        "x": result[3] * self.src_width,
                        "y": result[4] * self.src_height,
                        "width": (result[5] - result[3]) * self.src_width,
                        "height": (result[6] - result[4]) * self.src_height,
                    }
                )

        return results

    @staticmethod
    def download_model(url, savedir):
        zip = utils.path.join(savedir, 'saved_model.zip')
        utils.download_file(url, savedir, 'saved_model')
        utils.unzip_file(zip, savedir)

    @staticmethod
    def load_model(modeldir):
        xml = utils.path.join(modeldir, 'saved_model.xml')
        core = ov.Core()
        return core.compile_model(xml, "AUTO")

    @staticmethod
    def load_meta_data(modeldir):
        meta = utils.path.join(modeldir, 'data.meta')
        with open(meta, 'r') as file:
            return json.load(file)

    @staticmethod
    def download_image(url, savedir):
        segments = url.split('/')
        id = segments[-1].split('.')[0]
        extension = utils.get_file_extension(url)
        filepath = utils.path.join(savedir, id + extension)
        if utils.path.exists(filepath):
            return filepath
        return utils.download_file(url, savedir, f'{id}')
