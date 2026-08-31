# Reference: This code was mostly Composed with basic coding tools, but it was modified to match the requirements.

import pygame
import sys

# Initialize Pygame
pygame.init()

# Set up the screen
WIDTH, HEIGHT = 1000, 500
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pygame GUI")

# Define colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GRAY = (200, 200, 200)
BLUE = (0, 0, 255)

# Define fonts
font = pygame.font.SysFont(None, 30)

# Define Button class
class Button:
    # def __init__(self, x, y, width, height, color, text, action=None):
    #     self.rect = pygame.Rect(x, y, width, height)
    #     self.color = color
    #     self.text = text
    #     self.action = action

    def __init__(self, x, y, width, height, color, text, image_path=None, action=None):
        self.rect = pygame.Rect(x, y, width, height)
        self.color = color
        self.text = text
        self.action = action
        self.image = None
        if image_path:
            self.image = pygame.image.load(image_path)
            # Scale the image to fit the button
            self.image = pygame.transform.scale(self.image, (width, height))

    # def draw(self, screen):
    #     pygame.draw.rect(screen, self.color, self.rect)
    #     text_surface = font.render(self.text, True, BLACK)
    #     text_rect = text_surface.get_rect(center=self.rect.center)
    #     screen.blit(text_surface, text_rect)
        
    def draw(self, screen):
        pygame.draw.rect(screen, self.color, self.rect)
        if self.image:
            screen.blit(self.image, self.rect.topleft)  # Draw image at button's top-left corner
        else:
            text_surface = font.render(self.text, True, BLACK)
            text_rect = text_surface.get_rect(center=self.rect.center)
            screen.blit(text_surface, text_rect)

    def clicked(self):
        if self.action:
            self.action()

# Define actions for buttons
def action1():
    print("Moved up")

def action2():
    print("Turned on/off")

def action3():
    print("Moved right")

def action4():
    print("Moved left")

def action5():
    print("Moved down")

def action6():
    print("Emergency stop activated")

# Create buttons
button_width, button_height = 100, 50
button_spacing = 20
button_x = (WIDTH - button_width) / 2
button_y = (HEIGHT - (button_height + button_spacing) * 2) / 2  # Center vertically with spacing
upButton = Button(button_x, button_y, button_width, button_height, WHITE, "Up Button", "button_image1.png",  action1)

button_y += button_height + button_spacing
onOffButton = Button(button_x, button_y, button_width, button_height, WHITE, "On/off Button", "button_image2.png", action2)

button_x += (WIDTH - button_width)/8 + 5
rightButton = Button(button_x, button_y, button_width, button_height, WHITE, "Right Button", "button_image3.png", action3)

button_x = (WIDTH - button_width)/4 + 110
leftButton = Button(button_x, button_y, button_width, button_height, WHITE, "Left Button", "button_image4.png", action4)

button_x = (WIDTH - button_width) / 2
button_y += button_height + button_spacing
downButton = Button(button_x, button_y, button_width, button_height, WHITE, "Down Button", "button_image5.png", action5)

# Need to add the emergency stop button on the top left/right or bottom left/right
button_x = WIDTH - button_width - 120 # 10 pixels padding from right edge
button_y = 20  # 10 pixels padding from top edge
# Image reference: https://www.freepik.com/premium-vector/red-warning-emergency-stop-button-brake-danger-alert-sign-isolated-symbol-vector-illustration_94491546.htm
emergencyStopButton = Button(button_x, button_y, button_width*2, button_height*2, WHITE, "Emergency Stop Button", "button_image6.png", action6)

# Main loop
running = True
while running:
    # Handle events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:
                for button in [upButton, onOffButton, rightButton, leftButton, downButton, emergencyStopButton]:
                    if button.rect.collidepoint(event.pos):
                        button.clicked()

    # Clear the screen
    screen.fill(BLACK)

    # Draw buttons
    upButton.draw(screen)
    onOffButton.draw(screen)
    rightButton.draw(screen)
    leftButton.draw(screen)
    downButton.draw(screen)
    emergencyStopButton.draw(screen)

    # Update the display
    pygame.display.flip()

# Quit Pygame
pygame.quit()
sys.exit()
