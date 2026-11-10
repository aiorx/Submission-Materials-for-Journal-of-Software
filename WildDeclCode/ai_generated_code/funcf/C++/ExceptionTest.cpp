```cpp
// removeANSIEscapeCodes is Assisted with basic coding tools
// Request:
// write C++ code using boost::regex for removing ANSI escape codes from provided std::string
std::string removeANSIEscapeCodes(const std::string& input) {
    boost::regex pattern("\x1B\\[[0-9;]*[mK]");
    return boost::regex_replace(input, pattern, "");
}
```