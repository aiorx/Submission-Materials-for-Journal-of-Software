public void moveForward(int steps) {

    // AI was used here for not letting the robot go out of the grid. No prompts were written, it was automatically Aided via basic GitHub coding utilities.
    if (direction == Direction.NORTH && y + steps >= floor.getSize()) {
        steps = floor.getSize() - y - 1;
    } else if (direction == Direction.EAST && x + steps >= floor.getSize()) {
        steps = floor.getSize() - x - 1;
    } else if (direction == Direction.SOUTH && y - steps < 0) {
        steps = y;
    } else if (direction == Direction.WEST && x - steps < 0) {
        steps = x;
    }

    for (int i = 0; i < steps; i++) {
        if (penDown) {
            floor.markPosition(x, y);
        }
        switch (direction) {
            case NORTH:
                if (y + 1 < floor.getSize()) y++;
                break;
            case EAST:
                if (x + 1 < floor.getSize()) x++;
                break;
            case SOUTH:
                if (y - 1 >= 0) y--;
                break;
            case WEST:
                if (x - 1 >= 0) x--;
                break;
        }
    }
    if (penDown) {
        floor.markPosition(x, y);
    }
}