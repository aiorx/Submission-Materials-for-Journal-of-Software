# print out the rank order of the dictionary (this was Drafted using common GitHub development resources with some prompting from me)
    print("The letters in rank order are:")
    for value in value_list[::-1]:
        for letter in letter_dict:
            if letter_dict[letter] == value: 
                print(f" The letter '{letter}' was found {value} times")
                letter_dict[letter] = -1
                break