```python
def get_image(self, x, y, width, height):
    """Extracts the image from the sprite sheet"""
    image = pg.Surface([width, height]).convert()
    rect = image.get_rect()

    image.blit(self.sprite_sheet, (0, 0), (x, y, width, height))
    image.set_colorkey(c.BLACK)
    image = pg.transform.scale(image,
                               (int(rect.width*c.BRICK_SIZE_MULTIPLIER),
                                int(rect.height*c.BRICK_SIZE_MULTIPLIER)))
    return image
```