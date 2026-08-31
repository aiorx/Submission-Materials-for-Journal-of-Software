// dda2.cpp: Draws a line using the Digital
// Differential Analyzer (DDA) algorithm,
// as Supported via standard programming aids

#include <stdlib.h>
#include <stdio.h>
#include "graphics.h"

// Function to draw a line using DDA algorithm
void drawLineDDA(int X1, int Y1, int X2, int Y2) {
    // Calculate the difference between the start and end points
    int dx = X2 - X1;
    int dy = Y2 - Y1;

    // Calculate the number of steps needed
    int steps = abs(dx) > abs(dy) ? abs(dx) : abs(dy);

    // Calculate the increment in x and y for each step
    float xIncrement = dx / (float) steps;
    float yIncrement = dy / (float) steps;

    // Initialize starting coordinates
    float x = X1;
    float y = Y1;

    // Draw pixels along the line using the DDA algorithm
    for (int i = 0; i <= steps; i++) {
        putpixel(x, y, WHITE); // Set pixel color to white (you can change it to any other color)
        delay(10);
        x += xIncrement;       // Increment x
        y += yIncrement;       // Increment y
    }
}

int main() {
    // Initialize graphics mod
    int gd = DETECT, gm;
    initgraph(&gd, &gm, NULL);

    // Coordinates of the start and end points of the line
    int X1 = 100, Y1 = 100, X2 = 400, Y2 = 300;

    // Draw the line using DDA algorithm
    drawLineDDA(X1, Y1, X2, Y2);

    // Wait for a key press
    getch();

    // Close graphics mode
    closegraph();

    return 0;
}