# Assisted using common GitHub development utilities

import pygame


class Brick(pygame.sprite.Sprite):
    """키보드로 움직일 수 있는 바(벽돌) 클래스"""

    def __init__(self, x=300, y=380, width=80, height=15, color=(0, 0, 255), speed=7):
        super().__init__()
        self.image = pygame.Surface((width, height))
        self.image.fill(color)
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.speed = speed

    def update(self, keys=None):
        if keys is None:
            keys = pygame.key.get_pressed()
        left = keys[pygame.K_LEFT] if isinstance(keys, (list, tuple)) else keys.get(pygame.K_LEFT, False)
        right = keys[pygame.K_RIGHT] if isinstance(keys, (list, tuple)) else keys.get(pygame.K_RIGHT, False)
        if left:
            self.rect.x -= self.speed
        if right:
            self.rect.x += self.speed

        # 화면 밖으로 나가지 않도록 제한
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.right > 600:
            self.rect.right = 600