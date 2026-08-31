#ifndef SCREEN2_H
#define SCREEN2_H

/* Program Name: Screen2.h
*  Author: Assisted with basic coding tools using prompts by Kyle Ingersoll
*  Date last updated: 12/10/2024
*  Purpose: To create a class prototype for Screen 2.
*/

#include <string>
#include "InvertedIndex.h"
#include "FuzzyMatcher.h"
#include <windows.h>
#include <memory>

class Screen2 {
public:
    // Default constructor
    Screen2(std::string& filePath);

    void createScreen(HINSTANCE hInstance);
    void performSearch(HWND hwnd, const std::string& searchText, int maxDistance);
    void highlightResults(HWND hwndResultsBox, const std::set<int>& matches, const InvertedIndex& index);
    HWND gethwndSearchBox() const;
private:
    HWND hwndExactResults;
    HWND hwndFuzzyResults;
    HWND hwndSearchBox;

    std::string filePath;
};

#endif // SCREEN2_H


