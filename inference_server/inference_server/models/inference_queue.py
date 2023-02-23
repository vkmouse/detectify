import queue
import threading
import time

from inference_server.models.cache import Cache
from inference_server.models.inferencer_builder import InferencerBuilder
from inference_server.models.inference_request_pool import InferenceRequestPool


class InferenceQueue:
    def __init__(self, infer_request_pool: InferenceRequestPool, infer_builder: InferencerBuilder):
        self.infer_request_pool = infer_request_pool
        self.infer_builder = infer_builder
        self.queue = queue.Queue()
        self.cache = Cache(10)
        self.lock = threading.Lock()

    def create_request(self, model_url: str) -> str:
        return self.infer_request_pool.add_request(model_url)

    def perform_request(self, request_id: str, image_url: str = None, image_data: bytes = None) -> bool:
        req = self.infer_request_pool.get_request(request_id)
        if not req:
            return False

        try:
            if image_url:
                inferencer, image_path = self.infer_builder.build(req.model_url, image_url=image_url)
            if image_data:
                inferencer, image_path = self.infer_builder.build(req.model_url, image_data=image_data)
        except:
            print('build inferener error')
            return False

        result = self.cache.get(image_path + inferencer.model_path)
        if result:
            req.set_result(result)
        else:
            req.set_pending()
            self.queue.put((request_id, inferencer, image_path))
        return True

    def process_queue(self):
        while True:
            try:
                (request_id, inferencer, image_path) = self.queue.get(timeout=1)
            except queue.Empty:
                time.sleep(1)
                continue

            try:
                inferencer.compile()
                detections = inferencer.infer(image_path)
                self.infer_request_pool.get_request(request_id).set_result(detections)
                self.cache.set(image_path + inferencer.model_path, detections)
            except:
                print('infer error')

            self.queue.task_done()

    def start_workers(self, num_workers: int):
        for i in range(num_workers):
            t = threading.Thread(target=self.process_queue)
            t.daemon = True
            t.start()
