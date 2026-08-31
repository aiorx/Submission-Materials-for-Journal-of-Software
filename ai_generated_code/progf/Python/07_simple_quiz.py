# Simple Quiz
# Create a quiz application that asks the user multiple-choice questions and
# provides feedback on their answers. This will help you practice working with lists,
# conditionals, and user input.

# Questions Assisted with basic coding tools
# https://chatgpt.com/share/c3611745-3c39-4ae3-b856-1bf11433d5cc

# This dictionary will match the letter of the choices to the index of actual answer
answer_dict = {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3
}

questions_list = [
    ["Which of the following is a version control system?",
        ["Git",
         "Docker",
         "Jenkins",
         "Kubernetes"],
        "A"
     ],
    ['What does the acronym "API" stand for?',
        ["Application Programming Interface",
         "Applied Program Integration",
         "Advanced Programming Interface",
         "Application Process Implementation"],
        "A"
     ],
    ["Which language is primarily used for web development on the client side?",
        ["Python",
         "Java",
         "JavaScript",
         "C++"],
        "C"
     ],
    ["What is the purpose of a 'constructor' in object-oriented programming?",
        ["To destroy an object",
         "To create an object",
         "To debug an object",
         "To iterate through objects"],
        "B"
     ],
    ["Which of the following is a popular JavaScript framework for building web applications?",
        ["React",
         "Django",
         "Ruby on Rails",
         "Laravel"],
        "A"
     ],
    ['What does the term "CI/CD" stand for in software development?',
        ["Continuous Integration/Continuous Deployment",
         "Code Integration/Code Development",
         "Continuous Implementation/Continuous Delivery",
         "Code Installation/Code Distribution"],
        "A"
     ],
    ["Which of the following is NOT a relational database?",
        ["MySQL",
         "PostgreSQL",
         "MongoDB",
         "SQLite"],
        "C"
     ],
    ["What is 'Agile' methodology primarily used for?",
        ["Hardware development",
         "Software project management",
         "Network configuration",
         "Database optimization"],
        "B"
     ],
    ["In software testing, what does 'TDD' stand for?",
        ["Technical Design Document",
         "Test-Driven Development",
         "Total Data Distribution",
         "Test Deployment Diagram"],
        "B"
     ],
    ["Which of the following is a type of software testing?",
        ["Unit Testing",
         "Byte Testing",
         "Field Testing",
         "Command Testing"],
        "A"
     ]
]

score = 0
for question in questions_list:
    print(question[0])
    print(f'A. {question[1][0]}')
    print(f'B. {question[1][1]}')
    print(f'C. {question[1][2]}')
    print(f'D. {question[1][3]}')
    print("")
    answer = input("Enter your answer: ")
    if answer.upper() == question[2]:
        score += 1
        print("You got the correct answer.")
    else:
        print(f"Your got the wrong answer. Correct answer is {question[2]}. {question[1][answer_dict[question[2]]]}")
    print("")
    print("")

print(f"Your total score is {score} points.")
