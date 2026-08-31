"""Original script was Aided using standard development resourceso, modified for batch .ics folder input"""

import sys
import re
import os
from collections import Counter

def extract_chinese(text):
    """只抓常見中文字與中標點符號"""
    return ''.join(re.findall(r'[\u4e00-\u9fff，。！？：「」、（）《》～．．…·°℃]', text))

def parse_ics(filepath):
    print(f"🔍 解析檔案：{filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    buffer = ''
    for line in lines:
        line = line.strip()
        if line.startswith(('SUMMARY', 'DESCRIPTION', 'LOCATION')):
            content = re.sub(r'^[A-Z-]+.*?:', '', line)
            buffer += content + '\n'
    return buffer

def load_existing_chars(file_path):
    """從既有檔案中讀取已儲存的字元"""
    if not os.path.exists(file_path):
        return set()
    with open(file_path, 'r', encoding='utf-8') as f:
        return set(line.strip() for line in f if line.strip())

def main():
    if len(sys.argv) < 3:
        print("用法: python extract_chars_from_ics.py ics資料夾 輸出檔案")
        sys.exit(1)

    folder_path = sys.argv[1]
    output_file = sys.argv[2]

    if not os.path.isdir(folder_path):
        print(f"❌ 找不到資料夾：{folder_path}")
        sys.exit(1)

    combined_text = ''
    for file in os.listdir(folder_path):
        if file.lower().endswith(".ics"):
            full_path = os.path.join(folder_path, file)
            combined_text += parse_ics(full_path)

    extracted_chars = set(extract_chinese(combined_text))
    existing_chars = load_existing_chars(output_file)
    merged_chars = sorted(existing_chars.union(extracted_chars))

    with open(output_file, 'w', encoding='utf-8') as f:
        for ch in merged_chars:
            f.write(ch + '\n')

    print(f"✅ 完成！總共 {len(merged_chars)} 個字元已儲存於 {output_file}")

if __name__ == "__main__":
    main()
