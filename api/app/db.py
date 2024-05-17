from flask_pymongo import PyMongo

mongo = None

def init_db(app):
    global mongo
    mongo = PyMongo(app)
    return mongo


def get_notes_collection():
    return mongo.db.notes

def get_worksheets_collection():
    return mongo.db.worksheets