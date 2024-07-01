from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime
from bson import ObjectId
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
        notes_id = str(uuid.uuid4())  
        worksheet_collection = get_worksheets_collection()
        notes_collection = get_notes_collection()

        notes_collection.insert_one({
            'id': notes_id,
            'text': text,
            'date_created': datetime.now()
        })

        processed_text = process_text(text, level)
        worksheet_collection.insert_one({
            'id': notes_id,
            'text': processed_text,
            'date_created': datetime.now()
        })
        response = {
            'text': processed_text,
            'level': level,
            'id': notes_id
        }

        return jsonify(response), 200

    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({'error': str(e)}), 500

    
@notes_blueprint.route('/<id>', methods=['GET'])
def get_notes(id):
    """Returns the worksheet with the given ID."""
    try:
        notes_collection = get_notes_collection()
        notes = notes_collection.find_one({'id': id})
        if notes:
            notes['_id'] = str(notes['_id'])  # Convert ObjectId to string
            return jsonify(notes), 200
        else:
            return jsonify({'error': 'Worksheet not found'}), 404
    except Exception as e:
        print(f"Error retrieving notes: {str(e)}")
        return jsonify({'error': str(e)}), 500
