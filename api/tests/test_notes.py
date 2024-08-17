import pytest
from unittest.mock import patch
from flask import url_for

def test_upload_text_success(client, mock_mongo):
    """Test successful upload of text and processing into a worksheet."""
    data = {
        "text": "This is a sample text.",
        "level": "questions"
    }

    with patch("app.routes.notes.process_text", return_value="Processed Text"):
        response = client.post(url_for("notes.upload_text"), json=data)
    
    assert response.status_code == 200
    assert "text" in response.json
    assert response.json["text"] == "Processed Text"
    assert "id" in response.json
    assert "level" in response.json
    assert response.json["level"] == "questions"

def test_upload_text_no_text(client):
    """Test upload of text with no text provided."""
    data = {
        "level": "questions"
    }

    response = client.post(url_for("notes.upload_text"), json=data)
    assert response.status_code == 400
    assert response.json == {"error": "No text provided"}

def test_upload_text_processing_error(client, mock_mongo):
    """Test upload of text with a processing error."""
    data = {
        "text": "This is a sample text.",
        "level": "questions"
    }

    with patch("app.routes.notes.process_text", side_effect=ValueError("Processing error")):
        response = client.post(url_for("notes.upload_text"), json=data)
    
    assert response.status_code == 400
    assert "error" in response.json
    assert response.json["error"] == "Processing error"

def test_upload_text_server_error(client, mock_mongo):
    """Test upload of text with a server error."""
    data = {
        "text": "This is a sample text.",
        "level": "questions"
    }

    with patch("app.routes.notes.process_text", side_effect=Exception("Server error")):
        response = client.post(url_for("notes.upload_text"), json=data)
    
    assert response.status_code == 500
    assert "error" in response.json
    assert response.json["error"] == "Server error"

@pytest.mark.parametrize("mock_note, status_code, expected_response", [
    ({"id": "123e4567-e89b-12d3-a456-426614174000", "text": "This is a sample note.", "_id": "some_id"}, 200, {"id": "123e4567-e89b-12d3-a456-426614174000", "text": "This is a sample note."}),
    (None, 404, {"error": "Worksheet not found"})
])
def test_get_notes(client, mock_mongo, mock_note, status_code, expected_response):
    """Test retrieving a guided notes by ID."""
    note_id = "123e4567-e89b-12d3-a456-426614174000"

    mock_mongo.notes.find_one.return_value = mock_note

    response = client.get(url_for("notes.get_notes", note_id=note_id))
    assert response.status_code == status_code
    
    if mock_note:
        response_json = response.json
        del response_json['_id']  
        assert response_json == expected_response
    else:
        assert response.json == expected_response

def test_get_notes_value_error(client, mock_mongo):
    """Test retrieving a guided notes by ID with a value error."""
    note_id = "invalid-uuid"

    with patch("app.routes.notes.get_notes_collection", side_effect=ValueError("Value error")):
        response = client.get(url_for("notes.get_notes", note_id=note_id))
    
    assert response.status_code == 400
    assert "error" in response.json
    assert response.json["error"] == "Value error"

def test_get_notes_server_error(client, mock_mongo):
    """Test retrieving guided notes by ID with a server error."""
    note_id = "123e4567-e89b-12d3-a456-426614174000"

    with patch("app.routes.notes.get_notes_collection", side_effect=Exception("Server error")):
        response = client.get(url_for("notes.get_notes", note_id=note_id))
    
    assert response.status_code == 500
    assert "error" in response.json
    assert response.json["error"] == "Server error"
