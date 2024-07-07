"""Fixtures for testing the Flask application."""

import pytest
from unittest.mock import MagicMock, patch
from config import TestingConfig
from app import create_app

@pytest.fixture(scope="module")
def app_fixture():
    """Create a Flask app context for the tests."""
    _app = create_app(TestingConfig)
    ctx = _app.app_context()
    ctx.push()
    yield _app
    ctx.pop()

@pytest.fixture(scope="module")
def client(app_fixture):
    """A test client for the app."""
    return app_fixture.test_client()

@pytest.fixture(scope="module")
def mock_mongo():
    """Mock MongoDB connections."""
    with patch('app.db.mongo.db') as mock_db:
        mock_notes_collection = MagicMock()
        mock_worksheets_collection = MagicMock()

        mock_db.notes = mock_notes_collection
        mock_db.worksheets = mock_worksheets_collection

        yield mock_db
