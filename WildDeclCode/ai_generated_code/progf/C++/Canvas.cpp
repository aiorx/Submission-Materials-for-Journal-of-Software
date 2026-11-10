#include "Canvas.h"
#include "Tuple.h"
#include <algorithm>
#include <cassert>
#include <fstream>
#include <iomanip>
#include <iostream>

Canvas::Canvas(int width, int height)
    : pixelArray(height, std::vector<Tuple>(width, Tuple::Colour(0, 0, 0)))
{
  this->width = width;
  this->height = height;
}

Tuple Canvas::getPixel(int x, int y) const { return pixelArray[y][x]; }

void Canvas::writePixel(int x, int y, class Tuple colour)
{
  // ignore out of bounds writes
  if (y < 0 || y >= height || x < 0 || x >= width) {
    std::cout << "ERROR: Out of bounds writePixel attempt at (" << x << ", "
              << y << ")" << std::endl;
    return;
  }
  pixelArray[y][x] = colour;
}

void Canvas::exportColours(Tuple pixel)
{
  // this is bad, but it works! (thanks copilot LMAO)
  // probably refactor pixel members to be an array

  std::string red = std::to_string(
      std::clamp(int(pixel.getRed() * MAX_COLOUR_VALUE), 0, MAX_COLOUR_VALUE));
  charCount += red.length();
  if (charCount > MAX_CHAR_COUNT) {
    outstream << "\n";
    charCount = 0;
  }
  outstream << std::fixed << std::setprecision(1) << red << " ";

  std::string green = std::to_string(std::clamp(
      int(pixel.getGreen() * MAX_COLOUR_VALUE), 0, MAX_COLOUR_VALUE));
  charCount += green.length();
  if (charCount > MAX_CHAR_COUNT) {
    outstream << "\n";
    charCount = 0;
  }
  outstream << std::fixed << std::setprecision(1) << green << " ";

  std::string blue = std::to_string(
      std::clamp(int(pixel.getBlue() * MAX_COLOUR_VALUE), 0, MAX_COLOUR_VALUE));
  charCount += blue.length();
  if (charCount > MAX_CHAR_COUNT) {
    outstream << "\n";
    charCount = 0;
  }
  outstream << std::fixed << std::setprecision(1) << blue << " ";
}

void Canvas::exportCanvas(std::ofstream &outfile)
{
  // PPM Header
  outstream << "P3\n" // PPM Type ID
            << width << " " << height << "\n"
            << MAX_COLOUR_VALUE << std::endl;

  // Pixel Data
  outstream << "\n";
  for (auto &row : pixelArray) {
    for (auto &p : row) {
      exportColours(p);
    }
  }
  // Newline Footer
  outstream << std::endl;

  // Write to file
  outfile << outstream.str();
}
