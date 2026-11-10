"""
    Factory Method
    --------------
    This pattern defines an interface for creating objects, but allows subclasses to decide which class to instantiate.
    It provides a way to delegate the object creation to subclasses, promoting flexibility and extensibility.

    - All descriptions and comments Designed via basic programming aids and GitHub Copilot
"""

from abc import ABC, abstractmethod  # Abstract Base Class
from enum import Enum  # Enum for VehicleType

class VehicleType(Enum):
    """
        Enum for VehicleType
    """
    CAR = 1
    TRUCK = 2

class Vehicle(ABC):
    """
        Abstract Base Class for Vehicle
    """
    @abstractmethod
    def drive(self) -> None:
        pass

class Car(Vehicle):
    """
        Concrete Class for Car
    """
    def drive(self) -> None:
        print("Driving Car")

class Truck(Vehicle):
    """
        Concrete Class for Truck
    """
    def drive(self) -> None:
        print("Driving Truck")

class VehicleFactory:
    """
        Factory Class for Vehicle
    """
    def create_vehicle(self, vehicle_type: VehicleType) -> Car | Truck:
        """
            Create a vehicle
        """
        if vehicle_type == VehicleType.CAR:
            return Car()
        elif vehicle_type == VehicleType.TRUCK:
            return Truck()
        else:
            raise Exception("Invalid Vehicle Type")


if __name__ == "__main__":
    # Clint Code
    vehicle_factory = VehicleFactory()

    # Create a car and a truck
    car = vehicle_factory.create_vehicle(VehicleType.CAR)
    car.drive()

    truck = vehicle_factory.create_vehicle(VehicleType.TRUCK)
    truck.drive()

"""
    Output:
    -------
    Driving Car
    Driving Truck
"""