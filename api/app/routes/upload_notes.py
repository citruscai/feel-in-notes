from flask import Blueprint,request,jsonify
import textract
from ..utils.process_notes import process_text
import uuid
import datetime
from ..db import get_notes_collection,get_worksheets_collection


notes_blueprint = Blueprint('notes',__name__)



@notes_blueprint.route('/upload', methods=['POST'])
def upload_file():

    if 'file' not in request.files:
        return jsonify({'error':'No file uploaded'}),400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error':'No file selected'}),400
    notes_id = uuid.uuid4()
    notes_collection = get_notes_collection()
    worksheet_collection = get_worksheets_collection()
    try:
        text = extract_text(file)
        notes_collection.insert_one({'id':notes_id,'text':text,'date_created': datetime.utcnow()})
        processed_text = process_text(text)
        worksheet_collection.insert_one({'id':notes_id, 'text':processed_text, 'date_created': datetime.utcnow()})
        return jsonify({'text':processed_text}),200
    except Exception as e:
        return jsonify({'error':str(e)}),400
    
       

#using textract to extract the text from the uploaded file the user submits
def extract_text(file):
    try:
        text =  text = textract.process(file.read(),extension='.'+file.filename.split('.')[-1])
        return text.decode('utf-8')
    except Exception as e: 
        return str(e)


