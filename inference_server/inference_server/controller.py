from inference_server.inferencer import BaseInferencer


def infer(model_url, image_url, threshold):
    engine = BaseInferencer(model_url)
    engine.infer(image_url)
    return engine.parser_results(threshold)
