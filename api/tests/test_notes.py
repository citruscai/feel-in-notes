import os
import pytest
from flask import url_for
from werkzeug.datastructures import FileStorage
from io import BytesIO

''' This test is meant to test when the uploads their notes,
 so currently at the moment I will only let 
 the user either upload .doc, ,docx, pdf, ppt and mp4.
 I feel like that's enough at the moment....but yes this works!'''

def test_upload_pdf(client):
    data = {
        'file': (BytesIO(b'Mock PDF content'),'test.pdf'),
    }
    response = client.post(url_for('upload_file'),content_type='multipart/form-data',data=data)
    assert response.status_code == 200
    assert 'File uploaded sucessfully' in response.data.decode()

def test_upload_doc(client):
    data = {
        'file': (BytesIO(b'Mock DOC content'),'test.doc'),
    }
    response = client.post(url_for('upload_file'),content_type='multipart/form-data',data=data)
    assert response.status_code == 200
    assert 'File uploaded sucessfully' in response.data.decode()

def test_upload_docx(client):
    data = {
        'file': (BytesIO(b'Mock DOCX content'),'test.docx'),
    }
    response = client.post(url_for('upload_file'),content_type='multipart/form-data',data=data)
    assert response.status_code == 200
    assert 'File uploaded sucessfully' in response.data.decode()

def test_upload_ppt(client):
    data = {
        'file': (BytesIO(b'Mock PPT content'),'test.ppt'),
    }
    response = client.post(url_for('upload_file'),content_type='multipart/form-data',data=data)
    assert response.status_code == 200
    assert 'File uploaded sucessfully' in response.data.decode()

def test_upload_video(client):
    data = {
        'file': (BytesIO(b'Mock video content'), 'test.mp4'),
    }
    response = client.post(url_for('upload_file'), content_type='multipart/form-data', data=data)
    assert response.status_code == 200
    assert 'File uploaded successfully' in response.data.decode()

def test_upload_unsupported_file_type(client):
    data = {
        'file': (BytesIO(b'Mock content'),'test.abc'),
    }
    response = client.post(url_for('upload_file'), content_type='multipart/form-data', data=data)
    assert response.status_code == 400
    assert 'Unsupported file type' in response.data.decode()
