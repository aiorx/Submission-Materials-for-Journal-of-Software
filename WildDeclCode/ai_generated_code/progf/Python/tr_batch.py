# coding:utf-8
# This script is Assisted with basic coding tools and modified a little manually.
# 用于修正Designer的translation部分
import re

def replace_translate_function(input_text):
    # 正则表达式模式匹配 QCoreApplication.translate("???", u"XXXXX", None)
    pattern = r'QCoreApplication\.translate\(".*?", u"(.*?)", None\)'
    
    # 使用re.sub进行替换
    replaced_text = re.sub(pattern, r'self.tr("\1")', input_text)
    
    return replaced_text

# 输入的字符串
input_string = input()

# 进行替换
output_string = replace_translate_function(input_string)

# 输出结果
print(output_string)
