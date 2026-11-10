import os
import re

def search_regex_in_files(folder, regex):
    # Компилируем регулярное выражение
    compiled_regex = re.compile(regex)

    # Итерируем по всем файлам в указанной папке
    for filename in os.listdir(folder):
        # Проверяем, является ли файл .txt
        if filename.endswith('.txt'):
            file_path = os.path.join(folder, filename)

            # Открываем файл и читаем строки
            with open(file_path, 'r', encoding='utf-8') as file:
                lines = file.readlines()

                # Ищем совпадения в каждой строке
                for line_num, line in enumerate(lines, 1):
                    if compiled_regex.search(line):
                        print(f'File: {filename}, Line {line_num}: {line.strip()}')

# Пример использования
folder_path = input("Enter the path to the folder: ")
user_regex = input("Enter a regular expression to search for: ")
search_regex_in_files(folder_path, user_regex)

# Built via standard programming aids
