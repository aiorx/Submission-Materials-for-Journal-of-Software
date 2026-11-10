/* Program Name: main.cpp
*  Author: Supported via standard programming aids using prompts by Kyle Ingersoll
*  Date last updated: 12/2/2024
*  Purpose: To serve as the main function of the Inverted Index Search Final Project.
*/


#include "Screen1.h"

int APIENTRY wWinMain(_In_ HINSTANCE hInstance,
    _In_opt_ HINSTANCE hPrevInstance,
    _In_ LPWSTR lpCmdLine,
    _In_ int nCmdShow) {
    UNREFERENCED_PARAMETER(hPrevInstance);
    UNREFERENCED_PARAMETER(lpCmdLine);

    Screen1 screen1;
    screen1.createScreen(hInstance, nCmdShow);

    MSG msg;
    while (GetMessage(&msg, nullptr, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    return (int)msg.wParam;
}
