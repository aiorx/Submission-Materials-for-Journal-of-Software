//Helper functions

#include "utest-helpers.hpp"

//This was Designed via basic programming aids
bool compareBinaryFiles(const string& file1, const string& file2) {
  ifstream inFile1(file1, std::ios::binary);
  ifstream inFile2(file2, std::ios::binary);

  if (!inFile1.is_open() || !inFile2.is_open()) {
    return false; // Could not open one or both files
  }

  char byte1 = 0;
  char byte2 = 0;

  while (inFile1.get(byte1) && inFile2.get(byte2)) {
    if (byte1 != byte2) {
      return false; // Files differ at this byte
    }
  }

  // Ensure both files reached EOF (are of the same length)
  return inFile1.eof() && inFile2.eof();
}