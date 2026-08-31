# # # Write a program to find the first and last digits of a number using python.---???
# # n = str(input("enter the number:"))
# #
# # for i in range(len(n)):
# #     if i==0:
# #         print ("First digit of number:",n[i])
# #     elif i == len(n)-1:
# #         print("Last digit of number:", n[i])
#
# #
# # # Python string program to test whether a passed letter is a vowel or consonant.--??
# #
# # vowel = "AEIOU aeiou"
# # letter = input("enter the Letter:")
# #
# # if letter in vowel:
# #     print(letter, "is vowel ")
# # else:
# #     print(letter, "is consonant")
#
#
#
# # # Usage
# # str1 = "listen"
# # str2 = "sileno"
# # if sorted(str1) == sorted(str2):
# #     print("The two strings are anagrams of each other")
# # else:
# #     print("The two strings are not anagrams")
# #
# # #Questions need to ask
# # 10). Write a Python program to replace the second occurrence of any char with the special character $.
# # Input = “Programming”
# # Output = “Prog$am$in$”
# #
# # 21. Write a Python to remove unwanted characters from the given string.
# # Input = “Prog^ra*m#ming”
# # Output = “Programming”
# #
# # # output = ''.join(i for i in Input_21 if i.isalnum())
# # # print(output)
# #
# # ##Write a Python program to find the longest capital letter word from the string.
# # Input = "Learning PYTHON programming is FUN"
# # #Output = “PYTHON”
#
# # def exceptionHandling():
# #     try:
# #         car = {'make':'BMW','model':'1100','Year':'2010'}
# #         print(car['color'])
# #     except:
# #         print("Key not found")
# #     finally:
# #         print("Please try different key value")
# #
# # exceptionHandling()
# #
# # Input = "sqatools"
# # #Output = {‘s’:2, ‘q’:1, ‘a’: 1, ‘t’:1,‘o’:2, ‘l’:1, ‘s’:1}
# #
# # output_dict={}
# #
# # for char in Input:
# #     output_dict[char]= Input.count(char)
# # print(output_dict)
#
# ## Program: write a python get below result
#
# str1 = "Python"
# list1 = [4, 6, 8, 2, 9, 10]
# #output = {'PP' : 4, 'yy' : 6, 'tt' : 8, 'hh': 2, 'oo': 9, 'nn' : 10}
#
# list2= list(str1)
# print(list2)
# output_dict={}
#
# for i in range (len(list2)):
#     output_dict[(list2[i])*2]= list1[i]
# print(output_dict)
#
date_string = "01-03-2024"

# Print the date string
print(date_string)

# Split the date string into day, month, and year
day, month, year = date_string.split('-')

# Print the day, month, and year on separate lines
print(day)
print(month)
print(year)
# Basic development code blocks. Review and use carefully. More info on FAQ.
# The output will be:
#
# 01-03-2024
# 01
# 03
# 2024


@
What is init file do..? -- to change the folder in package,its an blank file

#arr=[["a", 2],["d", 4],["g", 2],["b",4]]
#[["a", 2],["g", 2],["b", 4],["d", 4]]

#Need to create the parent object in polymorphism concept(overriding)
#Concept of args and kwargs
#itertools.combinations
#lambda function/list comprehension
#
#13). Python program to reverse a list with a while loop.
#18). Python program to print a specific list after removing the 1st, 3rd, and 6th elements from the list.
#dic: 11Input = {'d' : 21, 'b' : 53, 'a': 13, 'c': 41}
#list SQA
#28). Python program to generate all sublists with 5 or more elements in it from the given list.
#34). Python program to combine two list elements as a sublist in a list.
# list1 = [3, 5, 7, 8, 9]
# list2 = [1, 4, 3, 6, 2]
# Output = [[3, 1], [5, 4], [7, 3], [8, 6], [9, 2]]



# # Output =
# # (‘a’, 13)
# # (‘b’, 53)
# # (‘c’, 41)
# # (‘d’, 21)