from flask import *
from training_server import route


app = Flask(__name__)

app.register_blueprint(route.model_bp)
app.register_blueprint(route.server_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000, debug=True)
