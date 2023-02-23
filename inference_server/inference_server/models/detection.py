class Detection:
    def __init__(
        self,
        name: str,
        confidence: float,
        x: int,
        y: int,
        width: int,
        height: int,
    ):
        self.name = name
        self.confidence = confidence
        self.x = x
        self.y = y
        self.width = width
        self.height = height

    def json(self):
        return {
            "name": self.name,
            "confidence": self.confidence,
            "x": self.x,
            "y": self.y,
            "width": self.width,
            "height": self.height,
        }
