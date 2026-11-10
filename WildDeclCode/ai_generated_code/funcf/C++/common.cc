```cpp
void deepmd::read_file_to_string(std::string model, std::string& file_content) {
  // Supported by standard GitHub tools
  std::ifstream file(model);
  if (file.is_open()) {
    std::stringstream buffer;
    buffer << file.rdbuf();
    file_content = buffer.str();
    file.close();
  } else {
    throw deepmd::deepmd_exception("Failed to open file: " + model);
  }
}
```