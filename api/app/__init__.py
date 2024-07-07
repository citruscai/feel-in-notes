"""Initialize the Flask application and register blueprints."""

from flask import Flask
from flask_cors import CORS
from config import Config
from .db import init_db
from .routes.notes import notes_bp
from .routes.worksheets import worksheets_bp

def create_app(config_class=Config):
    """Create and configure the Flask application.

    Args:
        config_class (class): The configuration class to use for the app.
    
    Returns:
        Flask: The configured Flask application.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app)

    init_db(app)

    app.register_blueprint(notes_bp, url_prefix='/notes')
    app.register_blueprint(worksheets_bp, url_prefix='/worksheets')
    return app
