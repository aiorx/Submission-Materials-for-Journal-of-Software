# Formed using common development resources

import pygame
import sys

# Initialize pygame
pygame.init()

# Set up display
WIDTH, HEIGHT = 800, 600
WIN = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pongy")

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
PINK = (255, 105, 180)

# Game settings
PADDLE_WIDTH, PADDLE_HEIGHT = 10, 100
BALL_RADIUS = 7
PADDLE_SPEED = 5
BALL_SPEED_X, BALL_SPEED_Y = 4, 4

# Game objects
left_paddle = pygame.Rect(10, HEIGHT//2 - PADDLE_HEIGHT//2, PADDLE_WIDTH, PADDLE_HEIGHT)
right_paddle = pygame.Rect(WIDTH - 20, HEIGHT//2 - PADDLE_HEIGHT//2, PADDLE_WIDTH, PADDLE_HEIGHT)
ball = pygame.Rect(WIDTH//2, HEIGHT//2, BALL_RADIUS*2, BALL_RADIUS*2)

clock = pygame.time.Clock()

def draw():
    WIN.fill(BLACK)
    pygame.draw.rect(WIN, WHITE, left_paddle)
    pygame.draw.rect(WIN, WHITE, right_paddle)
    pygame.draw.ellipse(WIN, PINK, ball)
    pygame.draw.aaline(WIN, WHITE, (WIDTH // 2, 0), (WIDTH // 2, HEIGHT))
    pygame.display.flip()

def move_paddles(keys):
    if keys[pygame.K_w] and left_paddle.top > 0:
        left_paddle.y -= PADDLE_SPEED
    if keys[pygame.K_s] and left_paddle.bottom < HEIGHT:
        left_paddle.y += PADDLE_SPEED
    # if keys[pygame.K_UP] and right_paddle.top > 0:
    #     right_paddle.y -= PADDLE_SPEED
    # if keys[pygame.K_DOWN] and right_paddle.bottom < HEIGHT:
    #     right_paddle.y += PADDLE_SPEED

def move_ball():
    global BALL_SPEED_X, BALL_SPEED_Y

    ball.x += BALL_SPEED_X
    ball.y += BALL_SPEED_Y

    if ball.top <= 0 or ball.bottom >= HEIGHT:
        BALL_SPEED_Y *= -1

    if ball.colliderect(left_paddle) or ball.colliderect(right_paddle):
        BALL_SPEED_X *= -1

    if ball.left <= 0 or ball.right >= WIDTH:
        #pygame.time.delay(2000) # Pause for 2 seconds
        show_countdown(3)  # Show countdown for 3 seconds
        ball.center = (WIDTH//2, HEIGHT//2)
        BALL_SPEED_X *= -1

def move_ai():
    AI_SPEED = 1
    diff = ball.centery - right_paddle.centery
    right_paddle.y += min(max(diff, -AI_SPEED), AI_SPEED)
    # if right_paddle.centery < ball.centery:
    #     right_paddle.y += PADDLE_SPEED
    # elif right_paddle.centery > ball.centery:
    #     right_paddle.y -= PADDLE_SPEED

def show_countdown(seconds):
    font = pygame.font.Font(None, 100)
    for i in range(seconds, 0, -1):
        WIN.fill(BLACK)
        countdown_text = font.render('Zosia ' + str(i), True, WHITE)
        text_rect = countdown_text.get_rect(center=(WIDTH // 2, HEIGHT // 2))
        WIN.blit(countdown_text, text_rect)
        pygame.display.flip()
        pygame.time.delay(1000)  # wait 1 second


# Game loop
while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    keys = pygame.key.get_pressed()
    move_paddles(keys)
    move_ai()
    move_ball()
    draw()
    clock.tick(60)
