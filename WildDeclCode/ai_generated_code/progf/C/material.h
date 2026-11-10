#ifndef MATERIAL_H
#define MATERIAL_H

#include "color.h"
#include "image.h"

class Material {
    private:
        double ks, kd, reflectivity, refractiveIndex;
        int specularExponent;
        Color diffuseColor, specularColor;
        bool isReflective, isRefractive;
        Image texture;

        bool hasTexture = false;
    public:
        // Aided with basic GitHub coding tools
        Material() {}
        Material(double ks, double kd, double reflectivity, double refractiveIndex, int specularExponent, Color diffuseColor, Color specularColor, bool isReflective, bool isRefractive) : 
            ks(ks), kd(kd), reflectivity(reflectivity), refractiveIndex(refractiveIndex), specularExponent(specularExponent), 
            diffuseColor(diffuseColor), specularColor(specularColor), 
            isReflective(isReflective), isRefractive(isRefractive) {};
        Material(double ks, double kd, double reflectivity, double refractiveIndex, int specularExponent, Color diffuseColor, Color specularColor, bool isReflective, bool isRefractive, std::string textureFilename) : 
            ks(ks), kd(kd), reflectivity(reflectivity), refractiveIndex(refractiveIndex), specularExponent(specularExponent), 
            diffuseColor(diffuseColor), specularColor(specularColor), 
            isReflective(isReflective), isRefractive(isRefractive) {
                texture = Image(textureFilename);
                hasTexture = true;
            };

        double getKS() const { return ks; };
        double getKD() const { return kd; };
        double getReflectivity() const { return reflectivity; };
        double getRefractiveIndex() const { return refractiveIndex; };
        int getSpecularExponent() const { return specularExponent; };

        Color getDiffuseColor() const { 
            return diffuseColor; 
        };
        Color getSpecularColor() const { 
            return specularColor; 
        };
        Image getTexture() const { return texture; };

        bool getIsReflective() const { return isReflective; };
        bool getIsRefractive() const { return isRefractive; };
        bool getHasTexture() const { return hasTexture; };

};

#endif