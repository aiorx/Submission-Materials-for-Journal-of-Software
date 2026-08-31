/* Program Name: Screen2.cpp
*  Author: Aided using common development resources using prompts by Kyle Ingersoll
*  Date last updated: 12/10/2024
*  Purpose: To create method definitions for Screen 2.
*/

#include "Screen2.h"
#include <windows.h>
#include <fstream>
#include <sstream>
#include <CommCtrl.h>
#include <string>
#include <set>
#include <stdexcept>
#include <algorithm>
#include <memory>
#include "InvertedIndex.h"
#include "FuzzyMatcher.h"

// Initialize global variables
std::shared_ptr<InvertedIndex> invertedIndex = std::make_shared<InvertedIndex>();
std::shared_ptr<FuzzyMatcher> fuzzyMatcher;

// Forward declaration of the window procedure
LRESULT CALLBACK Screen2WndProc(HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam);
Screen2* screen2Instance = nullptr; // Global pointer for the Screen2 instance

// Default constructor
Screen2::Screen2(std::string& filePath)
    : hwndExactResults(nullptr),
    hwndFuzzyResults(nullptr),
    hwndSearchBox(nullptr)
{
    this->filePath = filePath;

    // Populate the inverted index
    try {
        invertedIndex->addFile(filePath);

        // Initialize the fuzzy matcher after the inverted index is populated
        fuzzyMatcher = std::make_shared<FuzzyMatcher>(invertedIndex->getIndex());
    }
    catch (const std::exception& e) {
        MessageBoxA(nullptr, e.what(), "Error", MB_ICONERROR);
    }
}

void Screen2::createScreen(HINSTANCE hInstance) {
    try {
        // Register the window class
        WNDCLASS wc = {};
        wc.lpfnWndProc = Screen2WndProc;
        wc.hInstance = hInstance;
        wc.lpszClassName = L"Screen2Class";

        if (!RegisterClass(&wc)) {
            MessageBox(nullptr, L"Failed to register window class!", L"Error", MB_ICONERROR);
            return;
        }

        // Create the main window
        HWND hwnd = CreateWindow(L"Screen2Class", L"Search Text File", WS_OVERLAPPEDWINDOW,
            CW_USEDEFAULT, CW_USEDEFAULT, 800, 600, nullptr, nullptr, hInstance, nullptr);

        if (!hwnd) {
            MessageBox(nullptr, L"Failed to create window!", L"Error", MB_ICONERROR);
            return;
        }

        screen2Instance = this; // Assign this instance to the global pointer
        ShowWindow(hwnd, SW_SHOW);
        UpdateWindow(hwnd);
    }
    catch (const std::exception& e) {
        MessageBoxA(nullptr, e.what(), "Error", MB_ICONERROR);
    }
}

LRESULT CALLBACK Screen2WndProc(HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam) {
    static HWND hwndSearchBox, hwndExactResults, hwndFuzzyResults;

    switch (message) {
    case WM_CREATE: {

        // UI elements
        CreateWindowW(L"STATIC", L"Input word(s) you want to search for:", WS_VISIBLE | WS_CHILD,
            20, 20, 300, 20, hwnd, nullptr, nullptr, nullptr);

        hwndSearchBox = CreateWindowW(L"EDIT", L"", WS_VISIBLE | WS_CHILD | WS_BORDER | ES_AUTOHSCROLL,
            20, 50, 300, 20, hwnd, (HMENU)1, nullptr, nullptr);

        CreateWindowW(L"STATIC", L"Exact Results:", WS_VISIBLE | WS_CHILD,
            20, 90, 100, 20, hwnd, nullptr, nullptr, nullptr);

        hwndExactResults = CreateWindowW(L"EDIT", L"", WS_VISIBLE | WS_CHILD | WS_BORDER | ES_MULTILINE | ES_AUTOVSCROLL | ES_READONLY,
            20, 120, 350, 400, hwnd, (HMENU)2, nullptr, nullptr);

        CreateWindowW(L"STATIC", L"Fuzzy Results:", WS_VISIBLE | WS_CHILD,
            400, 90, 100, 20, hwnd, nullptr, nullptr, nullptr);

        hwndFuzzyResults = CreateWindowW(L"EDIT", L"", WS_VISIBLE | WS_CHILD | WS_BORDER | ES_MULTILINE | ES_AUTOVSCROLL | ES_READONLY,
            400, 120, 350, 400, hwnd, (HMENU)3, nullptr, nullptr);

        CreateWindowW(L"BUTTON", L"Search", WS_VISIBLE | WS_CHILD,
            330, 50, 80, 20, hwnd, (HMENU)4, nullptr, nullptr);

        break;
    }
    case WM_COMMAND: {
        if (LOWORD(wParam) == 4) { // Search button clicked

            wchar_t buffer[1024];
            GetWindowTextW(hwndSearchBox, buffer, sizeof(buffer) / sizeof(wchar_t));

            std::wstring ws(buffer);
            std::string searchText(ws.begin(), ws.end());

            std::transform(searchText.begin(), searchText.end(), searchText.begin(), ::tolower);

            int maxDistance = 2;

            screen2Instance->performSearch(hwnd, searchText, maxDistance);
        }
        break;
    }
    case WM_CLOSE: {
        DestroyWindow(hwnd);
        break;
    }
    case WM_DESTROY: {
        break;
    }
    default: {
        return DefWindowProc(hwnd, message, wParam, lParam);
    }
    }

    return 0;
}

void Screen2::performSearch(HWND hwnd, const std::string& searchText, int maxDistance) {
    std::set<int> exactMatches = invertedIndex->search(searchText);
    highlightResults(hwndExactResults, exactMatches, *invertedIndex);

    if (fuzzyMatcher) {
        std::set<std::string> fuzzyMatches = fuzzyMatcher->match(searchText, maxDistance);

        std::wstring fuzzyResultsText;
        for (const auto& word : fuzzyMatches) {
            fuzzyResultsText += std::wstring(word.begin(), word.end()) + L"\n";
        }

        SetWindowTextW(hwndFuzzyResults, fuzzyResultsText.c_str());
    }
    else {
        MessageBox(hwnd, L"FuzzyMatcher is not initialized!", L"Error", MB_ICONERROR);
    }
}

void Screen2::highlightResults(HWND hwndResultsBox, const std::set<int>& matches, const InvertedIndex& index) {
    std::wstring resultsText;

    for (int line : matches) {
        std::string lineText = index.getLine(line);
        resultsText += std::wstring(lineText.begin(), lineText.end()) + L"\r\n";
    }

    SetWindowTextW(hwndResultsBox, resultsText.c_str());
}

HWND Screen2::gethwndSearchBox() const {
    return hwndSearchBox;
}
