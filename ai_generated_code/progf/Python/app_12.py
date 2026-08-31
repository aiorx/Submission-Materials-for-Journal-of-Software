# Assisted with basic coding tools
import re
from flask import Flask, render_template, request, jsonify, flash
import sys
import corpus_b
import requests
from bs4 import BeautifulSoup
import nltk

def ensure_nltk_resources():
    resources = [
        'punkt', 'averaged_perceptron_tagger', "averaged_perceptron_tagger_eng", 'maxent_ne_chunker',
        'words', 'stopwords', 'wordnet', 'omw-1.4'
    ]
    
    for resource in resources:
        try:
            nltk.data.find(f'{resource}')
        except LookupError:
            print(f"Downloading '{resource}'...")
            nltk.download(resource, quiet=True)

ensure_nltk_resources()

app = Flask(__name__)
app.secret_key = 'kwic_analyzer_secret_key'

def extract_text_from_url(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style tags
        for script in soup(["script", "style"]):
            script.extract()
            
        # Get text content
        text = soup.get_text()
        
        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)
        
        return text
    except Exception as e:
        print(f"Error fetching URL: {e}")
        return ""

@app.route('/', methods=['GET', 'POST'])
def index():
    results = None
    wiki_topic = ""
    url = ""
    search_mode = "wikipedia" 
    search_words = ""
    window = 5
    color = "red" 
    error_message = ""
    language = "en" 
    
    try:
        if request.method == 'POST':
            search_mode = request.form.get('search_mode', 'wikipedia')
            wiki_topic = request.form.get('wiki_topic', '') if search_mode == 'wikipedia' else ''
            url = request.form.get('url', '') if search_mode == 'url' else ''
            search_words = request.form.get('search_words', '')
            window = int(request.form.get('window', 5))
            color = request.form.get('color', 'red')
            language = request.form.get('language', 'en')
            
            if search_mode == 'wikipedia' and not wiki_topic.strip():
                error_message = "Please enter a Wikipedia topic in Wikipedia search mode."
                return render_template('index.html', 
                                      results=None, 
                                      wiki_topic="",
                                      url=url,
                                      search_mode=search_mode,
                                      search_words=search_words,
                                      window=window,
                                      color=color,
                                      language=language,
                                      error_message=error_message)
            
            if search_mode == 'url' and not url.strip():
                error_message = "Please enter a valid URL in URL search mode."
                return render_template('index.html', 
                                      results=None, 
                                      wiki_topic=wiki_topic,
                                      url="",
                                      search_mode=search_mode,
                                      search_words=search_words,
                                      window=window,
                                      color=color,
                                      language=language,
                                      error_message=error_message)
            
            if not search_words.strip():
                error_message = "Please enter a search term."
                return render_template('index.html', 
                                      results=None, 
                                      wiki_topic=wiki_topic,
                                      url=url,
                                      search_mode=search_mode,
                                      search_words="",
                                      window=window,
                                      color=color,
                                      language=language,
                                      error_message=error_message)
            
            corpus_b.text = ""
            
            if search_mode == 'wikipedia':
                corpus_b.text += corpus_b.add_wikipedia_article(wiki_topic, language=language)
            else:
                corpus_b.text += extract_text_from_url(url)
            
            if corpus_b.text.strip():
                import io
                from contextlib import redirect_stdout
                
                f = io.StringIO()
                with redirect_stdout(f):
                    corpus_b.kwic_grouped_by_pos_and_sorted(corpus_b.text, search_words, window=window, color=color, language=language)
                
                output = f.getvalue()
                
                if output.strip():
                    categories = []
                    current_category = None
                    current_lines = []
                    
                    for line in output.split('\n'):
                        if line.startswith('<') and line.endswith('>'):
                            if current_category:
                                categories.append({
                                    'name': current_category,
                                    'lines': current_lines
                                })
                            current_category = line.strip('<>')
                            current_lines = []
                        elif line.strip() and current_category:
                            color_code_map = {
                                'red': '\033[91m',
                                'green': '\033[92m',
                                'yellow': '\033[93m',
                                'blue': '\033[94m',
                                'magenta': '\033[95m',
                                'cyan': '\033[96m'
                            }
                            
                            color_code = color_code_map.get(color, '\033[91m')
                            end_code = '\033[0m'
                            
                            line = line.replace(color_code, '<span class="highlight ' + color + '">').replace(end_code, '</span>')
                            current_lines.append(line)
                    
                    if current_category and current_lines:
                        categories.append({
                            'name': current_category,
                            'lines': current_lines
                        })
                    
                    results = categories
                else:
                    error_message = f"No matches found for '{search_words}'. Please try a different search term."
            else:
                source_name = f"Wikipedia article '{wiki_topic}'" if search_mode == 'wikipedia' else f"URL '{url}'"
                error_message = f"Could not fetch text from {source_name}. Please try a different search."
                results = []
    except Exception as e:
        error_message = f"An error occurred: {str(e)}"
        print(f"Error in processing request: {e}")
    
    return render_template('index.html', 
                          results=results, 
                          wiki_topic=wiki_topic,
                          url=url,
                          search_mode=search_mode,
                          search_words=search_words,
                          window=window,
                          color=color,
                          language=language,
                          error_message=error_message)

@app.route('/api/kwic', methods=['POST'])
def kwic_api():
    try:
        data = request.get_json()
        search_mode = data.get('search_mode', 'wikipedia')
        wiki_topic = data.get('wiki_topic', '') if search_mode == 'wikipedia' else ''
        url = data.get('url', '') if search_mode == 'url' else ''
        search_words = data.get('search_words', '')
        window = int(data.get('window', 5))
        color = data.get('color', 'red')
        language = data.get('language', 'en')
        
        if search_mode == 'wikipedia' and not wiki_topic.strip():
            return jsonify({"success": False, "error": "Please enter a Wikipedia topic in Wikipedia search mode."})
        
        if search_mode == 'url' and not url.strip():
            return jsonify({"success": False, "error": "Please enter a valid URL in URL search mode."})
        
        if not search_words.strip():
            return jsonify({"success": False, "error": "Please enter a search term."})
        
        corpus_b.text = ""
        
        if search_mode == 'wikipedia':
            corpus_b.text += corpus_b.add_wikipedia_article(wiki_topic, language=language)
        else:
            corpus_b.text += extract_text_from_url(url)
        
        if corpus_b.text.strip():
            import io
            from contextlib import redirect_stdout
            
            f = io.StringIO()
            with redirect_stdout(f):
                corpus_b.kwic_grouped_by_pos_and_sorted(corpus_b.text, search_words, window=window, color=color, language=language)
            
            output = f.getvalue()
            
            if output.strip():
                categories = []
                current_category = None
                current_lines = []
                
                for line in output.split('\n'):
                    if line.startswith('<') and line.endswith('>'):
                        if current_category:
                            categories.append({
                                'name': current_category,
                                'lines': current_lines
                            })
                        current_category = line.strip('<>')
                        current_lines = []
                    elif line.strip() and current_category:
                        color_code_map = {
                            'red': '\033[91m',
                            'green': '\033[92m',
                            'yellow': '\033[93m',
                            'blue': '\033[94m',
                            'magenta': '\033[95m',
                            'cyan': '\033[96m'
                        }
                        
                        color_code = color_code_map.get(color, '\033[91m')
                        end_code = '\033[0m'
                        
                        line = line.replace(color_code, '<span class="highlight ' + color + '">').replace(end_code, '</span>')
                        current_lines.append(line)
                
                if current_category and current_lines:
                    categories.append({
                        'name': current_category,
                        'lines': current_lines
                    })
                
                return jsonify({"success": True, "results": categories})
            else:
                return jsonify({"success": False, "error": f"No matches found for '{search_words}'. Please try a different search term."})
        else:
            source_name = f"Wikipedia article '{wiki_topic}'" if search_mode == 'wikipedia' else f"URL '{url}'"
            return jsonify({"success": False, "error": f"Could not fetch text from {source_name}. Please try a different search."})
    except Exception as e:
        return jsonify({"success": False, "error": f"An error occurred: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 
