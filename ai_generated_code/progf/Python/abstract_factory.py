"""
    Abstract Factory
    ----------------
    This pattern provides an interface for creating families of related or dependent objects without
    specifying their concrete classes. It allows the creation of object hierarchies that are specific
    to a particular implementation or platform.

    - All descriptions and comments Designed via basic programming aids and GitHub Copilot
"""

from abc import ABC, abstractmethod  # Abstract Base Class

class Button(ABC):
    """
        Abstract Base Class for Button
    """
    @abstractmethod
    def render(self) -> None:
        pass

class WindowsButton(Button):
    """
        Concrete Class for WindowsButton
    """
    def render(self) -> None:
        print("Windows Button")

class MacButton(Button):
    """
        Concrete Class for MacButton
    """
    def render(self) -> None:
        print("Mac Button")

class Checkbox(ABC):
    """
        Abstract Base Class for Checkbox
    """
    @abstractmethod
    def render(self) -> None:
        pass

class WindowsCheckbox(Checkbox):
    """
        Concrete Class for WindowsCheckbox
    """
    def render(self) -> None:
        print("Windows Checkbox")

class MacCheckbox(Checkbox):
    """
        Concrete Class for MacCheckbox
    """
    def render(self) -> None:
        print("Mac Checkbox")

class GUIFactory(ABC):
    """
        Abstract Base Class for GUIFactory
    """
    @abstractmethod
    def create_button(self) -> Button:
        pass

    @abstractmethod
    def create_checkbox(self) -> Checkbox:
        pass

class WindowsFactory(GUIFactory):
    """
        Concrete Factory 1
    """
    def create_button(self) -> Button:
        return WindowsButton()

    def create_checkbox(self) -> Checkbox:
        return WindowsCheckbox()

class MacFactory(GUIFactory):
    """
        Concrete Factory 2
    """
    def create_button(self) -> Button:
        return MacButton()

    def create_checkbox(self) -> Checkbox:
        return MacCheckbox()

# Client
class Application:
    def __init__(self, factory: GUIFactory):
        self.factory = factory

    def create_ui(self) -> None:
        button = self.factory.create_button()
        checkbox = self.factory.create_checkbox()
        button.render()
        checkbox.render()


if __name__ == "__main__":
    app = Application(WindowsFactory())
    app.create_ui()
    app = Application(MacFactory())
    app.create_ui()

"""
    Output:
    -------
    Windows Button
    Windows Checkbox
    Mac Button
    Mac Checkbox
"""
