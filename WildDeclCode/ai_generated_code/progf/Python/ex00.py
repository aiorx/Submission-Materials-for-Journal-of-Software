# below Supported via standard GitHub programming aids, 2025-05-17, in response to this query:
# can you please suggest pygame zero code that draws a 100x100 pixel 
# circle (preferably antialiased), and allows it to be "flicked" 
# about the screen, such that it slows after release, as if with friction?

import pgzrun
import pygame
import math

WIDTH = 800
HEIGHT = 600

# Circle properties
circle_pos = [WIDTH // 2, HEIGHT // 2]
circle_radius = 50
circle_color = (255, 100, 100)
velocity = [0, 0]
dragging = False
last_mouse_pos = None
friction = 0.98  # Friction coefficient

def draw():
    screen.clear()
    # Draw antialiased circle using pygame's surface
    surf = pygame.Surface((100, 100), pygame.SRCALPHA)
    pygame.draw.circle(surf, circle_color, (50, 50), circle_radius, 0)
    screen.blit(surf, (circle_pos[0] - 50, circle_pos[1] - 50))

def update():
    global circle_pos, velocity, dragging

    if not dragging:
        # Apply velocity
        circle_pos[0] += velocity[0]
        circle_pos[1] += velocity[1]

        # Apply friction
        velocity[0] *= friction
        velocity[1] *= friction

        # Bounce off walls
        if circle_pos[0] - circle_radius < 0 or circle_pos[0] + circle_radius > WIDTH:
            velocity[0] *= -1
        if circle_pos[1] - circle_radius < 0 or circle_pos[1] + circle_radius > HEIGHT:
            velocity[1] *= -1

        # Clamp position inside screen
        circle_pos[0] = max(circle_radius, min(WIDTH - circle_radius, circle_pos[0]))
        circle_pos[1] = max(circle_radius, min(HEIGHT - circle_radius, circle_pos[1]))

def on_mouse_down(pos):
    global dragging, last_mouse_pos
    dx = pos[0] - circle_pos[0]
    dy = pos[1] - circle_pos[1]
    if math.hypot(dx, dy) <= circle_radius:
        dragging = True
        last_mouse_pos = pos

def on_mouse_up(pos):
    global dragging, velocity, last_mouse_pos
    if dragging and last_mouse_pos:
        velocity = [pos[0] - last_mouse_pos[0], pos[1] - last_mouse_pos[1]]
    dragging = False
    last_mouse_pos = None

def on_mouse_move(pos):
    global circle_pos, last_mouse_pos
    if dragging:
        dx = pos[0] - last_mouse_pos[0]
        dy = pos[1] - last_mouse_pos[1]
        circle_pos[0] += dx
        circle_pos[1] += dy
        last_mouse_pos = pos

pgzrun.go()

