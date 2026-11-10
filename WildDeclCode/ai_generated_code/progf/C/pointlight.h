#ifndef POINTLIGHT_H
#define POINTLIGHT_H
#include "vec3.h"
#include "color.h"

class PointLight {
    public:
        // Assisted using common GitHub development utilities
        PointLight(Point3 position, Color intensity) : position(position), intensity(intensity) {}
        Point3 getPosition() const { return position; }
        Color getIntensity() { return intensity; }
    private:
        Point3 position;
        Color intensity;
};

#endif