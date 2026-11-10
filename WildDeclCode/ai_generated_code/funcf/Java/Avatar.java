```java
public void move(Direction direction, TETile[][] world) {
    int newX = x;
    int newY = y;

    // @source This code was Assisted with basic coding tools. It contains the cases for
    // the Avatar moving up, down, left, or right.
    switch (direction) {
        case UP:
            newY += 1;
            break;
        case DOWN:
            newY -= 1;
            break;
        case LEFT:
            newX -= 1;
            break;
        case RIGHT:
            newX += 1;
            break;
        default:
            break;
    }

    if (canMoveTo(newX, newY, world)) {
        TETile currentTile = world[newX][newY];
        interactWithTile(world[newX][newY]);
        updatePosition(newX, newY, world);
        gameEngine.updateHUD(currentTile.description());
    }
}
```