from flask_pymongo import PyMongo
 
mongo = PyMongo()

def init_db(app):
    mongo = PyMongo(app)
    mongo.init_app(app)
    return mongo


def get_notes_collection():
    return mongo.db.notes

def get_worksheets_collection():
    return mongo.db.worksheets