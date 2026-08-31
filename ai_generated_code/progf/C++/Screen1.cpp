/* Program Name: Screen1.cpp
*  Author: Assisted with basic coding tools using prompts by Kyle Ingersoll
*  Date last updated: 12/10/2024
*  Purpose: To create method definitions for Screen 1.
*/


#include "Screen1.h"
#include <string>
#include <tchar.h>

#define IDC_TEXTBOX 101
#define IDC_BUTTON_NEXT 102

void Screen1::createScreen(HINSTANCE hInstance, int nCmdShow) {
    WNDCLASSEX wc = { 0 };
    wc.cbSize = sizeof(WNDCLASSEX);
    wc.style = CS_HREDRAW | CS_VREDRAW;
    wc.lpfnWndProc = Screen1::WndProc;
    wc.hInstance = hInstance;
    wc.hCursor = LoadCursor(nullptr, IDC_ARROW);
    wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    wc.lpszClassName = L"Screen1Class";

    if (!RegisterClassEx(&wc)) {
        MessageBox(nullptr, L"Failed to register Screen1 class!", L"Error", MB_ICONERROR);
        return;
    }

    HWND hwnd = CreateWindowW(
        L"Screen1Class", L"M08 Final Project - Screen 1",
        WS_OVERLAPPEDWINDOW, CW_USEDEFAULT, 0, 600, 400,
        nullptr, nullptr, hInstance, this);

    if (!hwnd) {
        MessageBox(nullptr, L"Failed to create Screen1 window!", L"Error", MB_ICONERROR);
        return;
    }

    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
}

LRESULT CALLBACK Screen1::WndProc(HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam) {
    static HWND hwndLabel, hwndTextBox, hwndButtonNext;
    static std::string filePath;

    switch (message) {
    case WM_CREATE: {
        // Create Label
        hwndLabel = CreateWindowW(
            L"STATIC", L"Input file path to text file:",
            WS_VISIBLE | WS_CHILD,
            50, 100, 200, 20,
            hwnd, nullptr, nullptr, nullptr);

        // Create Text Box
        hwndTextBox = CreateWindowW(
            L"EDIT", L"",
            WS_VISIBLE | WS_CHILD | WS_BORDER | ES_AUTOHSCROLL,
            250, 100, 300, 20,
            hwnd, (HMENU)IDC_TEXTBOX, nullptr, nullptr);

        // Create Next Button
        hwndButtonNext = CreateWindowW(
            L"BUTTON", L"Next",
            WS_VISIBLE | WS_CHILD,
            250, 150, 100, 30,
            hwnd, (HMENU)IDC_BUTTON_NEXT, nullptr, nullptr);
        break;
    }
    // original ChatGPT created code, used fopen instead of fopen_s, leading to a compiler error.
    /*
    case WM_COMMAND: {
        if (LOWORD(wParam) == IDC_BUTTON_NEXT) {
            // Retrieve the file path
            wchar_t buffer[256];
            GetWindowTextW(hwndTextBox, buffer, 256);

            // Convert wchar_t to std::string
            std::wstring ws(buffer);
            filePath = std::string(ws.begin(), ws.end());

            // Check if file exists
            FILE* file = fopen(filePath.c_str(), "r");
            if (file) {
                fclose(file);
                // Move to Screen 2
                Screen2 screen2;
                screen2.createScreen(GetModuleHandle(nullptr), filePath);
                DestroyWindow(hwnd);
            }
            else {
                MessageBox(hwnd, L"File not found! Please enter a valid file path.", L"Error", MB_ICONERROR);
            }
        }
        break;
    }
    */
    // new ChatGPT created code that uses fopen_s, fixing the compiler error
    case WM_COMMAND: {
        if (LOWORD(wParam) == IDC_BUTTON_NEXT) {
            // Retrieve the file path
            wchar_t buffer[256];
            GetWindowTextW(hwndTextBox, buffer, 256);

            // Convert wchar_t to std::string
            std::wstring ws(buffer);
            filePath = std::string(ws.begin(), ws.end());

            // Check if file exists using fopen_s
            FILE* file = nullptr;
            if (fopen_s(&file, filePath.c_str(), "r") == 0 && file != nullptr) {
                fclose(file); // Close the file if it was successfully opened

                // Move to Screen 2
                Screen2 screen2(filePath);
                screen2.createScreen(GetModuleHandle(nullptr));
                // removed this code so that Screen 2 could stay open
                /*
                DestroyWindow(hwnd); // Close the current window
                */
            }
            else {
                MessageBox(hwnd, L"File not found! Please enter a valid file path.", L"Error", MB_ICONERROR);
            }
        }
        break;
    }

    case WM_DESTROY:
        PostQuitMessage(0);
        break;

    default:
        return DefWindowProc(hwnd, message, wParam, lParam);
    }
    return 0;
}

std::string Screen1::getFilePath() const {
    return filePath;
}
