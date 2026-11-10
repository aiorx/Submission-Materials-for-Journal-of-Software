from PyPDF2 import PdfReader
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from collections import defaultdict
from nltk.probability import FreqDist
import heapq
import nltk

nltk.download('punkt_tab')
nltk.download('stopwords')


def main():


    clean_text: str = extract_notes('15.pdf')
    title: str = extract_title('15.pdf')
    for i in range(len(title)):
        print(title[i], '///////////////////')

    """for i in range(len(clean_text)):
        summary = summarize_text(clean_text[i], num_sentences=2)
        print(summary, '\n')"""

    

def extract_title(notes: str):
    reader = PdfReader(notes) #save pdf data to file
    num_pages: int = int(len(reader.pages)) #get number of slides
    title = []
    for slide in range(num_pages):
        title_name_period = reader.pages[slide]
        contents: str = title_name_period.extract_text()
        text: str = ''
        if 'Discussion Question' in contents or 'Closing Questions' in contents or ('Discussion' and 'Question') in contents or ('Closing' and 'Questions') in contents:
            continue
        #copies all text until reach newline, then append that to the list
        for char in range(len(contents)):
            text += contents[char]
            if text[char] == '\n' and len(text) < 40:
                break
        title.append(text)    
    return title

def extract_notes(notes: str):

    reader = PdfReader(notes) #save pdf data to file
    num_pages: int = int(len(reader.pages)) #get number of slides
    clean_text = []

    for slide in range(num_pages):
            page = reader.pages[slide]
            text: str = page.extract_text()
            text += '\n'
            #skip a slide if its a discussion or closing question
            if 'Discussion Question' in text or 'Closing Questions' in text or ('Discussion' and 'Question') in text or ('Closing' and 'Questions') in text:
                continue

            clean_text.append(text) #to separate each slide's content


    return clean_text



# This function was Aided using common development resources
def summarize_text(text, num_sentences=3):
    # Tokenize the text into sentences
    sentences = sent_tokenize(text)
    
    # Tokenize the words and remove stopwords
    stop_words = set(stopwords.words('english'))
    words = word_tokenize(text.lower())
    filtered_words = [word for word in words if word.isalnum() and word not in stop_words]
    
    # Calculate word frequencies
    freq_dist = FreqDist(filtered_words)
    
    # Score each sentence based on word frequencies
    sentence_scores = {}
    for sentence in sentences:
        for word in word_tokenize(sentence.lower()):
            if word in freq_dist:
                if sentence not in sentence_scores:
                    sentence_scores[sentence] = freq_dist[word]
                else:
                    sentence_scores[sentence] += freq_dist[word]

    # Get the top N sentences with the highest scores
    summary_sentences = heapq.nlargest(num_sentences, sentence_scores, key=sentence_scores.get)
    
    # Join the top sentences to form the summary
    summary = ' '.join(summary_sentences)
    
    return summary


if __name__ == '__main__':


    main()