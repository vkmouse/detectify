from flask import *
from flask_cors import CORS
from inference_server import config
from inference_server import route

app = Flask(__name__)
cors = CORS(app, resources={r"/.*": {"origins": [config.allowed_cors_origin]}})


app.register_blueprint(route.infer_bp)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
