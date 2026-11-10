#ifndef IMAGE_H
#define IMAGE_H

#include "color.h"
#include <vector>
#include <fstream>

class Image {
    private:
        int width, height;
        double maxColorValue;
        std::vector<Color> pixels;
    public:
        Image() {};
        Image(int width, int height, std::vector<Color> pixels) : width(width), height(height), pixels(pixels), maxColorValue(255.999) {};
        Image(std::string filename) {
            //assuming a ppm image, which starts with P(something), followed by width and height, followed by max color value, followed by the pixels

            std::ifstream file;
            file.open(filename);

            std::string line;

            bool nextLineIsResolution = false;
            bool nextLineIsMaxValue = false;
            while (file) {
                std::getline(file, line);
                if (line[0] == 'P') {
                    nextLineIsResolution = true;
                    continue;
                }

                if (line[0] == '#') continue;

                if (nextLineIsResolution) {
                    nextLineIsResolution = false;
                    std::string widthStr = line.substr(0, line.find(' '));
                    std::string heightStr = line.substr(line.find(' ') + 1);

                    width = std::stoi(widthStr);
                    height = std::stoi(heightStr);
                    nextLineIsMaxValue = true;
                    continue;
                }

                if (nextLineIsMaxValue) {
                    nextLineIsMaxValue = false;
                    maxColorValue = std::stoi(line);
                    continue;
                }

                // if we get here, we're in the pixels section
            
                // the file is a list of numbers separated by varying amounts of whitespace and newlines, 
                // so read them all into a vector of ints
                // Supported via standard GitHub programming aids
                std::vector<int> pixelValues;
                std::string currentPixelValue = "";
                for (int i = 0; i < line.length(); i++) {
                    if (line[i] == ' ' || line[i] == '\n') {
                        if (currentPixelValue != "") {
                            pixelValues.push_back(std::stoi(currentPixelValue));
                            currentPixelValue = "";
                        }
                    } else {
                        currentPixelValue += line[i];
                    }
                }
                for (int j = 0; j < pixelValues.size(); j += 3) {
                    double r = pixelValues[j] / static_cast<double>(maxColorValue);
                    double g = pixelValues[j + 1] / static_cast<double>(maxColorValue);
                    double b = pixelValues[j + 2] / static_cast<double>(maxColorValue);

                    pixels.push_back(Color(r, g, b));
                }
            }
            file.close();
        }

        // all of these Supported via standard GitHub programming aids
        int getWidth() const { return width; }
        int getHeight() const { return height; }
        std::vector<Color> getPixels() const { return pixels; }

        Color getColorAtPixel(int x, int y) const { 
            return pixels[x + (y * width)];
        }
        Color getColorAtPixel(double x, double y) const {
            auto xCoord = static_cast<int>(x * width);
            auto yCoord = static_cast<int>(y * height);
            return getColorAtPixel(xCoord, yCoord);
        }

        void writeToFile(std::string filename) {
            std::ofstream file;
            file.open(filename);

            file << "P3\n" << width << " " << height << "\n" << static_cast<int>(maxColorValue) << "\n";
            for (int i = 0; i < pixels.size(); i++) {
                writeColor(file, pixels[i], maxColorValue); // minor edit here to pass maxColorValue to write_color
            }
            file.close();
        }
};

#endif