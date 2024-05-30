from flask import Flask
from flask_cors import CORS
from config import Config  
from .db import init_db
from .routes.upload_notes import notes_blueprint
import pymongo

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class) 
    CORS(app)
     
    init_db(app)
   
    app.register_blueprint(notes_blueprint, url_prefix='/notes')
    return app
