from flask import *
from flask_cors import CORS
from inference_server.routes import predict_bp
from inference_server.utils import allowed_cors_origin


app = Flask(__name__)
cors = CORS(app, resources={r"/.*": {"origins": [allowed_cors_origin]}})

app.register_blueprint(predict_bp)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
