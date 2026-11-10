"""
    Decorator pattern
    -----------------
    The Decorator design pattern is a structural design pattern that allows you to add
    new behavior or functionality to an existing object dynamically without modifying
    its structure. It is one of the Gang of Four (GoF) design patterns and promotes the
    principle of "open-closed" - classes should be open for extension but closed for
    modification.

    - All descriptions and comments Crafted with standard coding tools and GitHub Copilot
"""
from abc import ABC, abstractmethod  # Abstract Base Classes

class Beverage(ABC):
    """
        Abstract class for beverages
    """
    @abstractmethod
    def get_description(self) -> str:
        pass

    @abstractmethod
    def get_cost(self) -> float:
        pass

class Coffee(Beverage):
    """
        Concrete class for coffee
    """
    def get_description(self) -> str:
        return "Coffee"

    def get_cost(self) -> float:
        return 1.00

class Tea(Beverage):
    """
        Concrete class for tea
    """
    def get_description(self) -> str:
        return "Tea"

    def get_cost(self) -> float:
        return 0.75

class CondimentDecorator(Beverage, ABC):
    """
        Abstract class for condiments
    """
    @abstractmethod
    def get_description(self) -> str:
        pass

    @abstractmethod
    def get_cost(self) -> float:
        pass

class Milk(CondimentDecorator):
    def __init__(self, _beverage: Beverage):
        self.beverage = _beverage

    def get_description(self):
        return self.beverage.get_description() + ", Milk"

    def get_cost(self):
        return self.beverage.get_cost() + 0.25

class Sugar(CondimentDecorator):
    def __init__(self, _beverage):
        self.beverage = _beverage

    def get_description(self):
        return self.beverage.get_description() + ", Sugar"

    def get_cost(self):
        return self.beverage.get_cost() + 0.10

if __name__ == "__main__":
    beverage = Coffee()
    beverage = Milk(beverage)
    beverage = Sugar(beverage)
    print(beverage.get_description(), "$" + str(beverage.get_cost()))

    beverage = Tea()
    beverage = Sugar(beverage)
    beverage = Milk(beverage)
    print(beverage.get_description(), "$" + str(beverage.get_cost()))

"""
    Output:
    -------
    Coffee, Milk, Sugar $1.35
    Tea, Sugar, Milk $1.1
"""
