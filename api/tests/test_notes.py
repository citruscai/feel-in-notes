"""Tests for the notes-related routes."""

from io import BytesIO
from flask import url_for

def test_upload_file(client):
    """Test the upload file method."""
    data = {"file": (BytesIO(b"Hello World"), "test.txt")}
    response = client.post(
        url_for("notes.upload_file"), content_type="multipart/form-data", data=data
    )
    assert response.status_code == 200

def test_upload_unsupported_file_format(client):
    """Test the upload file method with unsupported file format."""
    data = {"file": (BytesIO(b"Dummy content"), "unsupported_file_type.xyz")}
    response = client.post(
        url_for("notes.upload_file"), content_type="multipart/form-data", data=data
    )
    assert response.status_code == 400, "Expected a 400 response for unsupported file format"
