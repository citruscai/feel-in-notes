import textract
from ..utils.process_notes import process_text
import uuid
from datetime import datetime
from app.db import mongo
from flask import Blueprint,request,jsonify



notes_blueprint = Blueprint('notes',__name__)

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'doc', 'docx', 'ppt', 'pptx','mp3','epub'}

def allowed_file(filename):
    """
    Checks if the file extension is allowed
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@notes_blueprint.route('/upload', methods=['POST'])
def upload_file():
    """Uploads a file to the database and then converts it into worksheet"""
    print("Received request with files:", request.files)
    if 'file' not in request.files:
        print("Error: No file part in the request")
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    if file.filename == '':
        print("Error: No file selected")
        return jsonify({'error': 'No file selected'}), 400
    if not allowed_file(file.filename):
        return jsonify({'error': 'Unsupported file format'}), 400
    
    try:
        notes_id = uuid.uuid4()
        level = request.form.get('level')
        text = extract_text(file)
        notes_collection = mongo.db.notes
        worksheet_collection = mongo.db.worksheets
        notes_collection.insert_one({'id': notes_id, 'text': text, 'date_created': datetime.now()})
        processed_text = process_text(text,level)
        worksheet_collection.insert_one({'id': notes_id, 'text': processed_text, 'date_created': datetime.now()})
        return jsonify({'text': processed_text}), 200
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({'error': str(e)}), 500


#using textract to extract the text from the uploaded file the user submits
def extract_text(file):
    """
    Extracts text from the uploaded file.
    """
    try:
        text =  text = textract.process(file.read(),extension='.'+file.filename.split('.')[-1])
        return text.decode('utf-8')
    except Exception as e: 
        return str(e)


