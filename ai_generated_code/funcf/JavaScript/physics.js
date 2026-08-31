// Following method is mostly Composed with GitHub coding tools
  // Method to move the game object and check for collisions.
  moveAndCheckCollision(axis) {
    // keep tack of the old position of the game object so it can be moved back in case of collision.
    let oldPosition = this.gameObject[axis];
    // get all the platforms in the game.
    const platforms = this.gameObject.game.gameObjects.filter((obj) => obj instanceof Platform);
    this.isOnPlatform = false;
    // move the game object one axis position at a time, for a number of times qual to velocity and check for collisions.
    for(let i = 0; i < Math.abs(this.velocity[axis]); i++) {
      // increase or decrease posiotion by one depending on direction.
      this.gameObject[axis] += Math.sign(this.velocity[axis]);
      // check for collisions with all the platforms.
      for(const platform of platforms) {
        const physics = platform.getComponent(Physics);
        // if there is collsion set the character back to their old position.
        if(physics.isColliding(this)) {
          this.gameObject[axis] = oldPosition;
          // stop velocity on this axis if there was collsiion
          this.velocity[axis] = 0;
          // if the axis is y and the velocity is positive, the player is on a platform.
          if(axis === 'y' && this.velocity[axis] >= 0) {
            const playerBottom = this.gameObject.y + this.gameObject.getComponent(Renderer).height;
            const platformTop = platform.y;
            if(playerBottom <= platformTop) {
              this.isOnPlatform = true;
            }
          }
          // stop the loop after a collision is detected.
          break;
        }
      }
      // update the old position for next loop.
      oldPosition = this.gameObject[axis];
    }
  }