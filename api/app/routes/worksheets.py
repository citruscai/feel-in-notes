"""Routes for handling worksheet-related operations."""
import os
import uuid
from flask import Blueprint, request, jsonify
import boto3
from werkzeug.utils import secure_filename
from bson import json_util
from dotenv import load_dotenv
from ..db import get_worksheets_collection


load_dotenv()
worksheets_bp = Blueprint("worksheets", __name__)
s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION"),
)

BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

@worksheets_bp.route("/upload", methods=["POST"])
def upload_worksheet():
    """Handle uploading a worksheet file to S3 and return the file URL."""
    try:
        print("Starting upload worksheet process...")

        if "file" not in request.files:
            print("No file part in the request")
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files["file"]

        if file.filename == "":
            print("No selected file")
            return jsonify({"error": "No selected file"}), 400

        if not file:
            print("Invalid file")
            return jsonify({"error": "Invalid file"}), 400


        content_length = len(file.read())
        file.seek(0)

        if content_length == 0:
            print("File is empty")
            return jsonify({"error": "File is empty"}), 400

        sanitized_filename = secure_filename(file.filename)
        print(f"Sanitized filename: {sanitized_filename}")

        try:
            s3_client.upload_fileobj(file, BUCKET_NAME, sanitized_filename)
            file_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{sanitized_filename}"
            print(f"File uploaded successfully to: {file_url}")
        except boto3.exceptions.S3UploadFailedError as e:
            print(f"Error uploading file to S3: {e}")
            return jsonify({"error": f"Error uploading file to S3: {e}"}), 500

        return jsonify({"file_url": file_url}), 200

    except Exception as e:
        print(f"Error during file upload: {e}")
        return jsonify({"error": str(e)}), 500

@worksheets_bp.route("/save-urls", methods=["PUT"])
def save_urls():
    """Save URLs for guided notes and solutions to the worksheet document."""
    try:
        data = request.json
        worksheet_id = data.get("id")
        guided_notes_url = data.get("guidedNotesUrl")
        solutions_url = data.get("solutionsUrl")

        try:
            uuid.UUID(worksheet_id)
        except ValueError as e:
            return jsonify({"error": f"Invalid UUID: {str(e)}"}), 400

        worksheets = get_worksheets_collection()
        result = worksheets.update_one(
            {"id": worksheet_id},
            {
                "$set": {
                    "guided_notes_url": guided_notes_url,
                    "solutions_url": solutions_url,
                }
            },
        )

        if result.matched_count == 0:
            return jsonify({"error": "Worksheet not found"}), 404

        return jsonify({"message": "URLs saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@worksheets_bp.route("/<worksheet_id>", methods=["GET"])
def get_worksheet(worksheet_id):
    """Retrieve the worksheet with the given ID."""
    try:
        worksheets = get_worksheets_collection()
        worksheet = worksheets.find_one({"id": worksheet_id})
        if not worksheet:
            return jsonify({"error": "Worksheet not found"}), 404

        return json_util.dumps(worksheet), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@worksheets_bp.route("/<worksheet_id>/urls", methods=["GET"])
def get_urls(worksheet_id):
    """Retrieve URLs for guided notes and solutions of a worksheet."""
    try:
        worksheets = get_worksheets_collection()
        worksheet = worksheets.find_one({"id": worksheet_id})
        if not worksheet:
            return jsonify({"error": "Worksheet not found"}), 404

        guided_notes_url = worksheet.get("guided_notes_url", "")
        solutions_url = worksheet.get("solutions_url", "")

        return jsonify({"guidedNotesUrl": guided_notes_url, "solutionsUrl": solutions_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
