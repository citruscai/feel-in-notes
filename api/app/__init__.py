from flask import Flask
from flask_pymongo import PyMongo
from config import Config  
from .db import init_db
from .routes.upload_notes import notes_blueprint

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class) 
    print("MongoDB URI: ", app.config['MONGO_URI'])

    init_db(app)
   
    app.register_blueprint(notes_blueprint, url_prefix='/notes')
    return app
