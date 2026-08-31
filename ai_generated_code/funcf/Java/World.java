```java
// @source This code was refined by ChatGPT. It generates rooms
// and connects them through hallways.
private void generateRoomsAndHallways() {
    int numberOfRooms = RandomUtils.uniform(random, 90, 100);

    int lastRoomCenterX = -1;
    int lastRoomCenterY = -1;

    for (int i = 0; i < numberOfRooms; i++) {
        int roomWidth = RandomUtils.uniform(random, 3, 10);
        int roomHeight = RandomUtils.uniform(random, 3, 10);
        int roomX = RandomUtils.uniform(random, 1, WIDTH - roomWidth - 2);
        int roomY = RandomUtils.uniform(random, 1, HEIGHT - roomHeight - 2);

        if (canPlaceRoom(roomX, roomY, roomWidth, roomHeight)) {
            for (int x = roomX; x < roomX + roomWidth; x++) {
                for (int y = roomY; y < roomY + roomHeight; y++) {
                    world[x][y] = Tileset.FLOOR;
                }
            }
            int currentRoomCenterX = roomX + roomWidth / 2;
            int currentRoomCenterY = roomY + roomHeight / 2;

            if (lastRoomCenterX != -1 && lastRoomCenterY != -1) {
                connectRooms(lastRoomCenterX, lastRoomCenterY, currentRoomCenterX, currentRoomCenterY);
            }

            lastRoomCenterX = currentRoomCenterX;
            lastRoomCenterY = currentRoomCenterY;
        }
    }
}
```

```java
// @source This code was Assisted with basic coding tools. It contains
// logic to place the key  far away from the avatar.
public void placeKey() {
    if (avatar == null) {
        return;
    }
    int avatarX = avatar.getX();
    int avatarY = avatar.getY();
    double maxDistance = -1;
    int keyX = -1;
    int keyY = -1;

    for (int x = 0; x < WIDTH; x++) {
        for (int y = 0; y < HEIGHT; y++) {
            if (world[x][y].equals(Tileset.FLOOR)) {
                double distance = Math.sqrt(Math.pow(x - avatarX, 2) + Math.pow(y - avatarY, 2));
                if (distance > maxDistance) {
                    maxDistance = distance;
                    keyX = x;
                    keyY = y;
                }
            }
        }
    }

    if (keyX != -1 && keyY != -1) {
        world[keyX][keyY] = Tileset.KEY;
    }
    keyPos[0] = keyX;
    keyPos[1] = keyY;
}
```