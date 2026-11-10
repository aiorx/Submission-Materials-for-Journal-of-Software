import os
from os import listdir
from os.path import isfile, join
import json
from bs4 import BeautifulSoup as bs
import re
import requests

def WriteFile():
    pass

# This method was Produced using common development resources
def GetHtmlContent(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        response.encoding = 'utf-8'
        
        return response.text
    
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None

def ReadQuestionsFromFolder(path: str):
    if not os.path.exists(path):
        os.makedirs(path)
    onlyfiles = [f for f in listdir(path) if isfile(join(path, f))]
    # selections = open('RAGselections.txt').read().splitlines()
    result = []

    for file in onlyfiles:
        fullPath = path + '/' + file
        with open(fullPath, encoding='utf-8') as f:
            entries: list = json.load(f)
            for entry in entries:
                item = {
                    'URL':"",
                    "Question":"",
                    "Answer":""
                }
                item["URL"] = entry['URL']
                item["Question"] = entry['Saturi'][0]['Saturs']
                item["Answer"] = entry['Saturi'][1]['Saturs']
                result.append(item.copy())
    return result

def GetDataFromLikumi(html_content):
    links = [link.attrs['href'] for link in bs(html_content, 'html.parser').find_all('a')]
    if len(links) == 0 : return None
    result = ''
    for link in links:
        if 'likumi.lv' not in link: return None
        if len(link.split('#p')) < 2: return None
        if not(bool(re.fullmatch(r'[\d_]+', link.split('#p')[1]))): return None
    for link in links:
        link_content = ''
        article = link.split('#p')[1]
        link_ref = bs(GetHtmlContent(link), 'html.parser')
        link_content += link_ref.find('div', attrs={'class':'TV207'}).get_text() + ': '
        all_paragraphs = link_ref.find('div', attrs={'izd-pam': article + 'p'})
        if all_paragraphs == None: all_paragraphs = link_ref.find('div', attrs={'data-num': article})
        text = [t.get_text() for t in all_paragraphs.find_all('p')]
        link_content += ' '.join(text) + '\n'
        result += link_content
    return result


def MainGetInstructions():
    data = ReadQuestionsFromFolder('data')

    results = []
    id = 0
    for item in data:
        reference = GetDataFromLikumi(item['Answer'])
        question = re.sub(r'(\n)+', ' ',bs(item['Question'], 'html.parser').get_text())
        gold = re.sub(r'(\n)+', ' ', bs(item['Answer'], 'html.parser').get_text())

        prompt = ''
        if reference != None:
            prompt = 'Izmantojot dotās atsauces, sniedz juridiski pareizu atbildi uz doto jautājumu:\n'
            prompt += 'Atsauces: ' + GetDataFromLikumi(item['Answer'])
            prompt += 'Jautājums: ' + question

        results.append({
            'id': id,
            'rag_prompt': prompt,
            'question': question,
            'gold': gold,
        })
        id += 1

    fullpath = 'instructions/ModelInstructions.json'
    with open(fullpath, 'wt', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=4)


if __name__ == '__main__':
    MainGetInstructions()