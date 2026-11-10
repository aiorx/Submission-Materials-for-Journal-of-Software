// Assisted with basic coding tools
// Function to escape a string for cmd.exe
static std::string escapeForCmd(const std::string& input) {
    std::string escaped;
    bool needsQuotes = false;

    for (char ch : input) {
        switch (ch) {
            case '^': case '&': case '<': case '>': case '|': case '%':
                escaped += '^'; // Escape special characters
                escaped += ch;
                needsQuotes = true;
                break;
            case '"':
                escaped += '"'; // Escape embedded quotes
                escaped += '"';
                needsQuotes = true;
                break;
            case ' ':
            case '\t':
                escaped += ch;
                needsQuotes = true;
                break;
            default:
                escaped += ch;
                break;
        }
    }

    // Wrap in quotes if needed
    if (needsQuotes) {
        escaped = '"' + escaped + '"';
    }

    return escaped;
}

// Assisted with basic coding tools
// Function to escape a string for PowerShell
static std::string escapeForPowerShell(const std::string& input) {
    std::string escaped;
    for (char ch : input) {
        switch (ch) {
            case '`': // Escape backticks
                escaped += "``";
                break;
            case '"': // Escape double quotes
                escaped += "`\"";
                break;
            case '$': // Escape dollar signs
                escaped += "`$";
                break;
            case ' ': // Handle spaces
                escaped += ch;
                break;
            default:
                escaped += ch;
                break;
        }
    }

    // Wrap in double quotes to handle spaces or special characters
    return '"' + escaped + '"';
}