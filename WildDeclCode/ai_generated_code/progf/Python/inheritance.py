# note comments Assisted with basic coding tools code is from udemy

# Define a base class `User` with a `sign_in` method that all user-based classes can inherit
class User:
    def sign_in(self):
        # Method to simulate user login
        print('logged in')

# Define a subclass `Wizard` that inherits from `User`
class Wizard(User):
    def __init__(self, name, power) -> None:
        # Initialize the parent class (`User`) using super()
        super().__init__() 
        # Assign name and power as instance attributes specific to `Wizard`
        self.name = name
        self.power = power
    
    # Method to simulate the wizard's attack
    def attack(self):
        # Print a statement showing the wizard's power level during the attack
        print(f'attacking with power of {self.power}')    

# Define another subclass `Archer` that also inherits from `User`
class Archer(User):
    def __init__(self, name, num_arrows):
        # Initialize `name` and `num_arrows` attributes for the archer
        self.name = name 
        self.num_arrows = num_arrows        

    # Method to simulate the archer's attack
    def attack(self):
        # Print a statement showing the number of arrows left during the attack
        print(f'attacking with arrows: arrows left- {self.num_arrows}')

# Create an instance of `Wizard` with a name and power level
wizard1 = Wizard('Merlin', 50)
# Create an instance of `Archer` with a name and number of arrows
archer = Archer('Robin', 100)

# Call the `sign_in` method from the `User` class on the `wizard1` instance
print(wizard1.sign_in())  # Output: 'logged in'

# Using polymorphism
def player_attack(char):
    char.attack()
    
player_attack(wizard1)
player_attack(archer)

    
    
# wizard1 = Wizard('Merlin', 60)
# onfirms the inheritance relationship
# isinstance(wizard1, User)
# isinstance(wizard1, object)
# # accesses a built-in method of lists, but without calling it
# [].__repr__
# wizard1
