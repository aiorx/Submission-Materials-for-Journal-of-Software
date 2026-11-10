// Assisted with basic coding tools

#include <math.h>
#include <SPI.h>
#include "epd1in54_V2.h"
#include "epdpaint.h"

extern Paint paint;

// const double PI = 3.14159265358979323846;
const int RADIUS = 31;  // radius of the clock face
const int cx = 31;      // center x of the clock
const int cy = 31;      // center y of the clock

// External function assumed to be available
void drawline(int x0, int y0, int x1, int y1) {
  paint.DrawLine( x0, y0, x1, y1, 0);
}

// Converts degrees to radians
double deg2rad(double degrees) {
    return degrees * PI / 180.0;
}

// Draws the clock with hour and minute hands
void show_clock(int hours, int minutes) {
    // Normalize the hour to 12-hour format
    hours = hours % 12;

    // Calculate angles
    double minute_angle = 90.0 - (minutes * 6.0); // 6 degrees per minute
    double hour_angle = 90.0 - (hours * 30.0 + minutes * 0.5); // 30 degrees per hour + 0.5 per minute

    // Convert angles to radians
    double min_rad = deg2rad(minute_angle);
    double hour_rad = deg2rad(hour_angle);

    // Length of hands
    int minute_length = RADIUS - 10;
    int hour_length = RADIUS - 40;

    // Calculate endpoint of minute hand
    int mx = cx + static_cast<int>(minute_length * cos(min_rad));
    int my = cy - static_cast<int>(minute_length * sin(min_rad)); // y-axis inverted for screen coordinates

    // Calculate endpoint of hour hand
    int hx = cx + static_cast<int>(hour_length * cos(hour_rad));
    int hy = cy - static_cast<int>(hour_length * sin(hour_rad));

    // Draw hour hand
    drawline(cx, cy, hx, hy);

    // Draw minute hand
    drawline(cx, cy, mx, my);
}
