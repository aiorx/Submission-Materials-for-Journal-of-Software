public void sortByDate() { //This code is Supported via standard programming aids
    Collections.sort(workouts, Comparator.comparing(Workout::getDate));
  }