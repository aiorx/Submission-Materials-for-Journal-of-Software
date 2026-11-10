def __init__(self, width, height):
    self.width = width
    self.height = height
    self.tiles = [[Tiles.air for _ in range(height)] for _ in range(width)]