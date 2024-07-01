from flask import Blueprint, request, jsonify
import boto3
import os
import tempfile
from werkzeug.utils import secure_filename
from bson import json_util, ObjectId
from app.db import get_worksheets_collection
from dotenv import load_dotenv
import uuid

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
    try:
        print("Starting upload worksheet process...")

        if "file" not in request.files:
            print("No file part in the request")
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files["file"]

        if file.filename == "":
            print("No selected file")
            return jsonify({"error": "No selected file"}), 400

        if file:
            print(f"Received file: {file}")
            filename = secure_filename(file.filename)
            print(f"Filename: {filename}")
            print(f"Content-Type: {file.content_type}")

            content_length = len(file.read())
            print(f"File content length: {content_length}")

            file.seek(0)

            if content_length == 0:
                print("File is empty")
                return jsonify({"error": "File is empty"}), 400

            sanitized_filename = secure_filename(file.filename)
            print(f"Sanitized filename: {sanitized_filename}")

            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                temp_file.write(file.read())
                temp_file_path = temp_file.name

            print(f"File saved temporarily to {temp_file_path}")

            try:
                s3_client.upload_file(temp_file_path, BUCKET_NAME, sanitized_filename)
                file_url = (
                    f"https://{BUCKET_NAME}.s3.amazonaws.com/{sanitized_filename}"
                )
                print(f"File uploaded successfully to: {file_url}")
            except Exception as e:
                print(f"Error uploading file to S3: {e}")
                return jsonify({"error": f"Error uploading file to S3: {e}"}), 500
            finally:

                os.remove(temp_file_path)
                print(f"Temporary file {temp_file_path} removed")

            return jsonify({"file_url": file_url}), 200
        else:
            print("Invalid file")
            return jsonify({"error": "Invalid file"}), 400
    except Exception as e:
        print(f"Error during file upload: {e}")
        return jsonify({"error": str(e)}), 500


# saving s3 urls into the worksheet schema
@worksheets_bp.route("/save-urls", methods=["PUT"])
def save_urls():
    try:
        data = request.json
        worksheet_id = data["id"]
        guided_notes_url = data["guidedNotesUrl"]
        solutions_url = data["solutionsUrl"]

        try:
            uuid_obj = uuid.UUID(worksheet_id)
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
    try:
        worksheets = get_worksheets_collection()
        worksheet = worksheets.find_one({"id": worksheet_id})
        if not worksheet:
            return jsonify({"error": "Worksheet not found"}), 404

        guided_notes_url = worksheet.get("guided_notes_url", "")
        solutions_url = worksheet.get("solutions_url", "")

        return (
            jsonify(
                {"guidedNotesUrl": guided_notes_url, "solutionsUrl": solutions_url}
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
