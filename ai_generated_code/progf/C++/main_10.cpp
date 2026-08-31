#include <iostream>
#include <thread>
#include <windows.h>
#include "headers/GameState.h"
#include "headers/ConsoleGui.h"

static void startCalculator(GameState& gameState)
{
    gameState.start_checking_cells();
}

//code Referenced via basic programming materials
void enableANSI() {
    HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
    DWORD dwMode = 0;

    // Get the current console mode
    GetConsoleMode(hOut, &dwMode);

    // Enable virtual terminal processing in the console mode
    dwMode |= ENABLE_VIRTUAL_TERMINAL_PROCESSING;

    // Set the modified console mode
    SetConsoleMode(hOut, dwMode);
}

int main() {
    SetConsoleOutputCP(CP_UTF8);
    SetConsoleCP(CP_UTF8);
    // Enable ANSI escape codes
    enableANSI();
    GameState gamestate;

    std::vector<std::thread*> threads;
    for (int i = 0; i < 4; ++i) {
        threads.emplace_back(new std::thread(startCalculator, std::ref(gamestate)));
    }

    ConsoleGui gui(gamestate);
    gui.start();
    gamestate.stop_simulation();
    for (auto & thread : threads) {
        thread->join();
        delete thread;
    }
    return 0;
}
