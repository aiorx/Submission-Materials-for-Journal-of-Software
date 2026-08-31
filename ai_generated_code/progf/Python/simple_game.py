import pygame
import random
import sys

# Initialize pygame
pygame.init()

# Game constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
PLAYER_SPEED = 5
ENEMY_SPEED = 3
BULLET_SPEED = 7
ENEMY_SPAWN_RATE = 60  # Frames between enemy spawns

# Colors
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)
BLACK = (0, 0, 0)

class Player:
    def __init__(self, x, y, width, height, color):
        self.rect = pygame.Rect(x, y, width, height)
        self.color = color
        self.speed = PLAYER_SPEED
        self.bullets = []
    
    def move(self, keys):
        if keys[pygame.K_LEFT] and self.rect.x > 0:
            self.rect.x -= self.speed
        if keys[pygame.K_RIGHT] and self.rect.x < SCREEN_WIDTH - self.rect.width:
            self.rect.x += self.speed
        if keys[pygame.K_UP] and self.rect.y > 0:
            self.rect.y -= self.speed
        if keys[pygame.K_DOWN] and self.rect.y < SCREEN_HEIGHT - self.rect.height:
            self.rect.y += self.speed
    
    def shoot(self):
        bullet = pygame.Rect(
            self.rect.centerx - 2,
            self.rect.y - 10,
            5,
            10
        )
        self.bullets.append(bullet)
    
    def update_bullets(self):
        for bullet in self.bullets[:]:
            bullet.y -= BULLET_SPEED
            if bullet.y < 0:
                self.bullets.remove(bullet)
    
    def draw(self, screen):
        pygame.draw.rect(screen, self.color, self.rect)
        for bullet in self.bullets:
            pygame.draw.rect(screen, GREEN, bullet)

class Enemy:
    def __init__(self, x, y, width, height, color, speed):
        self.rect = pygame.Rect(x, y, width, height)
        self.color = color
        self.speed = speed  # ← speedを引数に by copilot
    
    def move(self):
        self.rect.y += self.speed
    
    def is_off_screen(self):
        return self.rect.y > SCREEN_HEIGHT
    
    def draw(self, screen):
        pygame.draw.rect(screen, self.color, self.rect)

#Composed with GitHub coding tools 

# 難易度設定
LEVELS = [
    {"name": "EASY", "enemy_min_speed": 2, "enemy_max_speed": 3},
    {"name": "NORMAL", "enemy_min_speed": 3, "enemy_max_speed": 5},
    {"name": "HARD", "enemy_min_speed": 5, "enemy_max_speed": 8},
]

def show_start_menu(screen, font):
    selected = 0
    while True:
        screen.fill(BLACK)
        title = font.render("Simple Shooting Game", True, WHITE)
        screen.blit(title, (SCREEN_WIDTH // 2 - title.get_width() // 2, 120))
        for i, level in enumerate(LEVELS):
            color = GREEN if i == selected else WHITE
            text = font.render(f"{i+1}. {level['name']}", True, color)
            screen.blit(text, (SCREEN_WIDTH // 2 - text.get_width() // 2, 250 + i * 60))
        info = font.render("↑↓で選択、Enterで決定", True, WHITE)
        screen.blit(info, (SCREEN_WIDTH // 2 - info.get_width() // 2, 450))
        pygame.display.flip()
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP:
                    selected = (selected - 1) % len(LEVELS)
                elif event.key == pygame.K_DOWN:
                    selected = (selected + 1) % len(LEVELS)
                elif event.key == pygame.K_RETURN or event.key == pygame.K_KP_ENTER:
                    return selected


#copilot started writting here 
class Game:
    def __init__(self, level_index):
        self.level_index = level_index  # ←レベル番号を保持
        self.level = LEVELS[level_index]
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Simple Shooting Game")
        self.clock = pygame.time.Clock()
        self.player = Player(SCREEN_WIDTH // 2 - 25, SCREEN_HEIGHT - 60, 50, 30, BLUE)
        self.enemies = []
        self.score = 0
        self.frame_count = 0
        self.font = pygame.font.SysFont(None, 36)
        self.running = True
        self.game_over = False
        self.try_again_rect = None  # Try Againボタンの矩形
    
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            elif event.type == pygame.KEYDOWN:
                if not self.game_over:
                    if event.key == pygame.K_SPACE:
                        self.player.shoot()
                    elif event.key == pygame.K_ESCAPE:
                        self.running = False
                else:
                    if event.key == pygame.K_ESCAPE:
                        self.running = False
                    elif event.key == pygame.K_RETURN or event.key == pygame.K_KP_ENTER:
                        self.restart()
            elif event.type == pygame.MOUSEBUTTONDOWN and self.game_over:
                if self.try_again_rect and self.try_again_rect.collidepoint(event.pos):
                    self.restart()

    
    def restart(self):
        # ゲーム状態を初期化
        self.level = LEVELS[self.level_index]
        self.player = Player(SCREEN_WIDTH // 2 - 25, SCREEN_HEIGHT - 60, 50, 30, BLUE)
        self.enemies = []
        self.score = 0
        self.frame_count = 0
        self.game_over = False


    def spawn_enemy(self):
        if self.frame_count % ENEMY_SPAWN_RATE == 0:
            x = random.randint(0, SCREEN_WIDTH - 30)
            speed = random.randint(self.level["enemy_min_speed"], self.level["enemy_max_speed"])
            enemy = Enemy(x, 0, 30, 30, RED, speed)
            self.enemies.append(enemy)
    
    def update(self):
        if self.game_over:
            return

        keys = pygame.key.get_pressed()
        self.player.move(keys)
        self.player.update_bullets()
        
        self.spawn_enemy()
        
        # Update enemies
        for enemy in self.enemies[:]:
            enemy.move()
            if enemy.is_off_screen():
                self.enemies.remove(enemy)
        
        # Check for bullet collisions with enemies
        for bullet in self.player.bullets[:]:
            for enemy in self.enemies[:]:
                if bullet.colliderect(enemy.rect):
                    self.player.bullets.remove(bullet)
                    self.enemies.remove(enemy)
                    self.score += 10
                    break
        
        # Check for player collision with enemies
        for enemy in self.enemies[:]:
            if self.player.rect.colliderect(enemy.rect):
                self.game_over = True
                break
        
        self.frame_count += 1
    
    def draw(self):
        self.screen.fill(BLACK)

        if self.game_over:
            game_over_text = self.font.render("GAME OVER", True, RED)
            score_text = self.font.render(f"Final Score: {self.score}", True, WHITE)
            self.screen.blit(game_over_text, (
                SCREEN_WIDTH // 2 - game_over_text.get_width() // 2,
                SCREEN_HEIGHT // 2 - game_over_text.get_height() // 2 - 30
            ))
            self.screen.blit(score_text, (
                SCREEN_WIDTH // 2 - score_text.get_width() // 2,
                SCREEN_HEIGHT // 2 - score_text.get_height() // 2 + 30
            ))
            # Try Againボタン
            button_text = self.font.render("Try Again", True, WHITE)
            button_width = button_text.get_width() + 40
            button_height = button_text.get_height() + 20
            button_x = SCREEN_WIDTH // 2 - button_width // 2
            button_y = SCREEN_HEIGHT // 2 + 40
            self.try_again_rect = pygame.Rect(button_x, button_y, button_width, button_height)
            pygame.draw.rect(self.screen, GREEN, self.try_again_rect)
            self.screen.blit(button_text, (
                button_x + (button_width - button_text.get_width()) // 2,
                button_y + (button_height - button_text.get_height()) // 2
            ))
        else:
            self.player.draw(self.screen)
            for enemy in self.enemies:
                enemy.draw(self.screen)
                # Draw score
            score_text = self.font.render(f"Score: {self.score}", True, WHITE)
            self.screen.blit(score_text, (10, 10))
        pygame.display.flip()
    
    def run(self):
        while self.running:
            self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(60)
        
        pygame.quit()
        sys.exit()
# ...existing code...
#copilot stopped writing here




# ...existing code...
# Main entry point
if __name__ == "__main__":
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    font = pygame.font.SysFont(None, 48)
    level_index = show_start_menu(screen, font)
    game = Game(level_index)
    game.run()