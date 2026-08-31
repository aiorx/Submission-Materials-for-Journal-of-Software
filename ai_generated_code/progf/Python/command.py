"""
    Command
    -------
    The command pattern is a design pattern that encapsulates requests as objects,
    enabling flexibility and decoupling between the sender and receiver. It promotes
    loose coupling, extensibility, and the ability to support complex operations by
    representing them as discrete objects.

    - All descriptions and comments Formed using common development resources and GitHub Copilot
"""
from abc import ABC, abstractmethod

class Command(ABC):
    """
        The Command interface declares a method for executing a command.
    """
    @abstractmethod
    def execute(self) -> None:
        pass

class Television:
    """
        Television is the receiver of the requests.
    """
    def turn_on(self) -> None:
        """
            Turn on the television.
        """
        print("Television: turn on")

    def turn_off(self) -> None:
        """
            Turn off the television.
        """
        print("Television: turn off")

class TurnOnCommand(Command):
    """
        TurnOnCommand is the concrete command for turning on the television.
    """
    def __init__(self, receiver: Television) -> None:
        self._receiver = receiver

    def execute(self) -> None:
        """
            Execute the command by calling the receiver's action.
        """
        self._receiver.turn_on()

class TurnOffCommand(Command):
    """
        TurnOffCommand is the concrete command for turning off the television.
    """
    def __init__(self, receiver: Television) -> None:
        self._receiver = receiver

    def execute(self) -> None:
        """
            Execute the command by calling the receiver's action.
        """
        self._receiver.turn_off()

class RemoteControl:
    """
        The invoker class.
    """
    def __init__(self):
        self.command = None

    def set_command(self, command):
        self.command = command

    def press_button(self):
        """
            Press the button to execute the command.
        """
        if self.command is not None:
            self.command.execute()

if __name__ == "__main__":
    # Client code
    television = Television()
    turn_on_command = TurnOnCommand(television)
    turn_off_command = TurnOffCommand(television)

    # Invoker
    remote_control = RemoteControl()

    remote_control.set_command(turn_on_command)
    remote_control.press_button()

    remote_control.set_command(turn_off_command)
    remote_control.press_button()

"""
    Output:
    -------
    Television: turn on
    Television: turn off
        
"""