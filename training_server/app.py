from flask import Flask
from training_server import rforward
from training_server.routes import model_bp
from training_server.utils import utils


app = Flask(__name__)

app.register_blueprint(model_bp)

if __name__ == '__main__':
    token = input("Enter token: ")
    data = utils.parse_token(token)
    if data:
        rforward.forward_in_thread(
            server_host=data['host'],
            server_port=data['port'],
            remote_host="localhost",
            remote_port=9000,
            forwarded_port=80,
            username=data['username'],
            password=data['password'],
        )
        app.run(port=9000)
    else:
        print('token error')
