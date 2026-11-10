"""
    Prototype Pattern
    -----------------
    This pattern involves creating a copy or clone of an existing object instead of creating new instances.
    It allows you to create new objects by cloning existing ones, which can be more efficient than creating
    objects from scratch, especially when the object creation is complex or resource-intensive.

    - All descriptions and comments Formed using common development resources and GitHub Copilot
"""
import copy

class Pizza:
    """
        Pizza class
    """
    def __init__(self, name: str, ingredients: list[str], price: int):
        self.name = name
        self.ingredients = ingredients
        self.price = price

    def __str__(self) -> str:
        return f"{self.name} pizza with {self.ingredients} costs {self.price}"

    def clone(self) -> "Pizza":
        """
            Clone method to create a copy of the object
            :return: Pizza object
        """
        return copy.deepcopy(self)

    # other methods


if __name__ == "__main__":
    pizza1 = Pizza("Pepperoni", ["Pepperoni", "Cheese"], 10)
    pizza2 = pizza1.clone()
    print(pizza1)
    print(pizza2)

"""
    Output:
    -------
    Pepperoni pizza with ['Pepperoni', 'Cheese'] costs 10
    Pepperoni pizza with ['Pepperoni', 'Cheese'] costs 10
"""