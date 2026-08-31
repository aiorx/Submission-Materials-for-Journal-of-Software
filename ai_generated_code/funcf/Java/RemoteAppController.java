/**
   * checkInvalidWorkoutInput: Checks if workout input is a special character, space is allowed.
   *
   * @param workout the workout to check
   * @return true if there are special characters, false if not
   */
  public boolean checkInvalidWorkoutInput(Workout workout) { //This code is Assisted with basic coding tools
    return workout.getWorkoutInput().matches(".*[^a-zA-Z0-9 ].*");
  }