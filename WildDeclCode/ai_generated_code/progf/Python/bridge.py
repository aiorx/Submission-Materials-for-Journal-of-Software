"""
    Bridge
    -------
    The main idea behind the Bridge pattern is to separate the abstract representation of a class or
    object from its implementation details. It allows the abstraction and the implementation to be modified
    independently without affecting each other. This promotes flexibility, extensibility, and maintenance
    of the codebase.

    - All descriptions and comments Designed via basic programming aids and GitHub Copilot
"""
from abc import ABC, abstractmethod  # Abstract Base Classes

class Renderer(ABC):
    """
    The Renderer interface declares methods for executing the rendering methods.
    """
    @abstractmethod
    def render_circle(self, radius: float) -> None:
        pass

class VectorRenderer(Renderer):
    def render_circle(self, radius: float) -> None:
        """
            Render a circle using vector graphics
        """
        print(f"Drawing a circle of radius {radius}")

class RasterRenderer(Renderer):
    def render_circle(self, radius: float) -> None:
        """
            Render a circle using raster graphics
        """
        print(f"Drawing pixels for a circle of radius {radius}")

class Shape:
    def __init__(self, renderer: Renderer) -> None:
        """
            The Shape constructor accepts a renderer implementation as an argument.
        """
        self.renderer = renderer

    def draw(self) -> None:
        pass

class Circle(Shape):
    def __init__(self, renderer, radius):
        super().__init__(renderer)
        self.radius = radius

    def draw(self) -> None:
        """
            The implementation in the Shape class delegates the rendering work to the linked renderer object.
        """
        self.renderer.render_circle(self.radius)

if __name__ == "__main__":
    # Create a vector renderer and a raster renderer
    vector_renderer = VectorRenderer()
    raster_renderer = RasterRenderer()

    # Create a circle with a vector renderer and a raster renderer
    circle1 = Circle(vector_renderer, 5)
    circle1.draw()

    circle2 = Circle(raster_renderer, 10)
    circle2.draw()

"""
    Output:
    -------
    Drawing a circle of radius 5 using VectorRenderer.
    Drawing a circle of radius 10 using RasterRenderer.
"""


