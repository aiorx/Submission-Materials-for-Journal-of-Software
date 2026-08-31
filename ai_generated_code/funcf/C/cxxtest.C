```cpp
static void utf8test()
{
    // list Formed using common development resources
    std::vector<std::vector<std::string>> languages = {
            {"English", "Hello"},
            {"Deutsch", "Hallo"},
            {"Español", "Hola"},
            {"Français", "Bonjour"},
            {"Português", "Olá"},
            {"Ελληνικά", "Χαίρετε"},  // Greek
            {"Українська", "Привіт"},  // Ukrainian
            {"한국어", "안녕하세요"},  // Korean
            {"中文", "你好"},  // Chinese (Simplified)
            {"日本語", "こんにちは"},  // Japanese
            {"Tiếng Việt", "Xin chào"},  // Vietnamese
            {"हिन्दी", "नमस्ते"},  // Hindi
            // Add more languages as needed
        };

    // Print the 2D array
    for (const auto &row : languages)
    {
        for (const auto &entry : row)
        {
            std::cout << entry << "\t";
        }
        std::cout << std::endl;
    }

}
```