"""
    Proxy Pattern
    -------------
    The Proxy pattern is a design pattern that provides a surrogate or placeholder for
    another object in order to control access to it. It falls under the category of
    structural design patterns and is used when we want to add an additional layer
    of indirection to our objects.

    - All descriptions and comments Crafted with standard coding tools and GitHub Copilot
"""
from abc import ABC, abstractmethod

class Image(ABC):
    """
        The Image interface declares the operations that all concrete proxies must
    """
    @abstractmethod
    def display(self) -> None:
        pass

class HighResolutionImage(Image):
    """
        The HighResolutionImage class is a helper class to load the image from the disk
    """
    def __init__(self, image_path: str):
        self.image_path = image_path
        self.load_image_from_disk()

    def load_image_from_disk(self) -> None:
        print(f'Loading image {self.image_path}')

    def display(self) -> None:
        print(f'Displaying image {self.image_path}')

class ImageProxy(Image):
    """
        The ImageProxy class is the proxy for the HighResolutionImage class
    """
    def __init__(self, image_path: str):
        self.image_path = image_path
        self.image = None

    def display(self) -> None:
        if self.image is None:
            self.image = HighResolutionImage(self.image_path)
        self.image.display()

if __name__ == '__main__':
    image = ImageProxy('sample.jpg')
    image.display()

"""
    Output:
    -------
    Loading image sample.jpg
    Displaying image sample.jpg
"""