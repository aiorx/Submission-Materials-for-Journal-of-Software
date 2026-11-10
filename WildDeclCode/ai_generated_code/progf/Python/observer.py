"""
    Observer
    --------
    The Observer design pattern establishes a one-to-many relationship between objects,
    allowing them to communicate and stay updated. It consists of a Subject that notifies
    its Observers of any state changes. This pattern promotes loose coupling and enables
    dynamic subscription and unsubscription of Observers. It facilitates event-driven systems
    and separates the logic of the Subject from the Observers.

    - All descriptions and comments Designed via basic programming aids and GitHub Copilot
"""
class NewsAgency:
    """
        The Subject class
    """
    def __init__(self):
        self.subscribers = []

    def add_subscriber(self, subscriber: "Subscriber") -> None:
        """
            Adds the subscriber to the list of subscribers
        """
        self.subscribers.append(subscriber)

    def remove_subscriber(self, subscriber: "Subscriber") -> None:
        """
            Removes the subscriber from the list of subscribers
        """
        self.subscribers.remove(subscriber)

    def notify_subscribers(self, news: str) -> None:
        """
            Notifies all subscribers with the news
        """
        for subscriber in self.subscribers:
            subscriber.update(news)

class Subscriber:
    """
        The Observer class
    """
    def __init__(self, name: str):
        self.name = name

    def update(self, news: str) -> None:
        """
            Updates the subscriber with the news
        """
        print(f"{self.name} received news: {news}")


if __name__ == "__main__":
    # Client code
    agency = NewsAgency()
    subscriber1 = Subscriber("John")
    subscriber2 = Subscriber("Jane")

    # Subscribe the subscribers to the agency
    agency.add_subscriber(subscriber1)
    agency.add_subscriber(subscriber2)

    # Notify the subscribers
    agency.notify_subscribers("Hello World!")
    agency.remove_subscriber(subscriber2)
    agency.notify_subscribers("Hello World!")

"""
    Output:
    -------
    John received news: Hello World!
    Jane received news: Hello World!
    John received news: Hello World!
"""