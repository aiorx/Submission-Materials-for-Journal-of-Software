"""
Aided with basic GitHub coding tools

키보드로 움직일 수 있는 BrickSprite 클래스 예제.
PEP 8, PEP 257, PEP 484 스타일 가이드 준수.
"""
import pygame
from pygame.sprite import Sprite

class BrickSprite(Sprite):
    """키보드로 움직일 수 있는 벽돌 스프라이트 클래스."""
    def __init__(self, x: int, y: int, width: int = 60, height: int = 20, color: tuple = (200, 0, 0)) -> None:
        super().__init__()
        self.image = pygame.Surface((width, height))
        self.image.fill(color)
        self.rect = self.image.get_rect()
        self.rect.topleft = (x, y)
        self.speed = 5

    def update(self, keys: pygame.key.ScancodeWrapper) -> None:
        """키 입력에 따라 스프라이트 위치를 업데이트합니다."""
        if keys[pygame.K_LEFT]:
            self.rect.x -= self.speed
        if keys[pygame.K_RIGHT]:
            self.rect.x += self.speed
        if keys[pygame.K_UP]:
            self.rect.y -= self.speed
        if keys[pygame.K_DOWN]:
            self.rect.y += self.speed
