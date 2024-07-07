"""Utilities for processing notes including text normalization, keyword extraction, and more."""

import os
import re
import nltk
from nltk.tokenize import word_tokenize
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

def extract_important_sentences(text, summary_ratio=0.8):
    """Extract key sentences using a summarization model."""
    model = Summarizer()
    summary = model(text, ratio=summary_ratio)
    return summary.split(',')

def extract_important_words(text):
    """Extract key words using the KeyBERT model."""
    model = KeyBERT()
    keywords = model.extract_keywords(text, stop_words='english')
    return {normalize_text(word) for word, _ in keywords}

def mark_important_words(text, important_words):
    """Mark important words in the text with HTML <mark> tags."""
    words = word_tokenize(text)
    return ' '.join(
        f'<mark>{word}</mark>' if normalize_text(word) in important_words else word
        for word in words
    )

def mark_important_sentences(full_text, important_sentences):
    """Extract and mark key important sentences."""
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
        response = model.generate_content(
            f"Generate questions with respective answers based on the following text: {text}"
        )
        return response.text
    except Exception as e:
        print(f"Error generating questions: {e}")
        return []

def structure_notes(text):
    """Generate structured notes from text using Gemini API."""
    prompt_text = f"""
    Convert the following text into a structured JSON format suitable for creating fill-in-the-blank guided notes. 
    Ensure the JSON has 'title' for section titles, 'content' for paragraph texts, and 'lists' for bullet points or 
    numbered lists. Importantly:
    - Generate a title based on the content if none is found.
    - Remove any '<mark>' tags from the 'title' property.
    - Preserve all existing '<mark>' tags in 'content', 'items', and any list-related properties.
    - Add new '<mark>' tags around longer, significant information in 'content' and 'items' to create meaningful 
    fill-in-the-blank sections. Each section should include longer phrases or sentences with '<mark>' tags suitable 
    for fill-in-the-blank notes. If a section or list item already contains markings, ensure additional significant 
    information is also marked.
    Please make sure each content is at least 40% marked.

    Example structure:

    {{
      "title": "Main Title of the Document",
      "sections": [
        {{
          "title": "Section Title",
          "content": ["First paragraph of the section...", "<mark>Highlighted text that spans a phrase or sentence</mark> 
          should remain unaltered."],
          "lists": [
            {{
              "list_title": "Key Points",
              "items": ["First key point with <mark>important</mark> information...", "Second key point with <mark>critical 
              details</mark>..."]
            }}
          ]
        }},
        {{
          "title": "Next Section Title",
          "content": ["Introduction to the section..."]
        }}
      ]
    }}

    Given this structure, please format the following text for fill-in-the-blank guided notes, preserving all existing 
    '<mark>' tags and ensuring that new '<mark>' tags cover longer phrases or sentences in 'content' and 'items': {text}
    """
    safety_settings = [
        {"category": "HARM_CATEGORY_DANGEROUS", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
    ]
    model = gemini.GenerativeModel(
        model_name='gemini-1.5-flash', safety_settings=safety_settings
    )
    response = model.generate_content(prompt_text)
    print(response.text)
    return response.text

def structure_questions(text):
    """Generate structured questions from text using Gemini API."""
    prompt_text = f"""
    Please convert the following marked text into a structured JSON format without altering any content. 
    Organize the text into a JSON object with a generated 'title' for the overall text and 'questions' as 
    the top-level key and a list of individual questions as the value. Each question should be a dictionary 
    with 'question' and 'answer' keys. The 'question' value should be the question text, and the 'answer' 
    value should be the corresponding answer. Do not modify the text inside the tags Example structure:

    {{
    "title": "Sample Text",
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
        print(processed_text)
    elif level == "questions":
        processed_text = generate_questions(normalized_text)
        return structure_questions(processed_text)
    else:
        return "Invalid level specified"
    
    return structure_notes(processed_text)
