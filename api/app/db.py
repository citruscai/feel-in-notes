"""Database initialization and collection retrieval for the Flask app."""

from pymongo import MongoClient

CLIENT = None
DB = None

def init_db(app):
    """Initialize the MongoDB client and database.

    Args:
        app (Flask): The Flask application instance.
    """
    global CLIENT, DB
    mongo_uri = app.config.get('MONGO_URI')
    CLIENT = MongoClient(mongo_uri, uuidRepresentation='standard')
    DB = CLIENT.db

def get_notes_collection():
    """Retrieve the notes collection from the database.

    Returns:
        Collection: The notes collection.
    """
    return DB.notes

def get_worksheets_collection():
    """Retrieve the worksheets collection from the database.

    Returns:
        Collection: The worksheets collection.
    """
    return DB.worksheets
