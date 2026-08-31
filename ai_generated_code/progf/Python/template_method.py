"""
    Template Method
    ---------------
    The Template Method design pattern defines the basic structure of an algorithm
    in a base class, while allowing subclasses to customize specific steps. It promotes
    code reuse and flexibility by providing a template for the algorithm, with predefined
    steps and customizable implementations. This pattern ensures consistent behavior across
    different subclasses while allowing for variations in specific parts of the algorithm.

    - All descriptions and comments Crafted with standard coding tools and GitHub Copilot
"""
from abc import ABC, abstractmethod

class Character(ABC):
    """
        Character is the base class for all characters.
    """
    def attack(self) -> None:
        """
            The attack method is the base method for all characters.
        """
        self.prepare_weapon()
        self.execute_attack()
        self.cleanup()

    @abstractmethod
    def prepare_weapon(self) -> None:
        """
            The prepare_weapon method is the base method for all characters.
        """
        pass

    @abstractmethod
    def execute_attack(self) -> None:
        """
            The execute_attack method is the base method for all characters.
        """
        pass

    @abstractmethod
    def cleanup(self) -> None:
        """
            The cleanup method is the base method for all characters.
        """
        pass

class Warrior(Character):
    """
        Warrior is a concrete implementation of the Character class.
    """
    def prepare_weapon(self) -> None:
        print("Warrior: Selecting a powerful weapon")

    def execute_attack(self) -> None:
        print("Warrior: Performing a strong attack")

    def cleanup(self) -> None:
        print("Warrior: Cleaning up after the attack")

class Archer(Character):
    """
        Archer is a concrete implementation of the Character class.
    """
    def prepare_weapon(self) -> None:
        print("Archer: Equipping a bow and arrows")

    def execute_attack(self) -> None:
        print("Archer: Shooting arrows from a distance")

    def cleanup(self) -> None:
        print("Archer: Collecting arrows and tidying up")


if __name__ == "__main__":
    # Create a warrior and an archer
    warrior = Warrior()
    warrior.attack()

    archer = Archer()
    archer.attack()

"""
    Output:
    ------
    Warrior: Selecting a powerful weapon
    Warrior: Performing a strong attack
    Warrior: Cleaning up after the attack
    Archer: Equipping a bow and arrows
    Archer: Shooting arrows from a distance
    Archer: Collecting arrows and tidying up
"""



