"""
    Memento
    -------
    The Memento design pattern allows objects to capture and restore their internal
    state without exposing implementation details. It provides a way to store and
    retrieve object states, enabling undo/redo functionality or returning to previous
    states. It involves three main components: Originator (object with state),
    Memento (immutable state holder), and Caretaker (manages Mementos). By using Memento,
    objects can maintain encapsulation while enabling state management and undo operations.

    - All descriptions and comments Crafted with standard coding tools and GitHub Copilot
"""
class EditorMemento:
    """
        The Memento class, which is the immutable state holder
    """
    def __init__(self, content):
        self.saved_content = content

    def get_content(self) :
        """
            Returns the saved content
        """
        return self.saved_content

class Editor:
    """
        The Originator class, which is the object that has an internal state to be
    """
    def __init__(self):
        self.content = ""

    def type(self, text) :
        """
            Adds text to the content
        """
        self.content += " " + text

    def save(self) :
        """
            Saves the current state of the content
        """
        return EditorMemento(self.content)

    def restore(self, memento) :
        """
            Restores the content to a previous state
        """
        self.content = memento.saved_content

class History:
    """
        The Caretaker class, which manages the Mementos
    """
    def __init__(self):
        self.mementos = []

    def push(self, memento) :
        """
            Adds a Memento to the list
        """
        self.mementos.append(memento)

    def pop(self) :
        """
            Removes and returns the last Memento in the list
        """
        return self.mementos.pop()


if __name__ == "__main__":
    # Client code
    editor = Editor()
    history = History()

    # Type some sentences
    editor.type("This is the first sentence.")
    history.push(editor.save())

    editor.type("This is the second sentence.")
    history.push(editor.save())

    editor.type("This is the third sentence.")
    history.push(editor.save())

    # Restore to the previous state
    memento = history.pop()
    editor.restore(memento)
    print("Memento: ", editor.content)

    memento = history.pop()
    editor.restore(memento)
    print("Memento: ", editor.content)


"""
    Output:
    -------
    Memento:   This is the first sentence. This is the second sentence. This is the third sentence.
    Memento:   This is the first sentence. This is the second sentence.
"""

