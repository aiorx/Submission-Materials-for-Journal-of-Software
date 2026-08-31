"""
    Mediator
    --------
    The mediator pattern is a behavioral design pattern that promotes loose coupling between components
    by introducing a mediator object that encapsulates the communication logic between them. It allows
    multiple objects, called colleagues, to interact with each other indirectly through the mediator,
    instead of directly communicating with one another. This pattern enhances maintainability and
    flexibility, as it centralizes the control and coordination of interactions, enabling easier
    modifications or extensions to the system.

     - All descriptions and comments Designed via basic programming aids and GitHub Copilot
"""

class Aircraft:
    """
        Colleague
    """
    def __init__(self, name, flight_control_tower: "FlightControlTower"):
        self.__name = name
        self.__flight_control_tower = flight_control_tower

    def send_message(self, message: str):
        """
            Send message to all aircrafts except the sender
        """
        self.__flight_control_tower.send_message(self, message)

    def receive_message(self, message):
        """
            Receive message from the flight control tower
        """
        print(f"{self.__name} received message: {message}")

class FlightControlTower:
    """
        Mediator
    """
    def __init__(self):
        self.__aircrafts = []

    def register_aircraft(self, aircraft: Aircraft) -> None:
        """
            Register aircraft to the flight control tower
        """
        self.__aircrafts.append(aircraft)

    def send_message(self, sender: Aircraft, message: str) -> None:
        """
            Send message to all aircrafts except the sender
        """
        for aircraft in self.__aircrafts:
            if aircraft != sender:
                aircraft.receive_message(message)


if __name__ == "__main__":
    # Client
    flight_control_tower = FlightControlTower()

    # Colleagues
    aircraft1 = Aircraft("Boeing 747", flight_control_tower)
    aircraft2 = Aircraft("Airbus A380", flight_control_tower)

    # Register aircrafts to the flight control tower
    flight_control_tower.register_aircraft(aircraft1)
    flight_control_tower.register_aircraft(aircraft2)

    # Send message to all aircrafts except the sender
    aircraft1.send_message("Hello from Boeing 747!")
    aircraft2.send_message("Hello from Airbus A380!")

"""
    Output:
    -------
    Airbus A380 received message: Hello from Boeing 747!
    Boeing 747 received message: Hello from Airbus A380!
"""