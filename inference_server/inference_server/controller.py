from inference_server.inferencer import BaseInferencer


memory_inferencer = {
    'model_url': '',
    "engine": None,
}


def infer(model_url, image_url, threshold):
    if memory_inferencer['model_url'] == model_url:
        engine = memory_inferencer['engine']
    else:
        engine = BaseInferencer(model_url)
    engine.infer(image_url)
    memory_inferencer['model_url'] = model_url
    memory_inferencer['engine'] = engine
    return engine.parser_results(threshold)
