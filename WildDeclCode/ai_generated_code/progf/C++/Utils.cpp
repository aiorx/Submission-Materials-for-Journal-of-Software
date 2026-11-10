#include "Utils.h"

/**
 * @brief Moves the console cursor to the specified position.
 * @param pos The coordinates to move the cursor to.
 * @note Created by Amir Kirsh
 */
void gotoxy(Coordinates pos) {
    std::cout.flush();
    COORD coord; // Create a COORD structure
    coord.X = pos.x;
    coord.Y = pos.y;
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord); // move the cursor
}

/**
 * @brief Moves the console cursor to the specified position.
 * @param x The x-coordinate to move the cursor to.
 * @param y The y-coordinate to move the cursor to.
 * @note Created by Amir Kirsh
 */
void gotoxy(int x, int y) {
	gotoxy({ x, y }); // Delegate to the other gotoxy method
}

/**
 * @brief Shows or hides the console cursor based on the flag parameter.
 * @param flag If true, the cursor is shown; if false, the cursor is hidden.
 * @note Created by Amir Kirsh
 */
void show_cursor(bool flag) {
    HANDLE out = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO cursorInfo;
    GetConsoleCursorInfo(out, &cursorInfo);
    cursorInfo.bVisible = flag; // Set the cursor visibility
    SetConsoleCursorInfo(out, &cursorInfo); // Set the cursor info
}

/**
 * @brief Gets a character from a specific console screen buffer location.
 * @param pos The coordinates to get the character from.
 * @return The character at the specified position, or Board::ERR if an error occurs.
 * @note Constructed via standard GitHub programming aids
 */
char getch_console(Coordinates pos) {

    char ch;

    if (display_flag) {
        HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
        if (hConsole == INVALID_HANDLE_VALUE) {
            return Board::ERR;
        }

        CHAR_INFO charInfo;
        COORD coord = { (SHORT)pos.x, (SHORT)pos.y };
        SMALL_RECT readRegion = { (SHORT)pos.x, (SHORT)pos.y, (SHORT)pos.x, (SHORT)pos.y };
        COORD bufferSize = { 1, 1 };

        if (!ReadConsoleOutput(hConsole, &charInfo, bufferSize, { 0, 0 }, &readRegion) || !Board::pos_inbound(pos)) {
            return Board::ERR;
        }
        ch = charInfo.Char.AsciiChar;
    }
    else {
		ch = current_screen[pos.y][pos.x];
    }
    return ch;
}

/**
 * @brief Clears the console screen.
 * @note Constructed via standard GitHub programming aids
 */
void clear_screen() {

    if (display_flag) {
        HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
        if (hConsole == INVALID_HANDLE_VALUE) {
            return;
        }

        CONSOLE_SCREEN_BUFFER_INFO csbi;
        DWORD count;
        DWORD cellCount;
        COORD homeCoords = { 0, 0 };

        if (!GetConsoleScreenBufferInfo(hConsole, &csbi)) {
            return;
        }

        cellCount = csbi.dwSize.X * csbi.dwSize.Y;

        if (!FillConsoleOutputCharacter(hConsole, (TCHAR)' ', cellCount, homeCoords, &count)) {
            return;
        }

        if (!FillConsoleOutputAttribute(hConsole, csbi.wAttributes, cellCount, homeCoords, &count)) {
            return;
        }

        SetConsoleCursorPosition(hConsole, homeCoords);
    }
    else {
        for (int i = 0; i < SCREEN_HEIGHT; i++) {
            for (int j = 0; j < SCREEN_WIDTH; j++) {
                current_screen[i][j] = ' ';
            }
        }
    }
}

/**
 * @brief Removes the extension from a filename.
 * @param filename The filename to process.
 * @return The filename without the extension.
 */
std::string remove_ext(const std::string& filename) {
    size_t last_dot = filename.find_last_of('.');
    if (last_dot == std::string::npos) {
        return filename; // Return the original filename if no dot is found
    }
    return filename.substr(0, last_dot); // Return the filename without the extension
}

/**
 * @brief Removes the specified extension from a filename.
 * @param filename The filename to process.
 * @param toremove The extension to remove.
 * @return The filename without the specified extension.
 */
std::string remove_ext(const std::string& filename, const std::string& toremove) {
    size_t pos = filename.rfind(toremove);
    if (pos != std::string::npos && pos == filename.length() - toremove.length()) {
        return filename.substr(0, pos); // Return the filename without the specified extension
    }
    return filename; // Return the original filename if the extension is not found
}

// Flag to display the screen layout
bool display_flag = true;

// Current screen layout
char current_screen[SCREEN_HEIGHT][SCREEN_WIDTH + 1];


// Overloads the comparison operators for the Ctrl enum class
bool operator != (const char& lhs, const Ctrl& rhs) {
	return !(lhs == static_cast<char>(rhs));
}
bool operator != (const Ctrl& lhs, const char& rhs) {
	return !(static_cast<char>(lhs) == rhs);
}
bool operator == (const char& lhs, const Ctrl& rhs) {
	return lhs == static_cast<char>(rhs);
}
bool operator == (const Ctrl& lhs, const char& rhs) {
	return static_cast<char>(lhs) == rhs;
}
bool operator < (const char& lhs, const Ctrl& rhs) {
	return lhs < static_cast<char>(rhs);
}
bool operator < (const Ctrl& lhs, const char& rhs) {
	return static_cast<char>(lhs) < rhs;
}
bool operator > (const char& lhs, const Ctrl& rhs) {
	return lhs > static_cast<char>(rhs);
}
bool operator > (const Ctrl& lhs, const char& rhs) {
	return static_cast<char>(lhs) > rhs;
}
bool operator <= (const char& lhs, const Ctrl& rhs) {
	return lhs <= static_cast<char>(rhs);
}
bool operator <= (const Ctrl& lhs, const char& rhs) {
	return static_cast<char>(lhs) <= rhs;
}
bool operator >= (const char& lhs, const Ctrl& rhs) {
	return lhs >= static_cast<char>(rhs);
}
bool operator >= (const Ctrl& lhs, const char& rhs) {
	return static_cast<char>(lhs) >= rhs;
}


