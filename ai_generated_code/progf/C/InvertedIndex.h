#ifndef INVERTEDINDEX_H
#define INVERTEDINDEX_H

/* Program Name: InvertedIndex.h 
*  Author: Assisted with basic coding tools using prompts by Kyle Ingersoll
*  Date last updated: 12/10/2024
*  Purpose: To create a class prototype for the inverted index data structure
*/

#include "FuzzyMatcher.h"
#include <unordered_map>
#include <set>
#include <string>
#include <vector>
#include <memory>

class InvertedIndex {
private:
    // Map each word to a set of index numbers for uniqueness and fast lookups
    std::unordered_map<std::string, std::set<int>> index;
    std::vector<std::string> lines; // Store lines of the file

public:
    // default constructor
    InvertedIndex();

    // copy constructor
    InvertedIndex(const InvertedIndex& other);

    // equals sign operator overload
    InvertedIndex& operator=(const InvertedIndex& other);

    // Add file and populate the index
    void addFile(const std::string& filePath);

    // Perform exact search
    std::set<int> search(const std::string& word) const;

    // Perform fuzzy search and return matching indices
    std::set<int> fuzzySearch(const std::string& query, int maxDistance) const;

    const std::unordered_map<std::string, std::set<int>>& getIndex() const;

    const std::string& getLine(int line) const; // Retrieves a specific line by number
};

#endif // INVERTEDINDEX_H

