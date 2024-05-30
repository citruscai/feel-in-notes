from pymongo import MongoClient


client = None
db = None

def init_db(app):
    global client, db
    mongo_uri = app.config.get('MONGO_URI')
    client = MongoClient(mongo_uri,uuidRepresentation='standard')
    db = client.db  

def get_notes_collection():
    return db.notes 

def get_worksheets_collection():
    return db.worksheets 
