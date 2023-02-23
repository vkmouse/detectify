import uuid
import threading

from inference_server.models.inference_request import InferenceRequest


class InferenceRequestPool:
    def __init__(self):
        self.requests = {}
        self.lock = threading.Lock()

    def add_request(self, model_url: str) -> str:
        request_id = str(uuid.uuid4())
        req = InferenceRequest(request_id)
        req.set_model_url(model_url)
        with self.lock:
            self.requests[request_id] = req
        return request_id

    def remove_request(self, request_id: str) -> None:
        with self.lock:
            if request_id in self.requests:
                del self.requests[request_id]

    def get_request(self, request_id: str) -> InferenceRequest | None:
        with self.lock:
            if request_id in self.requests:
                return self.requests[request_id]
            else:
                return None
