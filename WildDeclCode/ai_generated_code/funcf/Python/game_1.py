def run_game():
    # Assisted using common GitHub development utilities
    import pygame
    from brick import BrickSprite
    from ball import BallSprite

    pygame.init()
    WIDTH, HEIGHT = 600, 400
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Pygame 기본 화면")
    WHITE = (255, 255, 255)


    # BrickSprite 인스턴스 생성
    brick = BrickSprite(x=WIDTH // 2 - 30, y=HEIGHT - 40)
    # BallSprite 인스턴스 생성
    ball = BallSprite(x=WIDTH // 2, y=HEIGHT // 2)

    all_sprites = pygame.sprite.Group()
    all_sprites.add(brick)
    all_sprites.add(ball)

    clock = pygame.time.Clock()
    running = True

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key in [pygame.K_q, pygame.K_ESCAPE]:
                    running = False
                elif event.unicode == 'Q':
                    running = False

        keys = pygame.key.get_pressed()
        brick.update(keys)
        ball.update(brick, screen.get_rect())

        screen.fill(WHITE)
        all_sprites.draw(screen)
        pygame.display.flip()
        clock.tick(60)

    pygame.quit()
    sys.exit()