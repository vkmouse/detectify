from inference_server.models import InferencerBuilder
from inference_server.models import InferenceQueue
from inference_server.models import InferenceRequestPool
from inference_server.utils import workspace_path


infer_request_pool = InferenceRequestPool()
infer_builder = InferencerBuilder(workspace=workspace_path)
infer_queue = InferenceQueue(infer_request_pool, infer_builder)
infer_queue.start_workers(1)


def create_request(model_url: str):
    return {
        "data": {
            "requestId": infer_queue.create_request(model_url),
            "modelURL": model_url,
        },
        "message": "Success",
        "status": 200,
    }, 200


def infer_with_url(request_id: str, image_url: str) -> bool:
    success = infer_queue.perform_request(request_id, image_url=image_url)
    if success:
        return {
            "message": "Accepted",
            "status": 202,
        }, 202
    return {
        "message": "Error: No requests found",
        "status": 400,
    }, 400


def infer_with_image(request_id: str, image_data: bytes) -> bool:
    if not image_data:
        return {
            "message": "Error: Image not foundd",
            "status": 400,
        }, 400
    success = infer_queue.perform_request(request_id, image_data=image_data)
    if success:
        return {
            "message": "Accepted",
            "status": 202,
        }, 202
    return {
        "message": "Error: No requests found",
        "status": 400,
    }, 400


def get_result(request_id: str):
    req = infer_request_pool.get_request(request_id)
    if not req:
        return {
            "message": "Error: No requests found",
            "status": 400,
        }, 400
    if req.is_pending():
        return {
            "data": {
                "status": "pending",
                "results": [],
            },
            "message": "Success: Request is pending",
            "status": 200,
        }, 200
    if req.is_completed():
        infer_request_pool.remove_request(request_id)
        return {
            "data": {
                "status": "completed",
                "results": req.get_result(),
            },
            "message": "Success: Request is completed",
            "status": 200,
        }, 200
    return {
        "data": {
            "status": "created",
            "results": [],
        },
        "message": "Success: Request has been created but not perform",
        "status": 200,
    }, 200
