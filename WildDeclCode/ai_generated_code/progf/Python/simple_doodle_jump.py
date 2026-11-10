#Crafted with standard coding tools
import pygame
import random
import time

# 初始化 Pygame
pygame.init()

# 设置游戏窗口尺寸
screen_width = 400
screen_height = 600
screen = pygame.display.set_mode((screen_width, screen_height))

# 加载图像
doodler_image = pygame.image.load('images/doodler.png').convert_alpha()
platform_image = pygame.image.load('images/platform.png').convert_alpha()
spring_image = pygame.image.load('images/spring.png').convert_alpha()
broken_platform_image = pygame.image.load('images/broken_platform.png').convert_alpha()

# 创建字体对象
font = pygame.font.SysFont('Arial', 24)

# 播放背景音乐
# pygame.mixer.music.load('bg_music.mp3')
# pygame.mixer.music.play(-1)

# 定义颜色
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# 创建角色类
class Doodler(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = doodler_image
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
        self.speed = 0
        self.gravity = 1

    def update(self):
        self.speed += self.gravity
        self.rect.y += self.speed

    def jump(self):
        self.speed = -15

# 创建平台类
class Platform(pygame.sprite.Sprite):
    def __init__(self, x, y, platform_type):
        super().__init__()
        if platform_type == 'normal':
            self.image = platform_image
        elif platform_type == 'spring':
            self.image = spring_image
        elif platform_type == 'broken':
            self.image = broken_platform_image
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y

    def update(self):
        pass

# 创建精灵组
all_sprites = pygame.sprite.Group()
platforms = pygame.sprite.Group()

# 创建角色
doodler = Doodler(200, 300)
all_sprites.add(doodler)

# 创建初始平台
platform = Platform(200, 500, 'normal')
all_sprites.add(platform)
platforms.add(platform)

# 游戏开始标志
game_started = False

# 游戏循环
score = 0
clock = pygame.time.Clock()
running = True
while running:
    clock.tick(60)  # 控制游戏帧率，避免过度消耗 CPU 资源

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
            pygame.quit()
            exit()
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if not game_started:
                game_started = True
                time.sleep(0.1)  # 强制休眠一小段时间

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        doodler.rect.x -= 5
    if keys[pygame.K_RIGHT]:
        doodler.rect.x += 5

    if game_started:
        if doodler.speed >= 0:
            doodler.jump()

        if len(platforms) < 10:
            x = random.randint(0, screen.get_width() - 50)
            y = platforms.sprites()[-1].rect.y - random.randint(75, 125)
            platform_type = 'normal'
            if random.randint(1, 100) > 90:
                platform_type = 'spring'
            elif random.randint(1, 100) > 95:
                platform_type = 'broken'
            platform = Platform(x, y, platform_type)
            platforms.add(platform)
            all_sprites.add(platform)

        all_sprites.update()
        hits = pygame.sprite.spritecollide(doodler, platforms, False)
        if hits and doodler.speed > 0:
            platform = hits[0]
            if platform.rect.bottom - doodler.rect.bottom < 10:
                doodler.jump()
                if platform.image == spring_image:
                    doodler.speed = -20
                elif platform.image == broken_platform_image:
                    platform.kill()
                else:
                    score += 10
                    platform.kill()

    screen.fill(WHITE)
    all_sprites.draw(screen)
    score_text = font.render('Score: {}'.format(score), True, BLACK)
    screen.blit(score_text, (10, 10))
    if not game_started:
        start_text = font.render('Click anywhere to start', True, BLACK)
        screen.blit(start_text, (90, 250))
    pygame.display.flip()

# 退出 Pygame
pygame.quit()
