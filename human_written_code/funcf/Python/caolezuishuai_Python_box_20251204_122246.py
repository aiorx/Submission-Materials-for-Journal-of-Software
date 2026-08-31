```python
def load_frames(self):
    sheet = setup.GFX['tile_set']
    frame_rect_list = [(384, 0, 16, 16), (400, 0, 16, 16), 
        (416, 0, 16, 16), (400, 0, 16, 16), (432, 0, 16, 16)]
    for frame_rect in frame_rect_list:
        self.frames.append(tools.get_image(sheet, *frame_rect, 
                        c.BLACK, c.BRICK_SIZE_MULTIPLIER))
```