from flask import *
from inference_server import route


app = Flask(__name__)

app.register_blueprint(route.infer_bp)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
