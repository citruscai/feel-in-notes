"""Routes for handling notes-related operations."""

import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify
from bson import ObjectId
from ..utils.process_notes import process_text
from ..db import get_notes_collection, get_worksheets_collection

notes_bp = Blueprint('notes', __name__)

@notes_bp.route('/upload', methods=['POST'])
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
            'date_created': datetime.now(),
            'level': level
        })
        response = {
            'text': processed_text,
            'level': level,
            'id': notes_id
        }

        return jsonify(response), 200

    except ValueError as e:
        print(f"Value error: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@notes_bp.route('/<note_id>', methods=['GET'])
def get_notes(note_id):
    """Returns the worksheet with the given ID."""
    try:
        notes_collection = get_notes_collection()
        notes = notes_collection.find_one({'id': note_id})
        if notes:
            notes['_id'] = str(notes['_id'])  
            return jsonify(notes), 200
        return jsonify({'error': 'Worksheet not found'}), 404
    except ValueError as e:
        print(f"Value error: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Error retrieving notes: {str(e)}")
        return jsonify({'error': str(e)}), 500
