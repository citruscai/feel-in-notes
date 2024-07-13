import json
import pytest
from io import BytesIO
from flask import url_for

def test_upload_worksheet_success(client, mock_mongo):
    """Test successful worksheet upload."""
    data = {"file": (BytesIO(b"Hello World"), "test.pdf")}
    response = client.post(
        url_for("worksheets.upload_worksheet"), content_type="multipart/form-data", data=data
    )
    assert response.status_code == 200
    assert "file_url" in response.json

def test_upload_worksheet_no_file(client):
    """Test worksheet upload with no file."""
    response = client.post(url_for("worksheets.upload_worksheet"))
    assert response.status_code == 400
    assert response.json == {"error": "No file part in the request"}

def test_upload_worksheet_empty_file(client):
    """Test worksheet upload with an empty file."""
    data = {"file": (BytesIO(b""), "empty.pdf")}
    response = client.post(
        url_for("worksheets.upload_worksheet"), content_type="multipart/form-data", data=data
    )
    assert response.status_code == 400
    assert response.json == {"error": "File is empty"}

def test_save_urls_invalid_uuid(client, mock_mongo):
    """Test saving URLs with an invalid UUID."""
    data = {
        "id": "invalid-uuid",
        "guidedNotesUrl": "http://example.com/guided-notes",
        "solutionsUrl": "http://example.com/solutions"
    }
    response = client.put(url_for("worksheets.save_urls"), json=data)
    assert response.status_code == 400
    assert "Invalid UUID" in response.json["error"]

@pytest.mark.parametrize("worksheet_exists", [True, False])
def test_save_urls_success(client, mock_mongo, worksheet_exists):
    """Test saving URLs for a worksheet."""
    worksheet_id = "123e4567-e89b-12d3-a456-426614174000"
    data = {
        "id": worksheet_id,
        "guidedNotesUrl": "http://example.com/guided-notes",
        "solutionsUrl": "http://example.com/solutions"
    }

    if worksheet_exists:
        mock_mongo.worksheets.update_one.return_value.matched_count = 1
    else:
        mock_mongo.worksheets.update_one.return_value.matched_count = 0

    response = client.put(url_for("worksheets.save_urls"), json=data)

    if worksheet_exists:
        assert response.status_code == 200
        assert response.json == {"message": "URLs saved successfully"}
    else:
        assert response.status_code == 404
        assert response.json == {"error": "Worksheet not found"}

@pytest.mark.parametrize("worksheet_exists", [True, False])
def test_get_worksheet(client, mock_mongo, worksheet_exists):
    """Test retrieving a worksheet by ID."""
    worksheet_id = "123e4567-e89b-12d3-a456-426614174000"

    if worksheet_exists:
        mock_mongo.worksheets.find_one.return_value = {"id": worksheet_id, "name": "Sample Worksheet"}
    else:
        mock_mongo.worksheets.find_one.return_value = None

    response = client.get(url_for("worksheets.get_worksheet", worksheet_id=worksheet_id))

    if worksheet_exists:
        assert response.status_code == 200
        assert json.loads(response.data) == {"id": worksheet_id, "name": "Sample Worksheet"}
    else:
        assert response.status_code == 404
        assert response.json == {"error": "Worksheet not found"}

@pytest.mark.parametrize("worksheet_exists", [True, False])
def test_get_urls(client, mock_mongo, worksheet_exists):
    """Test retrieving URLs for guided notes and solutions."""
    worksheet_id = "123e4567-e89b-12d3-a456-426614174000"

    if worksheet_exists:
        mock_mongo.worksheets.find_one.return_value = {
            "id": worksheet_id,
            "guided_notes_url": "http://example.com/guided-notes",
            "solutions_url": "http://example.com/solutions"
        }
    else:
        mock_mongo.worksheets.find_one.return_value = None

    response = client.get(url_for("worksheets.get_urls", worksheet_id=worksheet_id))

    if worksheet_exists:
        assert response.status_code == 200
        assert response.json == {
            "guidedNotesUrl": "http://example.com/guided-notes",
            "solutionsUrl": "http://example.com/solutions"
        }
    else:
        assert response.status_code == 404
        assert response.json == {"error": "Worksheet not found"}
