#Drafted using common development resources
from bs4 import BeautifulSoup
import re

def extract_trump_words(input_text, file):
    # Initialize an empty string to store Donald Trump's words
    trump_words = []

    # Split the input text by the delimiter to isolate each speaker's segment
    sections = input_text.strip().split('------')

    for section in sections:
        # Check if the speaker is exactly "Speaker: Donald Trump"
        if "Speaker: Kamala Harris" in section:
            # Use regex to find all text blocks and remove timestamps
            text_blocks = re.findall(r'Text: ((?:(?!Text:).)+)', section, re.DOTALL)
            for text in text_blocks:
                clean_text = re.sub(r'\(\d{2}:\d{2}:\d{2}\)', '', text)  # Remove timestamps like (hh:mm:ss)
                clean_text = re.sub(r'\(\d{2}:\d{2}\)', '', clean_text)  # Remove timestamps like (mm:ss)
                clean_text = re.sub(r'\[inaudible \d{2}:\d{2}:\d{2}\]', '', clean_text)  # Remove [inaudible hh:mm:ss]
                clean_text = re.sub(r'\[inaudible \d{2}:\d{2}\]', '', clean_text)  # Remove [inaudible mm:ss]
                trump_words.append(clean_text.strip())

    # Join the collected words into a single string
    trump_speech = "\n".join(trump_words)

    # Print or save the extracted text
    print(trump_speech, file = file)

with open("harrispeeches.txt") as file1:
    with open("harrisclean.txt", 'a') as file2:
        text = file1.read()
        extract_trump_words(text,file2)
        #print(cleaned_text, file=file2)
    
