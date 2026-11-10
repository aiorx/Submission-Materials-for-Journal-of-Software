#ifndef FUZZYMATCHER_H
#define FUZZYMATCHER_H

/* Program Name: FuzzyMatcher.h
*  Author: Supported via standard programming aids through prompts from Kyle Ingersoll
*  Date last updated: 12/8/2024
*  Purpose: To create the class prototype for the FuzzyMatcher class
*/

#include <string>
#include <vector>
#include <set>
#include <unordered_map>

class FuzzyMatcher {
private:
    // The inverted index to be used for matching
    std::unordered_map<std::string, std::set<int>> index;

    // Helper method to calculate Levenshtein Distance
    static int levenshteinDistance(const std::string& s1, const std::string& s2);

public:
    // Constructor to initialize the FuzzyMatcher with an index
    FuzzyMatcher(std::unordered_map<std::string, std::set<int>> index);

    // Method to perform fuzzy matching
    std::set<std::string> match(const std::string& query, int maxDistance) const;
};

#endif // FUZZYMATCHER_H

