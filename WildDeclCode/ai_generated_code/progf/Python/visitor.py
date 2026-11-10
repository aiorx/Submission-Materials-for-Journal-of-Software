"""
    Visitor
    -------
    The Visitor design pattern allows adding new operations to a group of
    related objects without modifying their individual classes. It separates
    the behavior from the objects by introducing a visitor object that visits
    and performs operations on the objects. This promotes extensibility and
    follows the Open-Closed Principle by allowing new behaviors to be added
    without modifying existing code.

    - All descriptions and comments Crafted with standard coding tools and GitHub Copilot
"""
from abc import ABC, abstractmethod

class Furniture(ABC):
    """
        Abstract class for furniture
    """
    @abstractmethod
    def accept(self, visitor: "Visitor") -> None:
        pass

class Chair(Furniture):
    """
        Chair class
    """
    def accept(self, visitor: "Visitor") -> None:
        visitor.visit_chair(self)

    def sit(self) -> None:
        print("Sitting on the chair")

class Table(Furniture):
    """
        Table class
    """
    def accept(self, visitor: "Visitor") -> None:
        visitor.visit_table(self)

    def place_items(self) -> None:
        print("Placing items on the table")

class Visitor(ABC):
    """
        Abstract class for visitors
    """
    @abstractmethod
    def visit_chair(self, chair: Chair) -> None:
        """
            Visit a chair
        """
        pass

    @abstractmethod
    def visit_table(self, table: Table) -> None:
        """
            Visit a table
        """
        pass

class FurnitureCleaner(Visitor):
    """
        Concrete Visitor
    """
    def visit_chair(self, chair: Chair) -> None:
        chair.sit()

    def visit_table(self, table: Table) -> None:
        table.place_items()


if __name__ == "__main__":
    # Client Code
    furniture_items = [Chair(), Table()]
    cleaner = FurnitureCleaner()

    # Visit all furniture items
    for item in furniture_items:
        item.accept(cleaner)

"""
    Output:
    -------
    Sitting on the chair
    Placing items on the table
"""