protected void updateVectors(Vector force, ArrayList<Body> bodies) {
    /*
    Math.Vector newPosition = position.add(velocity().scale(Math.Constants.TIME_STEP / Math.Constants.DISTANCE_CONSTANT)).add(acceleration().scale(Math.pow(Math.Constants.TIME_STEP, 2) / (2 * Math.Constants.DISTANCE_CONSTANT)));

    System.out.println(newPosition);

    Math.Vector newAcceleration = force.scale(1 / massScaled());

    Math.Vector newVelocity = velocity.add(acceleration().add(newAcceleration).scale(Math.Constants.TIME_STEP / 2));


    acceleration = newAcceleration;
    velocity = newVelocity;
    position = newPosition;

     */

    // UPDATED SIMULATION WITH VERLET (thanks ChatGPT) (better accuracy, very little to no long term drift)

    Vector oldAcceleration = acceleration;

    // Update velocity (half step)
    velocity = velocity.add(oldAcceleration.scale(Constants.TIME_STEP / 2));

    // Update position
    position = position.add(velocity.scale(Constants.TIME_STEP / Constants.DISTANCE_CONSTANT));

    // Recompute acceleration using new position (requires calling netForce again)
    Vector newForce = netForce(bodies); // You'll need to pass the body list again
    Vector newAcceleration = newForce.scale(1 / massScaled());

    // Update velocity (second half step)
    velocity = velocity.add(newAcceleration.scale(Constants.TIME_STEP / 2));

    acceleration = newAcceleration;
}