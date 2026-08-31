```python
def run_query(wanted):
    word_total = 0
    # 统计出现的总个数
    for each in one_word_list:
        if each == wanted:
            word_total += 1

    print('"{}" occurs {} times'.format(wanted, word_total))

    line_number = 0
    for line in text_list:
        line_plain = re.sub(r'[{}]'.format(punctuation), '', line)
        word_list = [word.lower() for word in line_plain.split()]
        # 按照用户习惯第一行从"1"开始
        line_number += 1
        # 每行的单词列表
        if wanted in word_list:
            # 而下标"0"表示第一行，故需要减去1
            print('\tline {}: {}'.format(line_number, text_list[line_number - 1]), end='')
```