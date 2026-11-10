"""
    Facade Pattern
    --------------
    The facade design pattern is a structural design pattern that provides a simple and unified
    interface to a complex subsystem of classes, making it easier to use and understand. It
    belongs to the Gang of Four (GoF) design patterns.

    - All descriptions and comments Designed via basic programming aids and GitHub Copilot
"""
class Engine:
    """
        Engine class
    """
    def __init__(self):
        pass

    def start(self) -> None:
        print("Engine started")

    def stop(self) -> None:
        print("Engine stopped")

class Light:
    """
        Light class
    """
    def __init__(self):
        pass

    def turn_on(self) -> None:
        print("Light turned on")

    def turn_off(self) -> None:
        print("Light turned off")

class CarFacade:
    """
        CarFacade class
    """
    def __init__(self):
        self.engine = Engine()
        self.light = Light()

    def start(self) -> None:
        self.engine.start()
        self.light.turn_on()

    def stop(self) -> None:
        self.engine.stop()
        self.light.turn_off()

if __name__ == "__main__":
    car = CarFacade()
    car.start()
    car.stop()

"""
    Output:
    -------
    Engine started
    Light turned on
    Engine stopped
    Light turned off
"""