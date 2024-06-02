import os
import re
import nltk
from nltk.tokenize import  word_tokenize
from keybert import KeyBERT
from summarizer import Summarizer
import google.generativeai as gemini
from dotenv import load_dotenv


nltk.download('punkt')
load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')
gemini.configure(api_key=api_key)

def normalize_text(text):
    """Normalize text by removing excessive spaces and newline characters."""
    return re.sub(r'\s+', ' ', text).strip()

def extract_important_sentences(text, summary_ratio=0.5):
    """Extract key sentences using a summarization model."""
    model = Summarizer()
    summary = model(text, ratio=summary_ratio)
    return summary.split(',')

def extract_important_words(text):
    """Extract key words using the KeyBERT model."""
    model = KeyBERT()
    keywords = model.extract_keywords(text, keyphrase_ngram_range=(1, 1), stop_words='english')
    return set([normalize_text(word) for word, _ in keywords])

def mark_important_words(text, important_words):
    """Mark important words in the text with HTML <mark> tags."""
    words = word_tokenize(text)
    return ' '.join(f'<mark>{word}</mark>' if normalize_text(word) in important_words else word for word in words)

def mark_important_sentences(full_text, important_sentences):
    """ Extract and mark key important sentences"""
    for fragment in important_sentences:
        escaped_fragment = re.escape(fragment)
        pattern = re.compile(r'{}'.format(escaped_fragment), re.IGNORECASE)
        if pattern.search(full_text):
            full_text = pattern.sub(r'<mark>\g<0></mark>', full_text)

    return full_text

def generate_questions(text):
    """Generate questions from text using Gemini API."""
    try:
        model = gemini.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(f"Generate questions with respective answers based on the following text: {text}")
        return response.text
    except Exception as e:
        print(f"Error generating questions: {e}")
        return []

def structure_notes(text):
    """Generate structured notes from text using Gemini API."""
    prompt_text = f"""
    Please convert the following marked text into a structured JSON format without altering any content, especially not removing any '<mark>' tags. Organize the text into a JSON object with sections for titles, contents, and lists where applicable. The JSON should include 'title' for section titles, 'content' for paragraph texts, and 'lists' for any bullet points or numbered lists. Do not modify the text inside the tags, and ensure that any special formatting like '<mark>' is preserved. Example structure:

    {{
      "title": "Main Title of the Document",
      "sections": [
        {{
          "title": "Section Title",
          "content": ["First paragraph of the section...", "<mark>Highlighted text</mark> should remain unaltered."],
          "lists": [
            {{
              "list_title": "Key Points",
              "items": ["First key point...", "Second key point..."]
            }}
          ]
        }},
        {{
          "title": "Next Section Title",
          "content": ["Introduction to the section..."]
        }}
      ]
    }}

    Given this structure, please format the following text: {text}
    """
    model = gemini.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt_text)
    return response.text

def structure_questions(text):
    """Generate structured questions from text using Gemini API."""
    prompt_text = f"""
    Please convert the following marked text into a structured JSON format without altering any content. Organize the text into a JSON object with 'questions' as the top-level key and a list of individual questions as the value. Each question should be a dictionary with 'question' and 'answer' keys. The 'question' value should be the question text, and the 'answer' value should be the corresponding answer. Do not modify the text inside the tags Example structure:

    {{
      "questions": [
        {{
          "question": "What is the capital of France?",
          "answer": "The capital of France is Paris."
        }},
        {{
          "question": "Who wrote Hamlet?",
          "answer": "The author of Hamlet is Shakespeare."
        }}
      ]
    }}

    Given this structure, please format the following text: {text}
    """
    model = gemini.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt_text)
    print(response.text)
    return response.text

def process_text(text, level="questions"):
    """Process text based on specified level of support."""
    normalized_text = normalize_text(text)
    if level == "high":
        important_words = extract_important_words(normalized_text)
        processed_text = mark_important_words(text, important_words)
        print(processed_text)
    elif level == "moderate":
        important_sentences = extract_important_sentences(normalized_text)
        processed_text = mark_important_sentences(normalized_text, important_sentences)
    elif level == "questions":
        processed_text = generate_questions(normalized_text)
        return structure_questions(processed_text)
       
    else:
        return "Invalid level specified"
    
    return structure_notes(processed_text)


