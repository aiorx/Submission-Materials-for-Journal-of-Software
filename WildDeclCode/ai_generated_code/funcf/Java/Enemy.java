private void move() { // Built via standard programming aids, tweaked by me
    float centerX = BaseGame.WORLD_WIDTH / 2 - getWidth() / 2;
    float centerY = 12.5f;

    float random_angle = MathUtils.random(0f, MathUtils.PI2);
    float random_radius = MathUtils.random(0.9f, 1.4f); // Random radius for movement
    float stretchFactorX = 2.7f; // Stretched along the x-axis (e.g., 1.5 means the ellipse is 1.5 times wider than the circle)

    // Convert polar to Cartesian coordinates
    float x = centerX + random_radius * stretchFactorX * MathUtils.cos(random_angle); // Apply stretch on x
    float y = centerY + random_radius * MathUtils.sin(random_angle); // Keep y as is, based on angle

    // Add some randomness to the final position
    float random_x = MathUtils.random(-0.5f, 0.5f);
    float random_y = MathUtils.random(-0.5f, 0.5f);

    // Apply random offsets
    x += random_x;
    y += random_y;

    // Random scale
    float scale = MathUtils.random(0.75f, 1.25f);

    // Random move duration
    float move_duration = MathUtils.random(0.2f, 1.0f);

    // Execute the action with the new position
    //removeAction(shoot_animation);
    addAction(Actions.parallel(
        Actions.moveTo(x, y, move_duration, Interpolation.circleOut)/*,
        Actions.scaleTo(scale, scale, move_duration, Interpolation.circleOut)*/
    ));
}