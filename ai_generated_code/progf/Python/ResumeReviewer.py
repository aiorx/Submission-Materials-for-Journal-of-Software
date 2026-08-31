# Formed using common development resources
# Install these libraries:
#   pip install python-docx
#   pip install nltk


from docx import Document
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string

# Downloading the stopwords from NLTK
import nltk
nltk.download('punkt')
nltk.download('stopwords')

# Specify the path of your document
print("Python Utility to Analyse a Microsoft Word Resume\n")
doc_path = input("Enter Resume File Name: ") #'your_document.docx'
document = Document(doc_path)

# List of common words to exclude
excluded_words = set(stopwords.words('english')) | set(string.punctuation)
print(excluded_words)

num_chars = 0
num_words = 0
num_lines = 0
num_special_words = 0

# Process each paragraph in the document
for para in document.paragraphs:
    if para.text:  # If the paragraph is not empty
        num_lines += 1
        words = word_tokenize(para.text)
        for word in words:
            num_chars += len(word)
            if word.lower() not in excluded_words:
                print(word)
                num_special_words += 1
            num_words += 1

print('Number of characters:', num_chars)
print('Number of words:', num_words)
print('Number of lines:', num_lines)
print('Number of special words:', num_special_words)
