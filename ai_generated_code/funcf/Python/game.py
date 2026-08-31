```python
self.angle = math.atan2(mouse_y - player_y, mouse_x - player_x)
```
```python
pygame.draw.line(globals.screen, (0, 0, 0), (self.player.x + (Player.CHARACTER_WIDTH / 2), self.camera.calculate_pygame_pos(self.player.y)), (pygame.mouse.get_pos()[0], pygame.mouse.get_pos()[1]), 5)
```