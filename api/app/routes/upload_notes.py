from flask import Blueprint,request,jsonify
import textract
from ..utils.process_notes import process_text


notes_blueprint = Blueprint('notes',__name__)



@notes_blueprint.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error':'No file uploaded'}),400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error':'No file selected'}),400
    try:
        text = extract_text(file)
        processed_text = process_text(text)
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


