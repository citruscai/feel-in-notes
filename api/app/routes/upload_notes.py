from flask import Flask,request,jsonify
import textract


app = Flask(__name__)

@app.route('/upload', methods =['POST'])
def upload_file():
    pass
    
       

#using textract to extract the text from the uploaded file the user submits
def extract_text(file):
    try:
        text =  text = textract.process(file.read(),extension='.'+file.filename.split('.')[-1])
        return text.decode('utf-8')
    except Exception as e: 
        return str(e)

#where the magic is suppose to happen...we create the notes
def process_notes(text,level):
    pass
