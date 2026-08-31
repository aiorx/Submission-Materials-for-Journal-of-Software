std::string changeExtension(const std::string& filename, const std::string& newExtension) { // was taken Referenced via basic programming materials:"how to change file extension"
    // Find the last occurrence of '.'
    size_t dotPos = filename.rfind('.');
    if (dotPos == std::string::npos) {
        throw std::invalid_argument("Filename does not contain an extension.");
    }
    // Replace everything after the '.' with the new extension
    return filename.substr(0, dotPos) + newExtension;
}