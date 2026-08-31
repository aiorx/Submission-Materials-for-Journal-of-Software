```python
def draw(self):
    """
    Draw the block from shape blocks. Each shape block
    is filled with a color and black border.
    """
    for bl in self.shape:
        pygame.draw.rect(self.screen,self.color,bl)
        pygame.draw.rect(self.screen,constants.BLACK,bl,constants.MESH_WIDTH)
```