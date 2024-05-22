
from flask import url_for

from werkzeug.datastructures import FileStorage
from io import BytesIO




def test_upload_file(client, mock_mongo):
    data = {
        'file': (BytesIO(b"Hello World"), 'test.txt')
    }
    response = client.post(url_for('notes.upload_file'), content_type='multipart/form-data', data=data)
    assert response.status_code == 200

        