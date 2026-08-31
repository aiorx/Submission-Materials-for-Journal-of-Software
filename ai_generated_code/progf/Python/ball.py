"""
Supported via standard GitHub programming aids

BallSprite 클래스: 화면에서 움직이며 BrickSprite와 탄성 충돌하는 공 구현.
PEP 8, PEP 257, PEP 484 스타일 가이드 준수.
"""
import pygame
from pygame.sprite import Sprite
from brick import BrickSprite

class BallSprite(Sprite):
    """벽돌과 탄성 충돌하는 공 스프라이트 클래스."""
    def __init__(self, x: int, y: int, radius: int = 10, color: tuple = (0, 0, 200), velocity: tuple = (4, -4)) -> None:
        super().__init__()
        self.image = pygame.Surface((radius * 2, radius * 2), pygame.SRCALPHA)
        pygame.draw.circle(self.image, color, (radius, radius), radius)
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.radius = radius
        self.vx, self.vy = velocity

    def update(self, brick: BrickSprite, screen_rect: pygame.Rect) -> None:
        """공의 위치를 업데이트하고, 벽 및 brick과의 충돌을 처리합니다."""
        self.rect.x += self.vx
        self.rect.y += self.vy

        # 화면 경계 충돌 처리
        if self.rect.left <= screen_rect.left or self.rect.right >= screen_rect.right:
            self.vx *= -1
        if self.rect.top <= screen_rect.top:
            self.vy *= -1
        if self.rect.bottom >= screen_rect.bottom:
            self.vy *= -1

        # brick과 충돌 체크 및 탄성 반사
        if self.rect.colliderect(brick.rect):
            # 충돌 방향 계산
            dx = (self.rect.centerx - brick.rect.centerx) / (brick.rect.width / 2)
            dy = (self.rect.centery - brick.rect.centery) / (brick.rect.height / 2)
            if abs(dx) > abs(dy):
                self.vx *= -1
            else:
                self.vy *= -1
