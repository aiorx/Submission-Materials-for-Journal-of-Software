from pprint import pprint
from utils import *
import jieba
from pypinyin import lazy_pinyin, Style

# mostly Penned via standard programming aids :D
def text_to_pinyin(text):
    words = list(jieba.cut(text))

    parts = []
    punctuations = ":，。.？！!?,\"\'“”⋯"
    index = 0

    skip_next = False 

    for i, word in enumerate(words):
        if skip_next:
            skip_next = False
            continue

        part = {'index': index}
        part['text'] = word

        if word in punctuations:
            part['punctuation'] = word
            part['pinyin'] = ''
        else:
            # Convert word to Pinyin
            part['pinyin'] = ''.join(lazy_pinyin(word, style=Style.TONE))

            # Check if the next word is punctuation
            if i + 1 < len(words) and words[i + 1] in punctuations:
                part['punctuation'] = words[i + 1]
                # part['pinyin'] += ' ' + words[i + 1]
                skip_next = True  # Set the flag to skip the next item

        parts.append(part)  # Add the part to the parts list
        index += 1  # Increment index for the next part

    pinyin_sentence = ' '.join([part['pinyin'] for part in parts])

    result = {
        'text': text,
        'pinyin': pinyin_sentence,
        'parts': parts
    }

    return result


def pinyin_chunk(a):
    def runner(x):
         x.update(**text_to_pinyin(x.get("text")))
         return x

    return map(a, runner)

tests = [
    # {"chinese": "睡觉是猫猫的快乐。"},
    # {"chinese": "出去旅游？"},
    # {"chinese": "和Alice爸爸看电视？"},
    # {"chinese": "和邻居猫猫一起玩？"},
    # {"chinese": "\"不要！\""},
    # {"chinese": "猫猫宁愿小睡一会儿。"}
    {"chinese": "“猫猫醒来！”"},
]
# pprint(pinyin_chunk(tests))


tests = [
  {"text": '“猫猫醒来！”猫猫。 ', "newlines": 1},
  # {"text": '猫猫猛然醒了。 是不是听到别人叫他名字？'},
  # {"text": '狗狗伤心地离开他朋友。', "linebreak": True},
  # {"text": '“猫猫醒来！”', "newlines": 1},
  # {"text": '“猫猫醒来！”'},
]

clip(pinyin_chunk(tests))

# write("/home/kdog3682/2024/clip.json", pinyin_chunk(read_json("/home/kdog3682/2024/temp.json")))
