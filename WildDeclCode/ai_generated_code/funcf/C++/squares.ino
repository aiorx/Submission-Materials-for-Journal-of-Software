void loop() {
  uint32_t colors[] = {pixels.Color(255, 0, 0), pixels.Color(0, 255, 0), pixels.Color(0, 0, 255), pixels.Color(255, 255, 0)}; // Red, Green, Blue, Yellow
  int colorIndex = 0;

  // The starting point is to illuminate the central 2x2 square, which is slightly offset from the exact center.
  for(int layer = 0; layer < 4; layer++) { // There can be up to 4 layers in an 8x8 matrix starting from the center
    drawLayer(layer, colors[colorIndex % 4]); // Draw layer with the current color
    pixels.show(); // Update the display
    delay(250); // Wait for half a second
    clearPixels(); // Clear the matrix before drawing the next layer
    colorIndex++; // Move to the next color
  }
}