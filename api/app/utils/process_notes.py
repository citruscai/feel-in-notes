import os
import openai
from dotenv import load_dotenv
from nltk.tokenize import sent_tokenize, word_tokenize
from keybert import KeyBERT
from summarizer import Summarizer
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

"""For moderate support guided notes, We will extract important sentences from the notes,this will be used to determine what gets blanked.
    If you want the student to sufficiently learn, blanking willy nilly might not be good enough """
def extract_important_sentences(text,summary_ratio=0.5):
    model = Summarizer()
    summary = model(text, ratio=summary_ratio)
    important_sentences = summary.split('\n')
    return important_sentences
"""For highly supported guided notes, we will make important terms as blanks """
def extract_important_words(text):
  model = KeyBERT()
  important_words = model.extract_keywords(text)
  return important_words
"""Alternarive level to fill in the blanks, instead user will be given a set of 
questions and will use their given notes to follow along and answer them"""
def generate_questions(text):
  try:
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Generate questions based on the following text: {text}",
        max_tokens=300,
        seed = 88,
        temperature=0.7,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
        
    )
    questions = response.choices[0].text.strip().split("\n")
    return questions
  except Exception as e:
    print(f"Error generating questions: {e}")
    return []
#dont forget, we are going to need to make the notes look good!
def structure_notes(text):
 prompt_text = f"""
    Generate a comprehensive note in JSON format based on the following content. The JSON should include properties such as 'title', 'sections', and 'content'. Each section should have a 'title', 'content' array, and an optional 'lists' array where applicable. Each list should have a 'list_title' and 'items'. Here's an example of how it should look:

    {{
      "title": "Sample Title",
      "sections": [
        {{
          "title": "Introduction",
          "content": ["Introduction text here..."],
          "lists": [
            {{
              "list_title": "Key Points",
              "items": ["Point 1", "Point 2", "Point 3"]
            }}
          ]
        }},
        {{
          "title": "Main Content",
          "content": ["Content text here..."]
        }}
      ]
    }}

    Now, based on this format, generate notes for this text: \"{text}\"
    """
 response = client.completions.create(model = "gpt-3.5-turbo",
 prompt=prompt_text,
 seed=88)
 return response.choices[0].text

def normalize_text(text):
    """Normalize text by removing punctuation, converting to lowercase, and trimming whitespace."""
    text = re.sub(r'\s+', ' ', text)  # Collapse whitespace
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    return text.lower().strip()

def bracket_important_sentences(sentences, important_sentences):
  """For putting brackets around the sentences, this will be a more extensive process compared to putting brackets around 
  words due to potential sentence parsing problems  """
  processed_text = []
  for sentence in sentences:
   is_imporant = False 
   for important_sentence in important_sentences:
      if fuzz.ratio(sentence, important_sentence) >= 70:
         is_imporant = True
         break
   if is_imporant:
        processed_text.append(f'[{sentence}]')
   else:
         processed_text.append(sentence)
  return processed_text






   

def process_text(text,level="high"):
  if level == "moderate":
    print("moderate")
    important_words = extract_important_words(text)
    words = word_tokenize(text)
    #if else condition: we go through every word, if the word is in the important words array, we will put brackets around it
    #but if it is not an important word, we just leave the word as is
    #then use .join to join all words together into an original text
    processed_text = ''.join('['+word+ ']' if word in important_words else word for word in words)
    formatted_text = structure_notes(processed_text)
  elif level =="high":
    important_sentences = extract_important_sentences(text)
    sentences = sent_tokenize(text)
    processed_text = bracket_important_sentences(sentences, important_sentences) 
    formatted_text = structure_notes(processed_text)
  elif level == "questions":
    questions = generate_questions(text)
    return questions
  else:
     return text
  return formatted_text
