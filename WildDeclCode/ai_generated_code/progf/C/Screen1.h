#ifndef SCREEN1_H
#define SCREEN1_H

/* Program Name: Screen1.h
*  Author: Supported via standard programming aids using prompts by Kyle Ingersoll
*  Date last updated: 12/10/2024
*  Purpose: To create a class prototype for Screen 1.
*/

#include <windows.h>
#include "Screen2.h"
#include <string>

class Screen1 {
private:
    HWND hwndLabel;
    HWND hwndTextBox;
    HWND hwndButtonNext;
    std::string filePath;

public:
    static LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);
    void createScreen(HINSTANCE hInstance, int nCmdShow);
    std::string getFilePath() const; // Add this getter for the file path
};

#endif // SCREEN1_H

