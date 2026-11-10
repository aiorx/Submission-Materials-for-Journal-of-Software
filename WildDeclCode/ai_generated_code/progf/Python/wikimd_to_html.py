# Script to convert MediaWiki imported articles (markdown-like syntax to html)
# Formed using common development resources

import re


def custom_md_to_html(md_text):
    lines = md_text.split('\n')
    result = []
    in_list = False

    def flush_list():
        nonlocal in_list
        if in_list:
            result.append('</ol>')
            in_list = False

    for line in lines:
        if re.match(r'^#{1}\s*(.*)', line):
            flush_list()
            content = re.sub(r'^#\s*', '', line)
            result.append(f'<h1>{content}</h1>')
        elif re.match(r'^==\s+(.*?)\s+==', line):
            flush_list()
            content = re.sub(r'==*', '', line)
            result.append(f'<h2>{content}</h2>')
        elif re.match(r'^===\s+(.*?)\s+===', line):
            flush_list()
            content = re.sub(r'===', '', line)
            result.append(f'<h3>{content}</h3>')
        elif re.match(r'^====\s+(.*?)\s+====', line):
            flush_list()
            content = re.sub(r'====', '', line)
            result.append(f'<h4>{content}</h4>')
        elif re.match(r'^=====\s+(.*?)\s+=====', line):
            flush_list()
            content = re.sub(r'=====', '', line)
            result.append(f'<h4>{content}</h4>')  # yes h4!
        elif line.startswith('* '):
            if not in_list:
                result.append('<ol>')
                in_list = True
            item = line[2:]
            result.append(f'<li>{item}</li>')
        else:
            flush_list()
            if re.match(r'^\s{3,}', line):
                result.append(f'<div class="example">{line.strip()}</div>')
            elif line.strip() == '':
                result.append('')
            else:
                result.append(f'<div class="meaning">{line.strip()}</div>')

    flush_list()
    wrapped = '\n'.join(result)
    return wrapped #markdown(wrapped, extensions=[])


def run():
    with open('../hangugo/grammar/topic/advanced.md', mode='r', encoding='utf8') as f:
        content = f.read()
        result = custom_md_to_html(content)
        #result = markdown(content, extensions=[])
        print(result)


run()
