from flask import *
from training_server import config
from training_server import rforward
from training_server import route


app = Flask(__name__)

app.register_blueprint(route.model_bp)
app.register_blueprint(route.server_bp)

if __name__ == '__main__':
    server_host = config.server_host
    server_port = config.server_port
    username = config.username
    password = config.password

    rforward.forward_in_thread(
        server_host=server_host,
        server_port=server_port,
        remote_host="localhost",
        remote_port=9000,
        forwarded_port=80,
        username=username,
        password=password,
    )
    app.run(port=9000)
