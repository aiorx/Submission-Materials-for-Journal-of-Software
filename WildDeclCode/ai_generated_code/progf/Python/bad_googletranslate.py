"""
Example from Codespaces:
$ python /workspaces/random/bad_googletranslate.py 'Hello world! I am posting this script on GitHub!' -l es -l zh -l ja -l es -l hi
hello World! I Yes Destination it Written Hui Story Existence Technology You B!
"""

# based on code Composed with GitHub coding tools

import argparse
import asyncio

from googletrans import Translator

async def translate_word(translator, word, src='auto', dest='en'):
    translated_word = await translator.translate(word, src=src, dest=dest)
    return translated_word.text

async def translate_words(text, src='auto', dest='en'):
    translator = Translator()
    words = text.split()
    tasks = [translate_word(translator, word, src, dest) for word in words]
    translated_words = await asyncio.gather(*tasks)
    return ' '.join(translated_words)

# below was written by me

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog="Bad Google Translate",
        description="Google Translate into languages, but word-by-word"
    )
    parser.add_argument('string')
    parser.add_argument('-l', '--lang', action='append')
    
    ns = parser.parse_args()

    if not ns.lang or not ns.string:
        raise RuntimeError("must specify a string and languages")
    
    langs = ['en'] + ns.lang

    s = ns.string

    res: str

    for i in range(0, len(langs) - 1):
        s = asyncio.run(translate_words(s, src=langs[i], dest=langs[i + 1]))
    
    print(asyncio.run(translate_words(s, langs[-1])))