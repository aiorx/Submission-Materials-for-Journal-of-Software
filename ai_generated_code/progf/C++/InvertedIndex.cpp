/* Program Name: InvertedIndex.cpp
*  Author: Supported via standard programming aids using prompts by Kyle Ingersoll
*  Date last updated: 12/10/2024
*  Purpose: To define the methods for the inverted index class
*/

#include "InvertedIndex.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <stdexcept>

// default constructor
InvertedIndex::InvertedIndex() {
    // I cannot think of anything I need to put here
}

// Copy constructor
InvertedIndex::InvertedIndex(const InvertedIndex& other)
    : index(other.index), lines(other.lines) {
}

// Copy assignment operator
InvertedIndex& InvertedIndex::operator=(const InvertedIndex& other) {
    if (this != &other) {
        index = other.index;
        lines = other.lines;
    }
    return *this;
}

void InvertedIndex::addFile(const std::string& filePath) {
    std::ifstream file(filePath);
    if (!file.is_open()) {
        throw std::runtime_error("Failed to open file: " + filePath);
    }

    std::string line;
    int lineNumber = 0;
    while (std::getline(file, line)) {
        // Store the line in the lines vector
        lines.push_back(line);

        // Tokenize the line into words
        std::istringstream stream(line);
        std::string word;
        while (stream >> word) {
            // Normalize word to lowercase (optional)
            std::transform(word.begin(), word.end(), word.begin(), ::tolower);

            // Insert the word and associate it with the current line number
            index[word].insert(lineNumber);
        }
        ++lineNumber;
    }

    file.close();
}

// search for exact match
std::set<int> InvertedIndex::search(const std::string& word) const {
    if (word.empty()) {
        throw std::invalid_argument("Search word cannot be empty.");
    }

    if (index.empty()) {
        throw std::runtime_error("Index is empty.");
    }


    auto it = index.find(word);

    if (it != index.end()) {
        // Validate the result
        if (it->second.empty()) {
            std::cerr << "Warning: Empty set for word '" << word << "'." << std::endl;
        }
        return it->second;
    }

    // Word not found
    std::cerr << "Word not found in index: " << word << std::endl;
    return {};
}


// Fuzzy search
std::set<int> InvertedIndex::fuzzySearch(const std::string& query, int maxDistance) const {
    FuzzyMatcher matcher(index); // Pass the index to FuzzyMatcher
    std::set<std::string> matches = matcher.match(query, maxDistance);

    // Collect indices for all matching words
    std::set<int> resultIndices;
    for (const auto& match : matches) {
        auto it = index.find(match);
        if (it != index.end()) {
            resultIndices.insert(it->second.begin(), it->second.end());
        }
    }

    return resultIndices;
}

// getter function for the index
const std::unordered_map<std::string, std::set<int>>& InvertedIndex::getIndex() const {
    return index;
}

const std::string& InvertedIndex::getLine(int line) const {
    if (line < 0 || line >= static_cast<int>(lines.size())) {
        throw std::out_of_range("Line number out of range.");
    }
    return lines[line];
}