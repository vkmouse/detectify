from flask import *
from training_server import config
from training_server import rforward
from training_server import route
from training_server import utils


app = Flask(__name__, static_url_path='/static', static_folder='static/')

app.register_blueprint(route.model_bp)
app.register_blueprint(route.server_bp)

if __name__ == '__main__':
    token = input("Enter token: ")
    data = utils.parse_token(token)
    utils.mkdir_if_not_exists('static')
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
