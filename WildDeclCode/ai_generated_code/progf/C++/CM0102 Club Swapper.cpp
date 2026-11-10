#include <windows.h>
#include <tlhelp32.h> // Include this for CreateToolhelp32Snapshot and related functions
#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <fstream>

#define WIN32_LEAN_AND_MEAN

LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
void OnButtonClick(HWND hwnd);

// Global Variables
HWND hTextbox, hButton;
const char* TARGET_PROCESS_NAME = "cm0102.exe";
DWORD TARGET_ADDRESS = 0x00AE23B4;
const int DELTA_1 = 581;
const int DELTA_2 = 79;
const int MAX_ITERATIONS = 60000;

// Utility function to split a string based on a delimiter
std::vector<std::string> splitString(const std::string& str, const std::string& delimiter) {
    std::vector<std::string> tokens;
    size_t start = 0, end = 0;
    while ((end = str.find(delimiter, start)) != std::string::npos) {
        tokens.push_back(str.substr(start, end - start));
        start = end + delimiter.length();
    }
    tokens.push_back(str.substr(start));
    return tokens;
}

// Function to find the process ID by name
DWORD FindProcessId(const std::string& processName) {
    DWORD processId = 0;
    HANDLE hSnap = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    if (hSnap != INVALID_HANDLE_VALUE) {
        PROCESSENTRY32 pe;
        pe.dwSize = sizeof(PROCESSENTRY32);
        if (Process32First(hSnap, &pe)) {
            do {
                if (processName == pe.szExeFile) {
                    processId = pe.th32ProcessID;
                    break;
                }
            } while (Process32Next(hSnap, &pe));
        }
    }
    CloseHandle(hSnap);
    return processId;
}

// Function to open the process and manipulate memory
void ModifyProcessMemory(DWORD processId, const std::vector<std::string>& lines) {
    HANDLE hProcess = OpenProcess(PROCESS_VM_READ | PROCESS_VM_WRITE | PROCESS_VM_OPERATION, FALSE, processId);
    if (hProcess == nullptr) {
        MessageBoxA(NULL, "Failed to open the process.", "Error", MB_OK | MB_ICONERROR);
        return;
    }

    // Read the initial integer value at the specified address
    DWORD address;
    ReadProcessMemory(hProcess, (LPCVOID)TARGET_ADDRESS, &address, sizeof(address), nullptr);
    address += 4;  // Increase the address as instructed 

    int all_found = 1;
    for (const auto& line : lines) {
        std::vector<std::string> parts = splitString(line, " - ");
        if (parts.size() != 2) continue;

        std::string beforeDelimiter = parts[0];
        std::string afterDelimiter = parts[1];
        char buffer[256];
        DWORD currentAddress = address;
        bool found = false;

        // Search for the string in memory
        for (int i = 0; i < MAX_ITERATIONS; ++i) {
            ReadProcessMemory(hProcess, (LPCVOID)currentAddress, buffer, beforeDelimiter.size() + 1, nullptr);

            if (beforeDelimiter == buffer) {
                found = true;
                break;
            }
            else{
              ReadProcessMemory(hProcess, (LPCVOID)(currentAddress+0x34), buffer, beforeDelimiter.size() + 1, nullptr);
              if (beforeDelimiter == buffer) {
                  found = true;
                  break;
              }
            }
            currentAddress += DELTA_1;
        }

        if (found) {
            DWORD addressToSwap1 = currentAddress + DELTA_2;
            BYTE firstBlock[16], secondBlock[16];

            // Read the first 16 bytes
            ReadProcessMemory(hProcess, (LPCVOID)addressToSwap1, firstBlock, 16, nullptr);

            // Search for the second part after the delimiter
            currentAddress = address;
            found = false;
            for (int i = 0; i < MAX_ITERATIONS; ++i) {
                ReadProcessMemory(hProcess, (LPCVOID)currentAddress, buffer, afterDelimiter.size() + 1, nullptr);
                if (afterDelimiter == buffer) {
                    found = true;
                    break;
                }
                else{
                  ReadProcessMemory(hProcess, (LPCVOID)(currentAddress+0x34), buffer, afterDelimiter.size() + 1, nullptr);
                  if (afterDelimiter == buffer) {
                      found = true;
                      break;
                  }
                }
                currentAddress += DELTA_1;
            }

            if (found) {
                DWORD addressToSwap2 = currentAddress + DELTA_2;

                // Read the second 16 bytes
                ReadProcessMemory(hProcess, (LPCVOID)addressToSwap2, secondBlock, 16, nullptr);

                // Swap the blocks
                WriteProcessMemory(hProcess, (LPVOID)addressToSwap1, secondBlock, 16, nullptr);
                WriteProcessMemory(hProcess, (LPVOID)addressToSwap2, firstBlock, 16, nullptr);
            }
            else all_found = 0;
        }
    }
    if(all_found){
      MessageBoxA(NULL, "Club swapping was successful!", "Success!", MB_OK);
    }
    CloseHandle(hProcess);
}

// Callback for the button click
void OnButtonClick(HWND hwnd) {
    char buffer[1024];
    GetWindowTextA(hTextbox, buffer, sizeof(buffer));
    std::string input = buffer;

    std::vector<std::string> lines = splitString(input, "\r\n");

    DWORD processId = FindProcessId(TARGET_PROCESS_NAME);
    if (processId != 0) {
        ModifyProcessMemory(processId, lines);
    } else {
        MessageBoxA(hwnd, "Process not found.", "Error", MB_OK | MB_ICONERROR);
    }
}

// Main Window Procedure
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
        case WM_CREATE:
            hTextbox = CreateWindow("EDIT", "", WS_CHILD | WS_VISIBLE | WS_BORDER | ES_MULTILINE | WS_VSCROLL,
                                    10, 10, 300, 200, hwnd, NULL, NULL, NULL);
            hButton = CreateWindow("BUTTON", "Swap Clubs", WS_TABSTOP | WS_VISIBLE | WS_CHILD | BS_DEFPUSHBUTTON,
                                   320, 10, 100, 30, hwnd, (HMENU)1, NULL, NULL);
            break;
        case WM_COMMAND:
            if (LOWORD(wParam) == 1) {
                OnButtonClick(hwnd);
            }
            break;
        case WM_DESTROY:
            PostQuitMessage(0);
            break;
        default:
            return DefWindowProc(hwnd, uMsg, wParam, lParam);
    }
    return 0;
}

// Main function
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    const char CLASS_NAME[] = "SampleWindowClass";

    WNDCLASS wc = {};
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = hInstance;
    wc.lpszClassName = CLASS_NAME;

    RegisterClass(&wc);

    HWND hwnd = CreateWindowEx(0, CLASS_NAME, "Club Swapper", WS_OVERLAPPEDWINDOW,
                               CW_USEDEFAULT, CW_USEDEFAULT, 450, 300, NULL, NULL, hInstance, NULL);

    if (hwnd == NULL) {
        return 0;
    }

    ShowWindow(hwnd, nCmdShow);

    MSG msg = {};
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    return 0;
}
/*his program was Built via standard programming aids4o from the prompt "Write a program in C++ that will be working in Windows. This program contains a window, large textbox in it and a button. You can write in the textbox, and after you click on the button the program opens the process in the memory called "cm0102.exe", takes the value (integer) stored at the address 00AE23B4. The program increases that value by 4. This value is the address the program will be checking Then the program takes the text written in the textbox. The program takes this text line by line. Each line should be split in two by the delimiter " - ".

When processing each line the program compares if the string at the address equals the line before the delimiter " - ". If it does not then the program increases the address by 581. And then checks if the string at this address equals the line before the delimiter " - ". If it does not equal then the program tries to do the same thing but not more than 6000 times. Once the string equals the line before delimiter " - " then the program increases address by 79 and stores the next 16 bytes starting from that address. Then the program repeats the process described in this paragraph all over again with the line after the delimiter " - " and also stores the 16 bytes.

And then the program swaps 16 bytes stored from the first time to the 16 bytes stored at the second time. It means that at the address from the first time it stores the 16 bytes stored at the second time. And vice-versa: at the address from the second time it stores the 16 bytes stored at the first time".

It didn't initially work, I had to adjust it a bit. But it didn't work not because ChatGPT did a bad jub but because the number 6000 I came up with was too low. So I changed it to 60,000 instead.

And then I've also adjusted my program to also use second names of the clubs (I didn't include that in my initial prompt).*/
