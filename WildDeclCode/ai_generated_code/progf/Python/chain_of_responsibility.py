"""
    Behavioral Design Pattern
    -------------------------
    Behavioral design patterns define the communication and interaction between objects or
    components in a software system, enabling flexible and reusable solutions for managing
    complex behaviors and interactions. They encompass patterns like Observer, Strategy,
    Command, and Iterator, providing strategies for organizing and coordinating software
    component behavior effectively.

    Chain of Responsibility
    -----------------------
    Chain of Responsibility is a design pattern that allows objects to handle a request sequentially
    until it finds a suitable handler. It promotes loose coupling and flexibility in handling requests.

    - All descriptions and comments Crafted with standard coding tools and GitHub Copilot
"""
from abc import ABC, abstractmethod

class PurchaseRequest:
    """
        The PurchaseRequest class represents a request to purchase an item.
    """
    def __init__(self, amount: int):
        self.amount = amount

class Approver(ABC):
    """
        The Approver interface declares a method for building the chain of handlers.
    """
    def __init__(self):
        self.successor = None

    @abstractmethod
    def process_request(self, request: PurchaseRequest):
        pass

    def set_successor(self, successor: "Approver"):
        self.successor = successor

class Manager(Approver):
    """
        The Manager class represents a handler in the chain of responsibility.
    """
    name = "Manager"

    def process_request(self, request: PurchaseRequest):
        if request.amount < 1000:
            print(f"{self.name} approved request for ${request.amount}")
        elif self.successor is not None:
            self.successor.process_request(request)

class Director(Approver):
    """
        The Director class represents a handler in the chain of responsibility.
    """
    name = "Director"

    def process_request(self, request: PurchaseRequest):
        if request.amount < 10000:
            print(f"{self.name} approved request for ${request.amount}")
        elif self.successor is not None:
            self.successor.process_request(request)

class CEO(Approver):
    """
        The CEO class represents a handler in the chain of responsibility.
    """
    name = "CEO"

    def process_request(self, request: PurchaseRequest):
        if request.amount < 25000:
            print(f"{self.name} approved request for ${request.amount}")
        elif self.successor is not None:
            self.successor.process_request(request)


if __name__ == "__main__":
    # Initialize the chain
    manager = Manager()
    director = Director()
    ceo = CEO()

    # Set the successor
    manager.set_successor(director)
    director.set_successor(ceo)

    # Create requests
    request1 = PurchaseRequest(500)
    request2 = PurchaseRequest(5000)
    request3 = PurchaseRequest(15000)

    # Process requests
    manager.process_request(request1)
    manager.process_request(request2)
    manager.process_request(request3)

"""
    Output:
    -------
    Manager approved request for $500
    Director approved request for $5000
    CEO approved request for $15000
"""