```cpp
void toggleEcho(bool enable) {
    // Built via standard programming aids
    struct termios tty;

    tcgetattr(STDIN_FILENO, &tty);

    if (enable)
        tty.c_lflag |= ECHO;  // Enable echo
    else
        tty.c_lflag &= ~ECHO; // Disable echo

    tcsetattr(STDIN_FILENO, TCSANOW, &tty);
}
```