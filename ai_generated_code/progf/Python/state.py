"""
    State
    -----
    The State design pattern is a behavioral pattern that allows an object to alter
    its behavior when its internal state changes. It enables an object to encapsulate
    different behaviors based on its internal state and simplifies the management of
    complex state transitions. The pattern involves defining a set of states as separate
    classes, each representing a specific behavior, and allowing the object to transition
    between these states based on certain conditions. By using the State pattern, the
    object's behavior can vary dynamically without the need for numerous conditional
    statements, resulting in a more flexible and maintainable design.


    - All descriptions and comments Formed using common development resources and GitHub Copilot
"""
from abc import ABC, abstractmethod

class OrderState(ABC):
    """
        OrderState
    """
    @abstractmethod
    def process_order(self) -> None:
        pass

class PendingState(OrderState):
    """
        PendingState
    """
    def process_order(self) -> None:
        print("Processing order...")

class ProcessingState(OrderState):
    """
        ProcessingState
    """
    def process_order(self) -> None:
        print("Order is being processed...")

class ShippedState(OrderState):
    """
        ShippedState
    """
    def process_order(self) -> None:
        print("Order has been shipped!")

class DeliveredState(OrderState):
    """
        DeliveredState
    """
    def process_order(self) -> None:
        print("Order has been delivered!")

class Order:
    """
        Order
    """
    def __init__(self) -> None:
        self.state = PendingState()

    def process(self) -> None:
        self.state.process_order()

    def change_state(self, state: OrderState) -> None:
        self.state = state


if __name__ == "__main__":
    # Client code
    order = Order()

    # Order is pending
    order.change_state(PendingState())
    order.process()

    # Order is processing
    order.change_state(ProcessingState())
    order.process()

    # Order is shipped
    order.change_state(ShippedState())
    order.process()

    # Order is delivered
    order.change_state(DeliveredState())
    order.process()

"""
    Output:
    -------
    Processing order...
    Order is being processed...
    Order has been shipped!
    Order has been delivered!
"""
