from flask import Flask
from flask_cors import CORS
from config import Config  
from .db import init_db
from .routes.notes import notes_blueprint
from .routes.worksheets import worksheets_bp
import pymongo

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class) 
    CORS(app)
     
    init_db(app)
   
    app.register_blueprint(notes_blueprint, url_prefix='/notes')
    app.register_blueprint(worksheets_bp,url_prefix='/worksheets')
    return app
