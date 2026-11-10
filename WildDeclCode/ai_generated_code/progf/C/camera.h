#ifndef CAMERA_H
#define CAMERA_H

#include "vec3.h"
#include "utility.h"

class Camera {
    private:
        int width;
        int height;
        Point3 position;
        Vec3 lookAt;
        Vec3 upVector;
        double fov;
        double exposure;
        Vec3 pixel00_loc;
        Vec3 pixel_delta_u;
        Vec3 pixel_delta_v;

        Vec3 u,v,w; // basis vectors

        void initialise() {
            auto focal_length = (lookAt - position).length();
            auto aspect_ratio = static_cast<double>(width) / height;

            // assuming the fov is 1) in degrees, 2) referring to the vertical fov
            auto viewport_height = 2 * focal_length * tan(degrees_to_radians(fov / 2));
            auto viewport_width = viewport_height * aspect_ratio;
            std::cerr << "viewport_height: " << viewport_height << " viewport_width: " << viewport_width << "\n";

            // The rest was Aided with basic GitHub coding tools using the code in main.cpp, 
            // though i removed the image_height section since that's not needed here

            // taken from raytracer in one weekend
            w = unit_vector(lookAt - position);
            u = unit_vector(cross(upVector, w));
            v = cross(w, u);

            // Calculate the vectors across the horizontal and down the vertical viewport edges.
            // also taken from rotw
            auto viewport_u = viewport_width * u;
            auto viewport_v = viewport_height * -v;

            // Calculate the horizontal and vertical delta vectors from pixel to pixel.
            pixel_delta_u = viewport_u / width;
            pixel_delta_v = viewport_v / height;

            // Calculate the location of the upper left pixel.
            auto viewport_upper_left = position
                                    + (focal_length * w) - viewport_u/2 - viewport_v/2;
            // std::cerr << "viewport_upper_left: " << viewport_upper_left << "\n";
            pixel00_loc = viewport_upper_left + 0.5 * (pixel_delta_u + pixel_delta_v);
        }

    public:
        Camera() :
            width(1920), height(1080), lookAt(0, 0, 1), upVector(0, 1, 0) {}
        Camera(int width, int height, Point3 position, Vec3 lookAt, Vec3 upVector, double fov, double exposure) :
            width(width), height(height), position(position), lookAt(lookAt), upVector(upVector), fov(fov), exposure(exposure) {
                initialise();
            }

        int getWidth() { return width; }
        int getHeight() { return height; }
        Point3 getPosition() { return position; }

        Vec3 getPixel00Loc() { return pixel00_loc; }
        Vec3 getPixelDeltaU() { return pixel_delta_u; }
        Vec3 getPixelDeltaV() { return pixel_delta_v; }

};


#endif