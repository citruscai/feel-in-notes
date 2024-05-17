from flask import Flask
from flask_pymongo import PyMongo
from api.config import Config  
from .db import init_db
from .routes.upload_notes import notes_blueprint


mongo = None

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class) 


    init_db(app)
   
    app.register_blueprint(notes_blueprint, url_prefix='/notes')
    return app
