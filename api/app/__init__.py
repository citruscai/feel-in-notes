from flask import Flask
from flask_pymongo import PyMongo
from ..config import Config  
from .db import init_db

mongo = None

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class) 

    init_db(app)
   

    return app
