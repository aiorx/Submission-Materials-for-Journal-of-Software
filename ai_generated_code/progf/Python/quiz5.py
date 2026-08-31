import re
pattern = r"\d+"
text1 = 'abc123abc'
test1 = re.match(pattern,text1)
test2 = re.search(pattern,text1)
if test1:
    print(f'{test1.group()} from the var test1')
if test2:
    print(f'{test2.group()} from the var test2')
"""
pattern = r"\d+"
这里的 r"\d+" 是一个原始字符串（raw string），其中 \d 表示匹配一个数字，+ 表示匹配一个或多个连续的数字。
定义要匹配的文本：
text1 = 'abc123abc'
使用 re.match 和 re.search 进行匹配：
test1 = re.match(pattern, text1)
test2 = re.search(pattern, text1)

re.match(pattern, text1) 尝试从字符串的开头匹配模式。如果开头不匹配，则返回 None。在这个例子中，text1 的开头是 ‘abc’，不是数字，所以 test1 会是 None。
re.search(pattern, text1) 在整个字符串中搜索模式，并返回第一个匹配的对象。在这个例子中，re.search 会找到 ‘123’，所以 test2 会是一个匹配对象。
检查匹配结果并打印：
if test1:
    print(f'{test1.group()} from the var test1')
if test2:
    print(f'{test2.group()} from the var test2')
if test1: 检查 test1 是否有匹配结果。由于 test1 是 None，所以不会打印任何内容。
if test2: 检查 test2 是否有匹配结果。因为 test2 匹配到了 ‘123’，所以会打印 123 from the var test2。
总结：
re.match 只在字符串的开头进行匹配，所以在这个例子中没有找到匹配。
re.search 在整个字符串中搜索，所以找到了 ‘123’。

import re

Define the regular expression pattern:
pattern = r"\d+"
Here, r"\d+" is a raw string where \d matches any digit and + means one or more of the preceding element (digits in this case).
Define the text to be matched:


text1 = 'abc123abc'
Use re.match and re.search to find matches:
test1 = re.match(pattern, text1)
test2 = re.search(pattern, text1)

re.match(pattern, text1) tries to match the pattern from the start of the string. Since text1 starts with ‘abc’ (not a digit), test1 will be None.
re.search(pattern, text1) searches the entire string for the pattern and returns the first match. In this case, it finds ‘123’, so test2 will be a match object.
Check the match results and print:

if test1:
    print(f'{test1.group()} from the var test1')
if test2:
    print(f'{test2.group()} from the var test2')
Routine programming code snippets. Review and use carefully. More info on FAQ.
if test1: checks if test1 has a match. Since test1 is None, nothing will be printed.
if test2: checks if test2 has a match. Since test2 found ‘123’, it will print 123 from the var test2.
In summary:
re.match only matches from the start of the string, so it didn’t find a match in this case.
re.search searches the entire string and found ‘123’.
"""

import re

# 定义一个包含多个日期的字符串
text = "Today's date is 2024-10-07. Tomorrow's date is 2024-10-08."

# 定义一个匹配日期的正则表达式模式
pattern = r"(\d{4})-(\d{2})-(\d{2})"

# 使用re.search()找到第一个匹配的日期
match = re.search(pattern, text)

# 如果找到匹配项，使用group()方法提取匹配的部分
if match:
    print(f"Full match: {match.group(0)}")  # 完整匹配
    print(f"Year: {match.group(1)}")       # 第一个捕获组（年份）
    print(f"Month: {match.group(2)}")      # 第二个捕获组（月份）
    print(f"Day: {match.group(3)}")        # 第三个捕获组（日期）