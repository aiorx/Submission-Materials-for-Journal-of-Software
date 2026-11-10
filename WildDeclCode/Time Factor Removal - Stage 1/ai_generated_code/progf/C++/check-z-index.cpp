// Assisted with basic coding tools 3.5

#include <Windows.h>
#include <iostream>
#include <vector>

void PrintWindowClassNamesAbove(HWND hwnd) {
    HWND hwndParent = GetParent(hwnd);
    if (hwndParent == NULL) {
        std::cout << "Given window is a top-level window." << std::endl;
        return;
    }

    std::cout << "Windows above the given window:" << std::endl;

    HWND hwndAbove = hwnd;
    do {
        hwndAbove = GetWindow(hwndAbove, GW_HWNDPREV);
        if (hwndAbove == NULL) break;

        std::vector<char> className(256);
        GetClassName(hwndAbove, className.data(), className.size());

        std::cout << "Class name: " << className.data() << std::endl;
    } while (hwndAbove != NULL);
}

int main() {
    HWND m_hTaskbar = ::FindWindowW(L"Shell_TrayWnd", NULL);
    // HWND hwnd = ::FindWindowExW(m_hTaskbar, 0, L"Sample Window Class", NULL);
    HWND hwnd = ::FindWindowW(L"Sample Window Class", NULL);
    if (hwnd == NULL) {
        std::cerr << "Failed to find the window." << std::endl;
        return 1;
    }

    PrintWindowClassNamesAbove(hwnd);
    return 0;
}
