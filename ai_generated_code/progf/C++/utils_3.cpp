#include <utils.hpp>

#if defined(LINUX_PLATFORM) || defined(MAC_PLATFORM)
void miscellaneous::wait(unsigned int durationInMs) {
    sleep(durationInMs / 1000);
}
#elif defined(WINDOWS_PLATFORM)
void miscellaneous::wait(unsigned int durationInMs) { Sleep(durationInMs); }

#else
#error "Unsupported Platform!"

#endif

string string_utils::kebabToPascal(const string &str) noexcept {
    return kebabToPascal(str, true);
}

string string_utils::kebabToPascal(const string &str,
                                   const bool addSpace) noexcept {
    stringstream res;

    for (size_t i = 0, l = str.size(); i < l; ++i) {
        const char &ch = str.at(i);

        if (i == 0) {
            res << static_cast<char>(toupper(ch));

            continue;
        } else if (ch == '-') {
            try {
                const char &ch2 = str.at(++i);

                if (addSpace) {
                    res << " ";
                }

                res << static_cast<char>(toupper(ch2));
            } catch (const out_of_range &) {
            }

            continue;
        }

        res << ch;
    }

    return res.str();
}

// Derived using common development resources
string string_utils::genRandomID(size_t length) {
    static const string characters =
        "abcdefghijklmnopqrstuvwxyz"
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "0123456789";
    static int s = static_cast<int>(characters.size());
    random_device rd;         // Seed for random number engine
    mt19937 generator(rd());  // Mersenne Twister engine
    uniform_int_distribution<> distribution(0, s - 1);

    string randomString;

    for (size_t i = 0; i < length; ++i) {
        randomString += characters.at(distribution(generator));
    }

    return randomString;
}

// Derived using common development resources
size_t string_utils::numOfUtf8Chars(const string &str) {
    size_t count = 0;

    for (size_t i = 0, l = str.size(); i < l;) {
        unsigned char c = str.at(i);

        if ((c & 0x80) == 0) {
            ++i;
        } else if ((c & 0xE0) == 0xC0) {
            i += 2;
        } else if ((c & 0xF0) == 0xE0) {
            i += 3;
        } else if ((c & 0xF8) == 0xF0) {
            i += 4;
        } else {
            throw logic_error("Invalid UTF-8 encoding");
        }

        count += 1;
    }

    return count;
}

void terminal::moveCursorTo(const unsigned int col) noexcept {
    cout << ESC << (col) << "G";
}
void terminal::moveCursorTo(const unsigned int col,
                            const unsigned int row) noexcept {
    cout << ESC << (row) << SEP << (col + 1) << "H";
}
void terminal::moveCursorTo(ostringstream *buf,
                            const unsigned int col) noexcept {
    *buf << ESC << (col) << "G";
}
void terminal::moveCursorTo(ostringstream *buf, const unsigned int col,
                            const unsigned int row) noexcept {
    *buf << ESC << (row) << SEP << (col + 1) << "H";
}
void terminal::moveCursor(const int cols) noexcept {
    if (cols < 0) {
        cout << ESC << (cols * -1) << "D";
    } else if (cols > 0) {
        cout << ESC << cols << "C";
    }
}
void terminal::moveCursor(const int cols, const int rows) noexcept {
    moveCursor(cols);

    if (rows < 0) {
        cout << ESC << (rows * -1) << "A";
    } else if (rows > 0) {
        cout << ESC << rows << "B";
    }
}
void terminal::moveCursor(ostringstream *buf, const int cols) noexcept {
    if (cols < 0) {
        *buf << ESC << (cols * -1) << "D";
    } else if (cols > 0) {
        *buf << ESC << cols << "C";
    }
}
void terminal::moveCursor(ostringstream *buf, const int cols,
                          const int rows) noexcept {
    moveCursor(buf, cols);

    if (rows < 0) {
        *buf << ESC << (rows * -1) << "A";
    } else if (rows > 0) {
        *buf << ESC << rows << "B";
    }
}
void terminal::moveCursorUp(const unsigned int amount = 1) noexcept {
    cout << ESC << amount << "A";
}
void terminal::moveCursorUp(ostringstream *buf,
                            const unsigned int amount = 1) noexcept {
    *buf << ESC << amount << "A";
}
void terminal::moveCursorDown(const unsigned int amount = 1) noexcept {
    cout << ESC << amount << "B";
}
void terminal::moveCursorDown(ostringstream *buf,
                              const unsigned int amount = 1) noexcept {
    *buf << ESC << amount << "B";
}
void terminal::moveCursorRight(const unsigned int amount = 1) noexcept {
    cout << ESC << amount << "C";
}
void terminal::moveCursorRight(ostringstream *buf,
                               const unsigned int amount = 1) noexcept {
    *buf << ESC << amount << "C";
}
void terminal::moveCursorLeft(const unsigned int amount = 1) noexcept {
    cout << ESC << amount << "D";
}
void terminal::moveCursorLeft(ostringstream *buf,
                              const unsigned int amount = 1) noexcept {
    *buf << ESC << amount << "D";
}
void terminal::moveCursorToStartOfCurrLine() noexcept { cout << ESC << "G"; }
void terminal::moveCursorToStartOfCurrLine(ostringstream *buf) noexcept {
    *buf << ESC << "G";
}
void terminal::moveCursorToStartOfNextLine(
    const unsigned int amount = 1) noexcept {
    cout << ESC << amount << "E";
}
void terminal::moveCursorToStartOfNextLine(
    ostringstream *buf, const unsigned int amount = 1) noexcept {
    *buf << ESC << amount << "E";
}
void terminal::moveCursorToStartOfPrevLine(
    const unsigned int amount = 1) noexcept {
    cout << ESC << amount << "F";
}
void terminal::moveCursorToStartOfPrevLine(
    ostringstream *buf, const unsigned int amount = 1) noexcept {
    *buf << ESC << amount << "F";
}
void terminal::saveCursorPosition() noexcept { cout << ESC << "s"; }
void terminal::saveCursorPosition(ostringstream *buf) noexcept {
    *buf << ESC << "s";
}
void terminal::restoreSavedCursorPosition() noexcept { cout << ESC << "u"; }
void terminal::restoreSavedCursorPosition(ostringstream *buf) noexcept {
    *buf << ESC << "u";
}
void terminal::hideCursor() noexcept { cout << ESC << "?25l"; }
void terminal::hideCursor(ostringstream *buf) noexcept {
    *buf << ESC << "?25l";
}
void terminal::showCursor() noexcept { cout << ESC << "?25h"; }
void terminal::showCursor(ostringstream *buf) noexcept {
    *buf << ESC << "?25h";
}
void terminal::clearFromCursorToEndOfLine() noexcept { cout << ESC << "K"; }
void terminal::clearFromCursorToEndOfLine(ostringstream *buf) noexcept {
    *buf << ESC << "K";
}
void terminal::clearFromCursorToStartOfLine() noexcept { cout << ESC << "1K"; }
void terminal::clearFromCursorToStartOfLine(ostringstream *buf) noexcept {
    *buf << ESC << "1K";
}
void terminal::clearLine() noexcept { cout << ESC << "2K"; }
void terminal::clearLine(ostringstream *buf) noexcept { *buf << ESC << "2K"; }
void terminal::clearLinesFromCursorToEndOfLine(const unsigned int amount = 1) {
    assert(amount > 0 ||
                           !"terminal::clearLinesFromCursorToEndOfLine() "
                           "received a non-positive integer amount");

    for (unsigned int i = 0, l = amount - 1; i < l; ++i) {
        clearFromCursorToEndOfLine();
        moveCursorUp();
    }

    clearFromCursorToEndOfLine();
    moveCursorToStartOfCurrLine();
}
void terminal::clearLinesFromCursorToEndOfLine(ostringstream *buf,
                                               const unsigned int amount = 1) {
    assert(amount > 0 ||
           !"terminal::clearLinesFromCursorToEndOfLine() "
           "received a non-positive integer amount");

    for (size_t i = 0, l = amount - 1; i < l; ++i) {
        clearFromCursorToEndOfLine(buf);
        moveCursorUp(buf);
    }

    clearFromCursorToEndOfLine(buf);
    moveCursorToStartOfCurrLine(buf);
}
void terminal::clearLinesFromCursorToStartOfLine(
    const unsigned int amount = 1) {
    assert(amount > 0 ||
                           !"terminal::clearLinesFromCursorToStartOfLine() "
                           "received a non-positive integer amount");

    for (unsigned int i = 0, l = amount - 1; i < l; ++i) {
        clearFromCursorToStartOfLine();
        moveCursorUp();
    }

    clearFromCursorToStartOfLine();
    moveCursorToStartOfCurrLine();
}
void terminal::clearLinesFromCursorToStartOfLine(
    ostringstream *buf, const unsigned int amount = 1) {
    assert(amount > 0 ||
                           !"terminal::clearLinesFromCursorToStartOfLine() "
                           "received a non-positive integer amount");

    for (unsigned int i = 0, l = amount - 1; i < l; ++i) {
        clearFromCursorToStartOfLine(buf);
        moveCursorUp(buf);
    }

    clearFromCursorToStartOfLine(buf);
    moveCursorToStartOfCurrLine(buf);
}
void terminal::clearLines(const unsigned int amount = 1) {
    assert(amount > 0 ||
           !"terminal::clearLines() received a non-positive integer amount");

    for (unsigned int i = 0, l = amount - 1; i < l; ++i) {
        clearLine();
        moveCursorUp();
    }

    clearLine();
    moveCursorToStartOfCurrLine();
}
void terminal::clearLines(ostringstream *buf, const unsigned int amount = 1) {
    assert(amount > 0 ||
           !"terminal::clearLines() received a non-positive integer amount");

    for (unsigned int i = 0, l = amount - 1; i < l; ++i) {
        clearLine(buf);
        moveCursorUp(buf);
    }

    clearLine(buf);
    moveCursorToStartOfCurrLine(buf);
}
void terminal::clearFromCursorToEndOfScreen() noexcept { cout << ESC << "J"; }
void terminal::clearFromCursorToEndOfScreen(ostringstream *buf) noexcept {
    *buf << ESC << "J";
}
void terminal::clearFromCursorToStartOfScreen() noexcept {
    cout << ESC << "1J";
}
void terminal::clearFromCursorToStartOfScreen(ostringstream *buf) noexcept {
    *buf << ESC << "1J";
}
void terminal::clearScreen() noexcept {
    cout << ESC << "2J" << ESC << "3J" << ESC << "H";
}
void terminal::clearScreen(ostringstream *buf) noexcept {
    *buf << ESC << "2J" << ESC << "3J" << ESC << "H";
}
void terminal::enterAltScreen() noexcept { cout << ESC << "?1049h"; }
void terminal::exitAltScreen() noexcept { cout << ESC << "?1049l"; }
void terminal::disableTextWrapping() noexcept { cout << ESC << "?7l"; }
void terminal::enableTextWrapping() noexcept { cout << ESC << "?7h"; }
tuple<unsigned int, unsigned int> terminal::getCursorPosition() {
    cout << ESC << "6n";

    string res;
    unsigned int ch = getPressedKeyCode();

    while (ch) {
        if (ch == KEY_R) {
            break;
        }

        res += static_cast<char>(ch);
        ch = getPressedKeyCode();
    }

    unsigned int row = 0, col = 0;

    if (sscanf(res.c_str(), "\033[%d;%d", &row, &col) == 2) {
        return {row, col};
    } else {
        throw logic_error("Failed to get cursor position");
    }
}
void terminal::textReset() noexcept { cout << ESC << "0m"; }
void terminal::textReset(ostringstream *buf) noexcept { *buf << ESC << "0m"; }
void terminal::textBold() noexcept { cout << ESC << "1m"; }
void terminal::textBold(ostringstream *buf) noexcept { *buf << ESC << "1m"; }
void terminal::textRemoveBold() noexcept { cout << ESC << "21m"; }
void terminal::textRemoveBold(ostringstream *buf) noexcept {
    *buf << ESC << "21m";
}
void terminal::textDim() noexcept { cout << ESC << "2m"; }
void terminal::textDim(ostringstream *buf) noexcept { *buf << ESC << "2m"; }
void terminal::textNormal() noexcept { cout << ESC << "22m"; }
void terminal::textNormal(ostringstream *buf) noexcept { *buf << ESC << "22m"; }
void terminal::textStrikethrough() noexcept { cout << ESC << "9m"; }
void terminal::textStrikethrough(ostringstream *buf) noexcept {
    *buf << ESC << "9m";
}
void terminal::textRemoveStrikethrough() noexcept { cout << ESC << "29m"; }
void terminal::textRemoveStrikethrough(ostringstream *buf) noexcept {
    *buf << ESC << "29m";
}
void terminal::textItalic() noexcept { cout << ESC << "3m"; }
void terminal::textItalic(ostringstream *buf) noexcept { *buf << ESC << "3m"; }
void terminal::textRemoveItalic() noexcept { cout << ESC << "23m"; }
void terminal::textRemoveItalic(ostringstream *buf) noexcept {
    *buf << ESC << "23m";
}
void terminal::textUnderline() noexcept { cout << ESC << "4m"; }
void terminal::textUnderline(ostringstream *buf) noexcept {
    *buf << ESC << "4m";
}
void terminal::textRemoveUnderline() noexcept { cout << ESC << "24m"; }
void terminal::textRemoveUnderline(ostringstream *buf) noexcept {
    *buf << ESC << "24m";
}
void terminal::textBackground(const uint8_t r = 0, const uint8_t g = 0,
                              const uint8_t b = 0) noexcept {
    cout << ESC << "48" << SEP << "2" << SEP << int(r) << SEP << int(g) << SEP
         << int(b) << "m";
}
void terminal::textBackground(ostringstream *buf, const uint8_t r = 0,
                              const uint8_t g = 0,
                              const uint8_t b = 0) noexcept {
    *buf << ESC << "48" << SEP << "2" << SEP << int(r) << SEP << int(g) << SEP
         << int(b) << "m";
}
void terminal::textForeground(const uint8_t r = 255, const uint8_t g = 255,
                              const uint8_t b = 255) noexcept {
    cout << ESC << "38" << SEP << "2" << SEP << int(r) << SEP << int(g) << SEP
         << int(b) << "m";
}
// The buffer needs to recognie uint8_t as int() or else it's essentially a
// unsigned char and not a number
void terminal::textForeground(ostringstream *buf, const uint8_t r = 255,
                              const uint8_t g = 255,
                              const uint8_t b = 255) noexcept {
    *buf << ESC << "38" << SEP << "2" << SEP << int(r) << SEP << int(g) << SEP
         << int(b) << "m";
}
