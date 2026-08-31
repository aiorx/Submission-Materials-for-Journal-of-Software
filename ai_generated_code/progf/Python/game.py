import pygame
import random
import sys
from schoolbot import SchoolBotFSM
from random import randint
# Assisted with basic coding tools edited and modified by me
# Initialize Pygame
pygame.init()
# Constants
WIDTH, HEIGHT = 800, 600
FPS = 60
# Colors
WHITE = (255, 255, 255)
# Classes
class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((30, 30))
        self.image.fill((0, 0, 0))
        self.rect = self.image.get_rect()
class SchoolBot(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((30, 30))
        self.image.fill((0, 0, 0))
        self.rect = self.image.get_rect()
        self.rect.topleft = (x, y)
class Classroom(pygame.sprite.Sprite):
    def __init__(self, image_file, x, y):
        super().__init__()
        self.image = pygame.image.load(image_file)
        self.rect = self.image.get_rect()
        self.rect.topleft = (x, y)
# Game initialization
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("School Maze Game")
clock = pygame.time.Clock()
# Load background image
background_image = pygame.image.load("background.jpg")  
# Replace "background.jpg" with your actual background image file
background_rect = background_image.get_rect()
all_sprites = pygame.sprite.Group()
classrooms = pygame.sprite.Group()

classroom_info = [
    {"image": "math.jpg", "position": (50, 50)},
    {"image": "history.jpg", "position": (200, 150)},
    {"image": "science.jpg", "position": (400, 300)},
]
# Randomize the correct classroom
correct_classroom = random.choice(classroom_info)
# Create classrooms and player
for info in classroom_info:
    classroom = Classroom(info["image"], *info["position"])
    classrooms.add(classroom)
    all_sprites.add(classroom)
player = Player()
schoolbot = SchoolBot(200,400)
school_bot_fsm = SchoolBotFSM(WIDTH,HEIGHT)
all_sprites.add(player)
all_sprites.add(schoolbot)
# Ensure the player does not spawn on a classroom
while True:
    player.rect.center = (random.randint(0, WIDTH - 30), random.randint(0, HEIGHT - 30))
    collisions = pygame.sprite.spritecollide(player, classrooms, False)
    if not collisions:
        break
# Timer initialization
start_time = pygame.time.get_ticks()
# Game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    # Player movement
    keys = pygame.key.get_pressed()
    player_speed = 5
    if keys[pygame.K_LEFT]:
        player.rect.x -= player_speed
    if keys[pygame.K_RIGHT]:
        player.rect.x += player_speed
    if keys[pygame.K_UP]:
        player.rect.y -= player_speed
    if keys[pygame.K_DOWN]:
        player.rect.y += player_speed
    school_bot_fsm.process("moving_to_class")
    schoolbot.rect.x = school_bot_fsm.school_bot_position[0]
    schoolbot.rect.y = school_bot_fsm.school_bot_position[1]
    # Check if the School Bot is in the correct class
    correct_class_rect = classrooms.sprites()[classroom_info.index(correct_classroom)].rect
    if (school_bot_fsm.school_bot_position[0] < correct_class_rect.right and
        school_bot_fsm.school_bot_position[0] + 30 > correct_class_rect.left and
        school_bot_fsm.school_bot_position[1] < correct_class_rect.bottom and
        school_bot_fsm.school_bot_position[1] + 30 > correct_class_rect.top):
        school_bot_fsm.process("found_correct_class")
        end_time = pygame.time.get_ticks()
        elapsed_time = (end_time - start_time) / 1000  
        # Convert milliseconds to seconds
        print(f"Congratulations! You found the correct classroom in {elapsed_time:.2f} seconds.")
        running = False
    # Check if the player is in the correct classroom
    if player.rect.colliderect(classrooms.sprites()[classroom_info.index(correct_classroom)].rect):
        end_time = pygame.time.get_ticks()
        elapsed_time = (end_time - start_time) / 1000  
        # Convert milliseconds to seconds
        print(f"Congratulations! You found the correct classroom in {elapsed_time:.2f} seconds.")
        running = False
    # Draw everything
    screen.blit(background_image, background_rect)
    all_sprites.draw(screen)
    pygame.display.flip()
    # Cap the frame rate
    clock.tick(FPS)
pygame.quit()
sys.exit()
