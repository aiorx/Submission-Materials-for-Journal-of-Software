"""
    Strategy
    --------
    The Strategy design pattern allows for runtime selection of different
    algorithms or behaviors by encapsulating them in interchangeable objects.
    It promotes flexibility and modularity by separating the implementation
    details from the client code, enabling easy modification or extension of
    an object's behavior without affecting the system's structure.

    - All descriptions and comments Crafted with standard coding tools and GitHub Copilot
"""
from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    """
        The PaymentStrategy class is the base class for all payment strategies.
    """
    @abstractmethod
    def pay(self, amount: int) -> None:
        """
            The pay method is the base method for all payment strategies.
        """
        pass

class CreditCardStrategy(PaymentStrategy):
    """
        The CreditCardStrategy class is a concrete implementation of the
    """
    def pay(self, amount: int) -> None:
        """
            The pay method is the base method for all payment strategies.
        """
        print(f"Paid ${amount} using Credit Card.")

class PayPalStrategy(PaymentStrategy):
    """
        The PayPalStrategy class is a concrete implementation of the
    """
    def pay(self, amount: int) -> None:
        """
            The pay method is the base method for all payment strategies.
        """
        print(f"Paid ${amount} using PayPal.")

class BankTransferPayment(PaymentStrategy):
    """
        The BankTransferPayment class is a concrete implementation of the
    """
    def pay(self, amount: int) -> None:
        """
            The pay method is the base method for all payment strategies.
        """
        print(f"Paid ${amount} using Bank Transfer Payment.")

class ShoppingCart:
    """
        The ShoppingCart class is the context class that uses the payment
        strategies.
    """
    def __init__(self):
        self._items = []

    def add_item(self, item_price: int):
        """
            The add_item method adds an item to the shopping cart.
        """
        self._items.append(item_price)

    def calculate_total(self):
        """
            The calculate_total method calculates the total cost of the items
            in the shopping cart.
        """
        return sum(self._items)

    def pay(self, payment_strategy: PaymentStrategy):
        """
            The pay method uses the payment strategy to pay for the items in
            the shopping cart.
        """
        payment_strategy.pay(self.calculate_total())


if __name__ == "__main__":
    # Client code
    shopping_cart = ShoppingCart()
    shopping_cart.add_item(10)
    shopping_cart.add_item(20)
    shopping_cart.add_item(30)

    # Pay using different strategies
    shopping_cart.pay(CreditCardStrategy())
    shopping_cart.pay(PayPalStrategy())
    shopping_cart.pay(BankTransferPayment())

"""
    Output:
    ------
    Paid $60 using Credit Card.
    Paid $60 using PayPal.
    Paid $60 using Bank Transfer Payment.
"""
