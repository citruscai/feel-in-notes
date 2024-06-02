from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime
from ..utils.process_notes import process_text
from app.db import get_notes_collection, get_worksheets_collection

notes_blueprint = Blueprint('notes', __name__)

@notes_blueprint.route('/upload', methods=['POST'])
def upload_text():
    """Receives plain text and processes it into a worksheet."""
    data = request.get_json()
    text = data.get('text')
    level = data.get('level')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        notes_id = uuid.uuid4()
        notes_collection = get_notes_collection()
        worksheet_collection = get_worksheets_collection()

        
        notes_collection.insert_one({
            'id': notes_id,
            'text': text,
            'date_created': datetime.now()
        })

    
        processed_text = process_text(text)
        worksheet_collection.insert_one({
            'id': notes_id,
            'text': processed_text,
            'date_created': datetime.now()
        })

        return jsonify({'text': processed_text}), 200 

    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({'error': str(e)}), 500
