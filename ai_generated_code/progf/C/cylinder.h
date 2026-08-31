#ifndef CYLINDER_H
#define CYLINDER_H
#include "shape.h"
#include "vec3.h"
#include <vector>
#include "utility.h"

class Cylinder : public Shape {
    private:
        Point3 center;
        Vec3 axis;
        double radius;
        double height;
        Material mat;

        void initialiseBoundingBox() {
            // taken from https://iquilezles.org/articles/diskbbox/
            auto top = center + (axis * height);
            auto bottom = center - (axis * height);

            Vec3 a = top - bottom;
            Vec3 e = radius * sqrt( 1 - (a.length_squared() / (a.x() * a.x() + a.z() * a.z())) ) * Vec3(1, 0, 1); // copilot

            auto min = Vec3(std::min(top.x(), bottom.x()), std::min(top.y(), bottom.y()), std::min(top.z(), bottom.z())) - e; // copilot
            auto max = Vec3(std::max(top.x(), bottom.x()), std::max(top.y(), bottom.y()), std::max(top.z(), bottom.z())) + e; // copilot

            boundingBox = BoundingBox(min, max);
        }
    public:
        Cylinder() {}
        Cylinder(const Point3& center, const Vec3& axis, double radius, double height) :
            center(center), axis(unit_vector(axis)), radius(radius), height(height) {
                initialiseBoundingBox();
            }
        Cylinder(const Point3& center, const Vec3& axis, const Material& mat, double radius, double height) :
            center(center), axis(unit_vector(axis)), radius(radius), height(height), mat(mat) {
                initialiseBoundingBox();
            }

        Point3 getCenter() const {return center;}
        Vec3 getAxis() const {return axis;}
        double getRadius() const {return radius;}
        double getHeight() const {return height;}
        Material getMaterial() const override {return mat;}

        // Supported via standard GitHub programming aids, prompt: write a method for checking if a ray intersects with a cylinder
        double intersection(const Ray& r) const override {
            Vec3 bottom = center - (axis * height);

            Vec3 oc = r.origin() - bottom;

            // not part of the original copilot output: added by copilot later once 
            // I had a different reference for cylinders with an arbitrary axis open in Chrome
            Vec3 dir = r.direction();
            double a = dot(dir, dir) - (dot(dir, axis) * dot(dir, axis));
            double b = 2.0 * (dot(oc, dir) - (dot(oc, axis) * dot(dir, axis)));
            double c = dot(oc, oc) - (dot(oc, axis) * dot(oc, axis)) - (radius * radius);

            std::vector<double> t_values;

            double discriminant = b*b - 4*a*c;
            if (discriminant >= 0) {
                double sqrt_discriminant = sqrt(discriminant);
                double t = (-b - sqrt_discriminant) / (2.0 * a);

                // co-pilot generated, yet again: not part of the original response though
                double m = dot(r.direction(), axis) * t + dot(oc, axis);

                if (m <= 2*height && m >= 0) {
                    if (t >= 0) t_values.push_back(t);
                }
            }
            
            // Top and bottom cap intersection
            // largely generated line-by-line by copilot, when i had a ray-disk intersection tutorial open in chrome
            // refactored during blinn phong implementation, largely done manually
            auto bottomCapCentre = bottom;
            auto topCapCentre = center + (axis * height);

            auto bottomCapNormal = -axis;
            auto topCapNormal = axis;

            auto bottom_t = dot(bottomCapNormal, bottomCapCentre - r.origin()) / dot(bottomCapNormal, r.direction());
            auto top_t = dot(topCapNormal, topCapCentre - r.origin()) / dot(topCapNormal, r.direction());

            auto bottomCapIntersectionPt = r.origin() + bottom_t * r.direction();
            auto topCapIntersectionPt = r.origin() + top_t * r.direction();

            auto bottomCapRadius = (bottomCapIntersectionPt - bottomCapCentre).length();
            auto topCapRadius = (topCapIntersectionPt - topCapCentre).length();

            if (bottomCapRadius <= radius && bottom_t >= 0) t_values.push_back(bottom_t);
            if (topCapRadius <= radius && top_t >= 0) t_values.push_back(top_t);

            if (t_values.size() == 0) return -1;
            double min_t = t_values[0];
            for (int i = 1; i < t_values.size(); i++) {
                if (t_values[i] < min_t) min_t = t_values[i];
            }
            return min_t;
        }

        Vec3 getNormal(Point3 point) const override {
            // Top and bottom cap intersection
            auto top = center + (axis * height);
            auto bottom = center - (axis * height);

            if ((top - point).length() <= radius) {
                return axis;
            }
            if ((bottom - point).length() <= radius) {
                return -axis;
            }

            // Curved surface intersection
            // Supported via standard GitHub programming aids when https://stackoverflow.com/questions/36266357/how-can-i-compute-normal-on-the-surface-of-a-cylinder was open in my browser
            auto t = dot(point - bottom, axis);
            auto p = bottom + t * axis;
            auto n = unit_vector(point - p);
            return n;
        }

        Color getDiffuseColor(Point3 point) const override {
            if (!mat.getHasTexture()) {
                return mat.getDiffuseColor();
            }
            else {
                // taken from ChatGPT and heavily modified
                Vec3 top = center + (axis * height);
                Vec3 topToPoint = point - top;

                // Calculate height (project the vector onto the cylinder axis)
                auto heightFromTop = std::abs(dot(topToPoint, axis));
                
                // Calculate angle
                auto angle = std::abs(atan2(topToPoint.z(), topToPoint.x()));

                // std::cerr << "angle: " << angle / (2 * pi) << " heightFromTop: " << heightFromTop / (2 * height) << "\n";

                // this line was Supported via standard GitHub programming aids
                return mat.getTexture().getColorAtPixel((angle + pi) / (2 * pi), heightFromTop / (2 * height));
            }
        }

        void getType() const override {
            std::cerr << "cylinder" << std::endl;
        }
};

#endif