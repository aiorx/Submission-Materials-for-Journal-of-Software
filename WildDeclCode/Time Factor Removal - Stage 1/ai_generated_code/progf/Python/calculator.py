# Taylor Lee calculator from GitHub Copilot.


def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

def multiply(x, y):
    return x * y

def divide(x, y):
    if y == 0:
        return "Error! Division by zero."
    return x / y

def calculator():
    # This finished variable was added by Taylor Lee.
    finished = False
    # This while loop was added by Taylor Lee.
    while not finished:
        user_name = input("Hello, what is your name?: ")
        print("Hello {}, welcome to Calculator!".format(user_name))
        print("Select operation:")
        print("1. Add")
        print("2. Subtract")
        print("3. Multiply")
        print("4. Divide")

        choice = input("Enter choice(1/2/3/4): ")

        if choice in ['1', '2', '3', '4']:
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))

            if choice == '1':
                print("{} + {} = {}".format(num1, num2, add(num1, num2)))

            elif choice == '2':
                print("{} - {} = {}".format(num1, num2, subtract(num1, num2)))

            elif choice == '3':
                print("{} * {} = {}".format(num1, num2, multiply(num1, num2)))

            elif choice == '4':
                print("{} / {} = {}".format(num1, num2, divide(num1, num2)))
        else:
            print("Invalid input")
        again = input("{}, do you want another calculation? (y/n): ".format(user_name))
        if again == 'y':
            finished = False
        else:
            finished = True
            print("Goodbye, {}!".format(user_name))

if __name__ == "__main__":
    calculator()