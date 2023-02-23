import time
from inference_server.models.inference_queue import InferenceQueue
from inference_server.models.inference_request_pool import InferenceRequestPool
from inference_server.models.inferencer_builder import InferencerBuilder
from inference_server.models.inference_request_pool import InferenceRequestPool


infer_request_pool = InferenceRequestPool()
infer_builder = InferencerBuilder(workspace='workspace')
infer_queue = InferenceQueue(infer_request_pool, infer_builder)
infer_queue.start_workers(1)

image_url = "https://pub-524340b28b994541ba4d1f39e64d2b3d.r2.dev/cb2dab52-076b-4437-91d1-606ff0455ec9/875e2139-e2bb-48a4-961f-d5d7b1795a87.png"
model_url = "https://pub-524340b28b994541ba4d1f39e64d2b3d.r2.dev/cb2dab52-076b-4437-91d1-606ff0455ec9/ir_model.zip"

request_id = infer_queue.create_request(model_url)
print(infer_request_pool.get_request(request_id).get_status())

infer_queue.perform_request(request_id, image_url)

# if model_url and image_url:
#     infer_queue.add_request(request_id, model_url, image_url)

# while True:
print(infer_request_pool.get_request(request_id).get_status())
