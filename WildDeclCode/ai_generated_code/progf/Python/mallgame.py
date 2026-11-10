"""
ATCS Final Project
By Jackson Deutch
With assistance from CHATGPT
Dec 16, 2023
"""

import pygame
import sys
import random

class FSM:
    def __init__(self, initial_state):
        self.state_transitions = {}
        self.current_state = initial_state

    def add_transition(self, input_symbol, state, action=None, next_state=None):
        if next_state is not None:
            self.state_transitions[(input_symbol, state)] = (action, next_state)

    def get_transition(self, input_symbol, state):
        return self.state_transitions.get((input_symbol, state), (None, None))

    def process(self, input_symbol):
        action, next_state = self.get_transition(input_symbol, self.current_state)
        if action is not None:
            action()
        if next_state is not None:
            self.current_state = next_state

# Basic development code blocks
class Player:
    def __init__(self, x, y, size):
        self.rect = pygame.Rect(x, y, size, size)

# Student and AI-generated
class Enemy:
    HIDDEN, SHOWING = "h", "s"

    def __init__(self, x, y, size, speed):
        self.rect = pygame.Rect(x, y, size, size)
        self.fsm = FSM(initial_state=self.HIDDEN)
        self.init_fsm()

    def init_fsm(self):
        def show_enemy():
            self.rect.x = random.randint(0, width - obstacle_size)
            self.rect.y = random.randint(0, height - obstacle_size)

        def next_level():
            self.fsm.current_state = self.HIDDEN

        self.fsm.add_transition("level_over", self.SHOWING, next_level)
        self.fsm.add_transition("new_level_start", self.HIDDEN, show_enemy, self.SHOWING)

# Initialize Pygame
pygame.init()

# Set up display
width, height = 800, 600
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Mall Game")

# Load and resize the image for the background
background_image = pygame.image.load("mall.png")
background_image = pygame.transform.scale(background_image, (width, height))

# Colors
white = (255, 255, 255)
red = (255, 0, 0)

# AI GENERATED CODE BELOW

# Player variables
player_pos = [0, 0]  # User starts in the top-left corner

# Load and resize the image for the player (blue rectangle)
kid_image = pygame.image.load("kid.png")
kid_size = 50  # Change the size to make the image bigger
kid_image = pygame.transform.scale(kid_image, (kid_size, kid_size))

# Create player object
player = Player(player_pos[0], player_pos[1], kid_size)

# Load and resize the image for the parent
parent_image = pygame.image.load("parent.png")
parent_size = 60
parent_image = pygame.transform.scale(parent_image, (parent_size, parent_size))
parent_rect = parent_image.get_rect(center=(random.randint(0, width - parent_size), random.randint(0, height - parent_size)))

# Load and resize the image for obstacles
obstacle_image = pygame.image.load("man.png")
obstacle_size = 60
obstacle_image = pygame.transform.scale(obstacle_image, (obstacle_size, obstacle_size))

# Font for the "You Win!" and "Game Over" screens
font = pygame.font.Font(None, 36)
big_font = pygame.font.Font(None, 72)

# Game loop
clock = pygame.time.Clock()
win_screen_duration = 5000  # 5 seconds
win_screen_timer = 0
win = False

# Initialize levels
levels = [
    {"num_obstacles": 15, "num_enemies_random": 5, "num_enemies_left_to_right": 3, "enemy_speed_left_to_right": 2},
    {"num_obstacles": 20, "num_enemies_random": 10, "num_enemies_left_to_right": 5, "enemy_speed_left_to_right": 3},
    {"num_obstacles": 25, "num_enemies_random": 15, "num_enemies_left_to_right": 7, "enemy_speed_left_to_right": 4},
    {"num_obstacles": 30, "num_enemies_random": 20, "num_enemies_left_to_right": 10, "enemy_speed_left_to_right": 5},
    {"num_obstacles": 35, "num_enemies_random": 25, "num_enemies_left_to_right": 12, "enemy_speed_left_to_right": 6},
]

# Game loop
clock = pygame.time.Clock()
win_screen_duration = 5000  # 5 seconds
win_screen_timer = 0
win = False
current_level = 0

def setup_level(level):
    obstacles = []
    # Ensure no obstacle is placed in the top-left corner
    for _ in range(level["num_obstacles"]):
        obstacle_rect = pygame.Rect(random.randint(obstacle_size, width - obstacle_size), random.randint(obstacle_size, height - obstacle_size), obstacle_size, obstacle_size)
        obstacles.append(obstacle_rect)

    enemies_random = [Enemy(random.randint(0, width - obstacle_size), random.randint(0, height - obstacle_size), obstacle_size, [random.uniform(0.1, 0.5), random.uniform(0.1, 0.5)]) for _ in range(level["num_enemies_random"])]

    # Modify the initial positions and movements of left-to-right enemies
    enemies_left_to_right = [
        Enemy(-obstacle_size, random.randint(0, height - obstacle_size), obstacle_size, [level["enemy_speed_left_to_right"], 0]) for _ in range(level["num_enemies_left_to_right"] // 2)
    ] + [
        Enemy(width, random.randint(0, height - obstacle_size), obstacle_size, [-level["enemy_speed_left_to_right"], 0]) for _ in range(level["num_enemies_left_to_right"] // 2)
    ]

    return obstacles, enemies_random, enemies_left_to_right

obstacles, enemies_random, enemies_left_to_right = setup_level(levels[current_level])

# Parent visibility settings
parent_visible = True
parent_disappear_timer = pygame.time.get_ticks()
parent_disappear_duration = 3000  # 3 seconds
parent_appear_duration = 5000  # 5 seconds

# Variables for tracking time until parents found
start_time = pygame.time.get_ticks()
time_until_found = 0

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    keys = pygame.key.get_pressed()
    player_speed = 5

    # Player movement
    if keys[pygame.K_LEFT] and player.rect.left > 0:
        player.rect.x -= player_speed
    if keys[pygame.K_RIGHT] and player.rect.right < width:
        player.rect.x += player_speed
    if keys[pygame.K_UP] and player.rect.top > 0:
        player.rect.y -= player_speed
    if keys[pygame.K_DOWN] and player.rect.bottom < height:
        player.rect.y += player_speed

    # Process enemies
    for enemy in enemies_random:
        enemy.fsm.process('start_moving_event')

    for enemy in enemies_left_to_right:
        enemy.fsm.process('start_moving_event')

    # Check for collisions
    for obstacle in obstacles + [enemy.rect for enemy in enemies_random] + [enemy.rect for enemy in enemies_left_to_right]:
        if player.rect.colliderect(obstacle):
            # Display "Game Over" on a white screen with level information
            screen.fill(white)
            game_over_text = big_font.render("Game Over", True, red)
            game_over_rect = game_over_text.get_rect(center=(width // 2, height // 3))
            screen.blit(game_over_text, game_over_rect.topleft)

            # Calculate and display time until parents found
            time_until_found = (pygame.time.get_ticks() - start_time) // 1000
            time_text = font.render(f"Time until parents found: {time_until_found} seconds", True, red)
            time_rect = time_text.get_rect(center=(width // 2, height // 2))
            screen.blit(time_text, time_rect.topleft)

            level_text = font.render(f"Levels Passed: {current_level}", True, red)
            level_rect = level_text.get_rect(center=(width // 2, height // 1.5))
            screen.blit(level_text, level_rect.topleft)

            # Display "Thank you for playing Mall Game" in smaller black font
            thank_you_text = pygame.font.Font(None, 24).render("Thank you for playing Mall Game", True, (0, 0, 0))
            thank_you_rect = thank_you_text.get_rect(center=(width // 2, height // 1.2))
            screen.blit(thank_you_text, thank_you_rect.topleft)

            pygame.display.flip()

            # Wait for a brief period before quitting
            pygame.time.delay(5000)
            pygame.quit()
            sys.exit()

    # Check if the blue rectangle collides with the parent image
    if player.rect.colliderect(parent_rect) and parent_visible:
        win = True
        win_screen_timer = pygame.time.get_ticks()

        fsm_event = 'find_parents_event'
        for enemy in enemies_random:
            enemy.fsm.process(fsm_event)

        for enemy in enemies_left_to_right:
            enemy.fsm.process(fsm_event)

        # Move to the next level if all enemies are hidden
        if all(enemy.fsm.current_state == 'h' for enemy in enemies_random + enemies_left_to_right):
            current_level += 1
            if current_level < len(levels):
                obstacles, enemies_random, enemies_left_to_right = setup_level(levels[current_level])
                win = False
                parent_visible = True
                parent_rect.center = (random.randint(0, width - parent_size), random.randint(0, height - parent_size))
                player.rect.topleft = (0, 0)  # Reset player position to the top-left corner
                start_time = pygame.time.get_ticks()  # Reset time until parents found
            else:
                # Display "Game Over" on a white screen with level information
                screen.fill(white)
                game_over_text = big_font.render("Game Over", True, red)
                game_over_rect = game_over_text.get_rect(center=(width // 2, height // 3))
                screen.blit(game_over_text, game_over_rect.topleft)

                # Calculate and display time until parents found
                time_until_found = (pygame.time.get_ticks() - start_time) // 1000
                time_text = font.render(f"Time until parents found: {time_until_found} seconds", True, red)
                time_rect = time_text.get_rect(center=(width // 2, height // 2))
                screen.blit(time_text, time_rect.topleft)

                level_text = font.render(f"Levels Passed: {current_level}", True, red)
                level_rect = level_text.get_rect(center=(width // 2, height // 1.5))
                screen.blit(level_text, level_rect.topleft)

                # Display "Thank you for playing Mall Game" in smaller black font
                thank_you_text = pygame.font.Font(None, 24).render("Thank you for playing Mall Game", True, (0, 0, 0))
                thank_you_rect = thank_you_text.get_rect(center=(width // 2, height // 1.2))
                screen.blit(thank_you_text, thank_you_rect.topleft)

                pygame.display.flip()

                # Wait for a brief period before quitting
                pygame.time.delay(5000)
                pygame.quit()
                sys.exit()

    # Check if it's time to toggle the visibility of the parent image
    current_time = pygame.time.get_ticks()
    if not parent_visible and current_time - parent_disappear_timer >= parent_disappear_duration:
        parent_visible = True
        parent_rect.center = (random.randint(0, width - parent_size), random.randint(0, height - parent_size))
    elif parent_visible and current_time - parent_disappear_timer >= parent_appear_duration:
        parent_visible = False
        parent_disappear_timer = current_time

    # Draw the background image
    screen.blit(background_image, (0, 0))

    for obstacle in obstacles:
        screen.blit(obstacle_image, obstacle.topleft)
    # Display the parent image only if it's currently visible
    if parent_visible:
        screen.blit(parent_image, parent_rect.topleft)

    # Render the kid image instead of the blue rectangle
    screen.blit(kid_image, player.rect.topleft)

    for enemy in enemies_random + enemies_left_to_right:
        screen.blit(obstacle_image, enemy.rect.topleft)

    if win:
        win_time_elapsed = pygame.time.get_ticks() - win_screen_timer
        if win_time_elapsed < win_screen_duration:
            win_text = font.render("You Win!", True, red)
            win_rect = win_text.get_rect(center=(width // 2, height // 2))
            screen.blit(win_text, win_rect.topleft)

            fsm_event = 'next_level_event'
            for enemy in enemies_random:
                enemy.fsm.process(fsm_event)

            for enemy in enemies_left_to_right:
                enemy.fsm.process(fsm_event)

    pygame.display.flip()
    clock.tick(30)
