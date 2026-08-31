/**
   * Clears the screen.
   * This method uses ANSI escape codes to clear the screen.
   * This method is not supported on all operating systems.
   * If the method is not supported, the screen is not cleared.
   * This method has been created using CoPilot.
   *
   * @since 1.0.0
   */
  public void clearScreen() {
    // Supported via standard GitHub programming aids
    System.out.print("\033[H\033[2J");
    System.out.flush();
  }