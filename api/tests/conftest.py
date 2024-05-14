import pytest
from ..app import create_app
from ..config import TestingConfig
from dotenv import load_dotenv

load_dotenv()

@pytest.fixture(scope="module")
def app():
    """Create a Flask app context for the tests."""
    app = create_app(TestingConfig) 

    return app

@pytest.fixture(scope="module")
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture(scope="module")
def monkeypatch_module(monkeypatch):
    """Provide monkeypatch functionality at a module scope."""
    yield monkeypatch

@pytest.fixture(scope="module")
def mock_mongo(monkeypatch_module):
    class MockMongo:
        def __init__(self):
            self.db = {
                'users': MockCollection(),
                'notes': MockCollection(),
                'worksheets': MockCollection(),
               
            }

    class MockCollection:
        def __init__(self):
            self.data = []

        def insert_one(self, doc):
            doc['inserted_id'] = len(self.data) + 1
            self.data.append(doc)
            return {"inserted_id": doc['inserted_id']}

        def find(self):
            return self.data

        def find_one(self, query):
            return next((item for item in self.data if item == query), None)

    mock_db = MockMongo()
    monkeypatch_module.setattr('app.db.mongo', mock_db)  

    return mock_db
