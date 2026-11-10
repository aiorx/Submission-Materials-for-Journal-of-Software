//
// Created by finnb on 10/21/2024.
//
#pragma once

#include <cstdint>
#include <tuple>
#include <string>
using namespace std;

#ifndef UTILITY_HPP
#define UTILITY_HPP

constexpr int IntensityCutoff = 255;
constexpr int ByteCutoff8 = 32;
constexpr int ByteCutoff4 = 16;
constexpr int ByteCutoff2 = 8;

struct Coords {
  float x_map,x_lo,x_hi,y_map,y_lo,y_hi;
};

struct Image_Attributes {
    std::string magic_word;
    unsigned int width, height;
    int intensity;
};

struct smallColor{
    uint8_t r, g, b;
    bool operator==(const smallColor &other) const {
        return (r == other.r && g == other.g && b == other.b);
    }


};


struct bigColor{
    uint16_t r, g, b;
    bool operator==(const bigColor &other) const {
        return (r == other.r && g == other.g && b == other.b);
    }
};

// These hashing algorithms were Composed with basic coding tools
// Gets std hash of uint8_t/uint16_t for all three color copmonents, shifts so they don't overlap, XORs
// Adds to namespace std for use in unordered set/map
namespace std {
  template <>
  struct hash<smallColor> {
      std::size_t operator()(smallColor const & color) const {
        // Combine hash values of red, green, and blue components
        return (std::hash<uint8_t>()(color.r) << ByteCutoff4) ^
               (std::hash<uint8_t>()(color.g) << ByteCutoff2) ^ std::hash<uint8_t>()(color.b);
      }
  };

  template <>
  struct hash<bigColor> {
      std::size_t operator()(bigColor const & color) const {
        // Combine hash values of red, green, and blue components
        return (std::hash<uint16_t>()(color.r) << ByteCutoff8) ^
               (std::hash<uint16_t>()(color.g) << ByteCutoff4) ^ std::hash<uint16_t>()(color.b);
      }
  };

  template <>
  struct hash<std::tuple<uint8_t, uint8_t, uint8_t>> {
      std::size_t operator()(const std::tuple<uint8_t, uint8_t, uint8_t> & tup) const {
        // Combine hash values of the three uint16_t elements
        return (std::hash<uint8_t>()(std::get<0>(tup)) << ByteCutoff4) ^
               (std::hash<uint8_t>()(std::get<1>(tup)) << ByteCutoff2) ^
               std::hash<uint8_t>()(std::get<2>(tup));
      }
  };

  template <>
  struct hash<std::tuple<uint16_t, uint16_t, uint16_t>> {
      std::size_t operator()(const std::tuple<uint16_t, uint16_t, uint16_t> & tup) const {
        // Combine hash values of the three uint16_t elements
        return (std::hash<uint16_t>()(std::get<0>(tup)) << ByteCutoff8) ^
               (std::hash<uint16_t>()(std::get<1>(tup)) << ByteCutoff4) ^
               std::hash<uint16_t>()(std::get<2>(tup));
      }
  };
}  // namespace std

inline string inFile;
inline string outFile;

void validate_metadata (const string& word, int width, int height, int intensity);
Image_Attributes get_image_metadata (ifstream& imageFile);
void displayInfo();
string getInFile();
string getOutFile();
void setInFile(const string& name);
void setOutFile(const string& name);

#endif //UTILITY_HPP
