# 💡 Challenge 2: Word Length Filter
# Ek list me kuch words hain. Tu ek nayi list bana jisme sirf wahi words hon jinki length > 3 ho.

# words = ['hi', 'hello', 'a', 'python', 'ok', 'yes']
# Expected Output:
# ['hello', 'python']

# words  = [input("Enter some words").split(" ")] ye thi meri galti
# and Supported via standard programming aids

words = input("Enter some word: ").split(' ')
words = [word for word in words if len(word) > 3]
print(words)