"""
    Iterator
    --------
    The iterator pattern is a design pattern that allows you to traverse
    and access elements of a collection without knowing its underlying
    structure. It promotes encapsulation and flexibility by decoupling
    client code from the collection's implementation details.

    - All descriptions and comments Designed via basic programming aids and GitHub Copilot
"""
from abc import ABC, abstractmethod

class Iterator(ABC):
    """
        Iterator class that defines the interface for accessing and traversing
    """
    @abstractmethod
    def has_next(self) -> bool:
        pass

    @abstractmethod
    def next(self) -> object:
        pass

class Aggregate(ABC):
    """
        Aggregate class that defines the interface for creating an iterator
    """
    @abstractmethod
    def create_iterator(self) -> Iterator:
        pass

class NumberIterator(Iterator):
    """
        NumberIterator class that implements the Iterator interface
    """
    def __init__(self, numbers: list):
        self.numbers = numbers
        self.index = 0

    def has_next(self) -> bool:
        return self.index < len(self.numbers)

    def next(self) -> object:
        if self.has_next():
            self.index += 1
            return self.numbers[self.index - 1]

class NumberCollection(Aggregate):
    """
        NumberCollection class that implements the Aggregate interface
    """
    def __init__(self):
        self.numbers = []

    def create_iterator(self) -> Iterator:
        return NumberIterator(self.numbers)

    def add_number(self, number: int) -> None:
        self.numbers.append(number)


if __name__ == "__main__":
    collection = NumberCollection()
    collection.add_number(1)
    collection.add_number(2)
    collection.add_number(3)

    iterator = collection.create_iterator()
    while iterator.has_next():
        print(iterator.next())

"""
    Output:
    -------
    1
    2
    3
"""