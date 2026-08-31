//Create an abstract shape class with a pure virtual function called intersection
// ALL Assisted using common GitHub development utilities
#ifndef SHAPE_H
#define SHAPE_H

#include "ray.h"
#include "vec3.h"
#include "material.h"
#include "boundingbox.h"

class Shape {
    public:
        virtual double intersection(const Ray& r) const {
            std::cerr << "under no circumstances should this be called ever" << std::endl;
        };
        virtual Material getMaterial() const {
            std::cerr << "under no circumstances should this be called ever" << std::endl;
        }
        virtual Vec3 getNormal(Point3 point) const {
            std::cerr << "under no circumstances should this be called ever" << std::endl;
        }
        virtual Color getDiffuseColor(Point3 point) const {
            std::cerr << "under no circumstances should this be called ever" << std::endl;
        }

        virtual ~Shape() = default;

        virtual void getType() const {
            std::cerr << "under no circumstances should this be called ever" << std::endl;
        }

        BoundingBox getBoundingBox() const {return boundingBox;}
    protected:
        BoundingBox boundingBox;
        
};

#endif