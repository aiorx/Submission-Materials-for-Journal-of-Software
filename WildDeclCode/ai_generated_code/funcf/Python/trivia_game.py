def start_game():
    os.system('cls' if os.name == 'nt' else 'clear')  # Clear the screen at the start
    print("Starting the game...")
    # Load questions from JSON file Assisted using common GitHub development aids
    with open('questions.json', 'r') as file:
        questions = json.load(file)
    
    score = 0
    for question in questions:
        os.system('cls' if os.name == 'nt' else 'clear')  # Clear the screen
        print(question['question'])
        for i, option in enumerate(question['options']):
            print(f"{i + 1}. {option}")
        
        answer = input("Enter your answer (1-4): ")
        if question['options'][int(answer) - 1] == question['answer']:
            score += 1
            print("Correct!")
        else:
            print("Wrong!")
            print(f"The correct answer was: {question['answer']}")
        input("Press Enter to continue...")  # Pause before next question
    
    os.system('cls' if os.name == 'nt' else 'clear')  # Clear the screen before showing the score
    print(f"Your score: {score}/{len(questions)}")
    # Clear the screen before showing the main menu
    input("Press Enter to return to the main menu...")
    os.system('cls' if os.name == 'nt' else 'clear')  # Clear the screen
    main_menu()