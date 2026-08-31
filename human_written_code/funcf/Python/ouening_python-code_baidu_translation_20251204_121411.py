```python
def lang_transform(self, lang):
    '''
    tranform the language into correct format that ai.youdao.com accepted
    中文	zh-CHS
    日文	ja
    英文	EN
    韩文	ko
    法文	fr
    俄文	ru
    葡萄牙文	pt
    西班牙文	es
    '''
    if lang == "Chinese":
        return "zh"
    if lang == "Japanease":
        return "ja"
    if lang == "English":
        return "en"
    if lang == "Korea":
        return "kor"
    if lang == "Russia":
        return "ru"
    if lang == "French":
        return "fra"
    if lang == "Auto":
        return "auto"
```