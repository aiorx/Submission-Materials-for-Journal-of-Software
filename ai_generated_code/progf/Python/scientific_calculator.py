import os, sys, msvcrt, math

# def display_calculator(display: str):
#     print(" ______________________________ ")
#     print("|                              |")
#     print(f"| {display:>28} |")
#     print("|______________________________|")
#     print("| [A] OFF  | [C] Clear         |")
#     print("|__________|___________________|")
#     print("|  sin  | cos  | tan  | sqrt   |")
#     print("|_______|______|______|________|")
#     print("|  log  | exp  |  pi  |   e    |")
#     print("|_______|______|______|________|")
#     print("|   7   |  8   |  9   |   /    |")
#     print("|_______|______|______|________|")
#     print("|   4   |  5   |  6   |   *    |")
#     print("|_______|______|______|________|")
#     print("|   1   |  2   |  3   |   -    |")
#     print("|_______|______|______|________|")
#     print("|   0   |  .   |  =   |   +    |")
#     print("|_______|______|______|________|")
#     print("|   %   |                      |")
#     print("|_______|______________________|")

# display is mostly Produced via common programming aids
def display_calculator(display: str):
    print(" ______________________________ ")
    print("|                              |")
    print(f"| {display:>28} |")
    print("|______________________________|")
    print("|[A] OFF   |[C] Clear |[H] Help|")
    print("|__________|__________|________|")
    print("| sin  | cos  | tan  | sqrt    |")
    print("|______|______|______|_________|")
    print("| asin | acos | atan | radians |")
    print("|______|______|______|_________|")
    print("| sinh | cosh | tanh | asinh   |")
    print("|______|______|______|_________|")
    print("| acosh| atanh| exp  | log     |")
    print("|______|______|______|_________|")
    print("| log10| log2 | pow  | sqrt    |")
    print("|______|______|______|_________|")
    print("| fabs | floor| ceil | modf    |")
    print("|______|______|______|_________|")
    print("| pi   |  e   | tau  | gcd     |")
    print("|______|______|______|_________|")
    print("| lcm  | comb | perm |factorial|")
    print("|______|______|______|_________|")
    print("|   7  |  8   |  9   |   /     |")
    print("|______|______|______|_________|")
    print("|   4  |  5   |  6   |   *     |")
    print("|______|______|______|_________|")
    print("|   1  |  2   |  3   |   -     |")
    print("|______|______|______|_________|")
    print("|   0  |  .   |  =   |   +     |")
    print("|______|______|______|_________|")
    print("|   %  |Use* for multiplication|")
    print("|______|_______________________|")


operators = ['+', '-', '*', '/', '%']

# only those charactoers are allowed to be appended into the expression which are used in the functions that are shown on the calculator
    
# allowed_chars = "0123456789+-*/%.()sincotaqrlgexp"
# allowed_chars = "0123456789+-*/%.()abcdefghijklmnopqrstuvwxyz"
allowed_chars = "0123456789+-*/%.()abcdefhilmnopqrstuwx"


def get_user_input() -> str:
    key = msvcrt.getch()
    return key.decode()

def check_decimal(expression):
    last_number = ''
    for char in expression[::-1]:
        if char in operators:
            break
        last_number = char + last_number
    if '.' in last_number:
        return False
    else:
        return True

def handle_input(expression: str, key: str) -> str:
    if expression == "Error":
            expression = ""

    if  key == 'A':
        sys.exit()
    elif key == 'C':
        expression = ""
    elif key == '=' and expression and expression[-1] not in operators:
        expression = evaluate_expression(expression)
    elif key in operators:
        if expression == "":
            if key == "-":
                expression += key
            else: 
                return ""
        elif expression[-1] not in operators:
            expression += key
    elif key.isdigit():
        expression += key 
    elif key == '.' and check_decimal(expression):
        expression += key
    elif key in allowed_chars:
        if expression != "":
            if expression[-1] != key:
                expression += key
        else:
            expression += key
    elif key in ['\b', '\x08', '\x7f']:  
        expression = expression[:-1]

    return expression
    
def evaluate_expression(expression: str) -> str:
    allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("__")}
    # for i in allowed_names:
    #     print(i)
    try:
        return str(eval(expression, {"__builtins__": None}, allowed_names))
    except:
        return "Error"

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')
    print("\n" * 100) 

def main():
    expression = ""
    while True:
        # clear_screen()
        display_calculator(expression)
        key = get_user_input()
        if key == "H":
            show_help()
            continue
        expression = handle_input(expression, key)



# Produced via common programming aids
def show_help():
    clear_screen()
    print("=== Calculator Help ===")
    print("• Use numbers, operators (+, -, *, /, %, .), and parentheses as usual.")
    print("• For scientific functions, type them as shown (e.g., sin(30), sqrt(9)).")
    print("• Use * for multiplication (e.g., 2*pi, not 2pi).")
    print("• Supported functions/constants: sin, cos, tan, sqrt, log, exp, pi, e, etc.")
    print("• Press [C] to clear, [A] to exit, [H] to show this help.")
    print("• Use backspace to delete the last character.")
    print("• Press any key to return to the calculator.\n")
    print("=== Scientific Functions Reference ===")
    print("sin(x)      : Sine (x in radians)           | Example: sin(3.14/2)")
    print("cos(x)      : Cosine (x in radians)         | Example: cos(0)")
    print("tan(x)      : Tangent (x in radians)        | Example: tan(0.5)")
    print("asin(x)     : Inverse sine (returns radians)| Example: asin(1)")
    print("acos(x)     : Inverse cosine                | Example: acos(1)")
    print("atan(x)     : Inverse tangent               | Example: atan(1)")
    print("radians(x)  : Degrees to radians            | Example: sin(radians(90))")
    print("sinh(x)     : Hyperbolic sine               | Example: sinh(1)")
    print("cosh(x)     : Hyperbolic cosine             | Example: cosh(1)")
    print("tanh(x)     : Hyperbolic tangent            | Example: tanh(1)")
    print("asinh(x)    : Inverse hyperbolic sine       | Example: asinh(1)")
    print("acosh(x)    : Inverse hyperbolic cosine     | Example: acosh(2)")
    print("atanh(x)    : Inverse hyperbolic tangent    | Example: atanh(0.5)")
    print("exp(x)      : e^x                           | Example: exp(2)")
    print("log(x)      : Natural log (base e)          | Example: log(10)")
    print("log10(x)    : Logarithm base 10             | Example: log10(100)")
    print("log2(x)     : Logarithm base 2              | Example: log2(8)")
    print("sqrt(x)     : Square root                   | Example: sqrt(16)")
    print("pow(x, y)   : x raised to power y           | Example: pow(2, 3)")
    print("fabs(x)     : Absolute value (float)        | Example: fabs(-5.5)")
    print("floor(x)    : Round down to nearest int     | Example: floor(3.7)")
    print("ceil(x)     : Round up to nearest int       | Example: ceil(3.1)")
    print("modf(x)     : Fractional & int parts        | Example: modf(3.14)")
    print("pi, e, tau  : Math constants                | Example: 2*pi, e, tau")
    print("gcd(x, y)   : Greatest common divisor       | Example: gcd(12, 18)")
    print("lcm(x, y)   : Least common multiple         | Example: lcm(4, 6)")
    print("comb(n, k)  : Combinations (n choose k)     | Example: comb(5, 2)")
    print("perm(n, k)  : Permutations                  | Example: perm(5, 2)")
    print("factorial(x): x factorial (x!)              | Example: factorial(5)")
    msvcrt.getch()
    clear_screen()

if __name__ == "__main__":
    main()