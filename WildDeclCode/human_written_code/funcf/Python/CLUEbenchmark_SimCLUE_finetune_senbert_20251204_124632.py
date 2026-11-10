```python
def read_txt(input_file):
    """
    读取数据
    :param input_file: txt文件
    :return: [[text1, text2, int(label)], [text1, text2, int(label)]]
    """
    with open(input_file, 'r', encoding='utf8') as f:
        reader = f.readlines()
    lines = []
    for line in reader:
        json_data=json.loads(line.strip()) # {"sentence1": "英德是哪个省", "sentence2": "英德是哪个市的", "label": "0"}
        text1, text2, label = json_data['sentence1'],json_data['sentence2'],json_data['label']
        lines.append([text1, text2, int(label)])
    random.shuffle(lines)
    return lines
```