from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.httpauth import HTTPBasicAuth

server = Flask(__name__)
server.config.from_object('config')
db = SQLAlchemy(server)
auth = HTTPBasicAuth()


from .api import api as api_blueprint 
server.register_blueprint(api_blueprint, url_prefix='/api/v1.0')


from .main import main as main_blueprint
server.register_blueprint(main_blueprint)


from server import models
