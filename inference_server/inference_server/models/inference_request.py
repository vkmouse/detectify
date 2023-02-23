class InferenceRequest:
    def __init__(self, id: str):
        self.id = id
        self.pending = False
        self.model_url = None
        self.result = None

    def set_model_url(self, model_url: str):
        self.model_url = model_url

    def set_result(self, result):
        self.result = result
        self.pending = False

    def set_pending(self):
        self.pending = True

    def is_pending(self):
        return self.pending

    def is_completed(self):
        return self.result != None

    def get_result(self):
        return list(
            map(
                lambda p: p.json(),
                self.result,
            )
        )
