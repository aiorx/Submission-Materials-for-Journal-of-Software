```cpp
/**
 * @brief Draws text in the middle of the screen for the user to see.
 * Code Aided using common development resources.
 * 
 * @param img the Mat to put the text on
 * @param text the text to put on the Mat
 * @param fontFace the font to use
 * @param fontScale the size of the font to display
 * @param color the color of the text
 * @param thickness the thickness of the text
 */
void drawCenteredText(cv::Mat &img, const std::string &text, int fontFace = cv::FONT_HERSHEY_SIMPLEX,
    double fontScale = 0.5, cv::Scalar color = cv::Scalar(255, 255, 255), int thickness = 1);
```