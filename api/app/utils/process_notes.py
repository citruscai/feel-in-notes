import os
import openai
from dotenv from load_dotenv
import ntlk.tokenize import sent_tokenize, word_tokenize
from gensim.summarization import summarize,keywords

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

"""For moderate support guided notes, We will extract important sentences from the notes,this will be used to determine what gets blanked.
    If you want the student to sufficiently learn, blanking willy nilly might not be good enough """
def extract_important_sentences(text,summary_ratio=0.5):
    summarized_text = summarize(text,ratio=summary_ratio)
    important_sentences = sent_tokenize(summarized_text)
    return important_sentences
"""For highly supported guided notes, we will make important terms as blanks """
def extract_important_words(text):
  important_words = keywords(text)
  return important_words
"""Alternarive level to fill in the blanks, instead user will be given a set of 
questions and will use their given notes to follow along and answer them"""
def generate_questions(text):
   pass

   


def process_text(text,level):
   pass
   
   
    
