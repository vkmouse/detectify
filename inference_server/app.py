from flask import *
import inference_server.route as route


app = Flask(__name__)

app.register_blueprint(route.infer_bp)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
