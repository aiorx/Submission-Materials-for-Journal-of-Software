"""
    Flyweight Pattern
    -----------------
    The Flyweight design pattern is a structural design pattern that focuses on
    minimizing the memory usage and improving performance by sharing common data
    among multiple objects. It is used when there is a large number of similar
    objects that can be effectively managed by sharing certain intrinsic state
    between them.

    - All descriptions and comments Designed via basic programming aids and GitHub Copilot
"""
class Image:
    """
        Image Class
    """
    def __init__(self, filename):
        self._filename = filename

    def display(self) -> None:
        print(f"Displaying: {self._filename}")

class ImageFlyweightFactory:
    """
        Image Flyweight Factory Class
    """
    def __init__(self):
        self._images = {}

    def add_image(self, filename:str) -> None:
        if filename not in self._images:
            self._images[filename] = Image(filename)

    def get_images(self) -> dict:
        return self._images

class Gallery:
    """
        Gallery Class
    """
    def __init__(self):
        self._factory = ImageFlyweightFactory()

    def add_image(self, filename: str) -> None:
        self._factory.add_image(filename)

    def display_images(self):
        for image in self._factory.get_images().values():
            image.display()


if __name__ == "__main__":
    gallery = Gallery()
    gallery.add_image("image1.png")
    gallery.add_image("image2.png")
    gallery.add_image("image3.png")
    gallery.add_image("image1.png")
    gallery.add_image("image2.png")
    gallery.add_image("image3.png")
    gallery.display_images()

"""
    Output:
    -------
    Displaying: image1.png
    Displaying: image2.png
    Displaying: image3.png
"""