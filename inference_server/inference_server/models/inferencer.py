import openvino.runtime as ov
import cv2
import numpy as np

from inference_server.models.detection import Detection


class Inferencer:
    def __init__(self, model_path: str, model_width: int, model_height: int, label_map):
        self.model_path = model_path
        self.model_width = model_width
        self.model_height = model_height
        self.label_map = label_map

    def compile(self):
        core = ov.Core()
        self.model = core.compile_model(self.model_path, "AUTO")

    def infer(self, image_path: str):
        image = cv2.imread(image_path)
        (self.src_height, self.src_width, _) = image.shape
        image = cv2.resize(image, (self.model_height, self.model_width))
        image = np.expand_dims(image, axis=0)

        infer_request = self.model.create_infer_request()
        input_tensor = ov.Tensor(array=image, shared_memory=True)
        infer_request.set_input_tensor(input_tensor)

        infer_request.infer()

        output = infer_request.get_output_tensor()
        return self.parse_result(output.data)

    def parse_result(self, buffer):
        results = []
        for result in buffer[0][0].tolist():
            if int(result[1]) > 0:
                results.append(
                    Detection(
                        name=self.label_map[str(int(result[1]))],
                        confidence=result[2],
                        x=result[3] * self.src_width,
                        y=result[4] * self.src_height,
                        width=(result[5] - result[3]) * self.src_width,
                        height=(result[6] - result[4]) * self.src_height,
                    )
                )

        return results
