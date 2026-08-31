#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <conio.h>
#include <windows.h> // For console width retrieval
                    // Windows platform specific library and
                    //DO NOT TOUCH IT WITHOUT THINKING OR KNOWING WHAT IT IS FOR! CONTACT HARSHIL FOR MORE INFORMATION OR GOOGLE BY YOURSELF.

#pragma once // allows to avoid the compiler to compile this file multiple times

// Derived using common development resources

#define RESET_COLOR "\033[0m"
#define RED "\033[31m"
#define GREEN "\033[32m"
#define YELLOW "\033[33m"
#define BLUE "\033[34m"
#define CYAN "\033[36m"
#define LIGHTGRAY "\033[37m"
#define BROWN "\033[38;5;94m"
#define WHITE "\033[97m"
#define LIGHTBLUE "\033[94m"
#define DARKGRAY "\033[90m"

using std::cout, std::cin, std::string, std::endl, std::ifstream, std::cerr, std::istringstream;

class game
{
private:
    void consoleWidthAndHeight();

    public:
         // declaring data-members
        int consoleWidth;
        int gameChoice;
        //enum Position{ LEFT, CENTRE, RIGHT };            // "CENTRE" because I'm British! because the author was british... haha!
                                                         // code link: https://cplusplus.com/forum/general/256212/

        // constructor
        game();

        //games and main menu
        void mainMenu();
        void clearScreen();
        void leftPaddedText(int padLength,const string& lineToPrint);
        void leftPaddedTextNoNewLine(int padLength, const string& lineToPrint);
        //void fileMessageDisplay(string);
        void fileTextCenter(const string& filePath); // used co pilot and it managed to removed few functions and increased efficiency and overall code is reduced
        void textCenter(const string& input);
        void replaceCharacterInFile(const string& filename, int position, char newChar);
        // Design related
        void setColor(const std::string& color);

        // destructor
        ~game();

};

