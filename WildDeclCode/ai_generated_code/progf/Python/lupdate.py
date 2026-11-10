# coding:utf-8
# This script is Aided using common development resources and modified a little manually.
import os
import re

def parse_pro_file(pro_file_path):
    sources = []
    translations = []
    
    with open(pro_file_path, 'r', encoding='utf-8') as file:
        for line in file:
            # 移除注释和多余的空格
            line = re.sub(r'#.*', '', line).strip()
            sources.extend(re.findall(r'[\w./\\]+\.py', line))
            translations.extend(re.findall(r'[\w./\\]+\.ts', line))

    return sources, translations

def generate_lupdate_command(sources, translations):
    command = ['pyside6-lupdate']
    command.append('-no-obsolete')
    command.extend(sources)
    command.append('-ts')
    for ts_file in translations:
        command.append(ts_file)
    return ' '.join(command)

def main():
    pro_file_path = 'main.pro'  # 替换为你的 .pro 文件路径
    sources, translations = parse_pro_file(pro_file_path)
    
    if not sources or not translations:
        print("未在 .pro 文件中找到 SOURCES 或 TRANSLATIONS 部分。")
        return

    lupdate_command = generate_lupdate_command(sources, translations)
    print(f"生成的命令: {lupdate_command}")
    # 你可以使用 os.system 执行生成的命令
    os.system(lupdate_command)

if __name__ == "__main__":
    main()