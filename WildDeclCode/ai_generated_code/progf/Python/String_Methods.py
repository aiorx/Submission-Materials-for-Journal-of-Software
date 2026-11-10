# String Manipulation Practice - Comments Supported via standard GitHub programming aids
text = "apple,banana,cherry"
messy = "   hello world   "
name = "Alice"
age = 30

# 1. Splitting a string
# TODO: Split the string 'text' by commas and store the result in a list called 'fruits'
fruitList = text.split(",")
print(fruitList);

# 2. Joining a list into a string
# TODO: Join the list 'fruits' into a single string, separated by hyphens
print("-".join(fruitList)); # Looks Illegal But Makes Sense

# 3. Replacing substrings
# TODO: Replace 'banana' with 'orange' in the string 'text'
print(text.replace("banana","orange"));

# 4. Changing case
# TODO: Print the string 'text' in uppercase, lowercase, and title case
print(text.upper());
print(text.title());
print(text.casefold());

# 5. Stripping whitespace
# TODO: Remove leading and trailing spaces from the string 'messy'
print(text.strip(" "));

# 6. Finding substrings
# TODO: Find the position of 'banana' in 'text'
# TODO: Try finding a substring that does not exist (e.g., 'grape')
print("banana Position in",text,text.index("banana"));
toSearch = "grape"
if(text.find(toSearch) != -1):
    print(toSearch,"is Found")
else:
    print(toSearch,"isn't Found")
    

# 7. String formatting
# TODO: Use f-strings to print a message with the variables 'name' and 'age'
print(f"Name is {name} and Age is {age}");

# 8. Counting substrings
# TODO: Count how many times the letter 'a' appears in 'text'
print("How many 'a'?",text.count('a'));

# 9. Checking start/end
# TODO: Check if 'text' starts with 'apple' and ends with 'cherry'
print("Does text start with 'apple' and ends with 'cherry'?",text.startswith("apple") and text.endswith("cherry"));


