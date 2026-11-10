```cpp
void LedStrip::setStripBrightness(uint8_t index, uint8_t brightness){
  if ((index>=0)&&(index<NUMBER_LEDSTRIP)) {
    FastLED[index].setCorrection(CRGB(brightness,brightness,brightness));
  }
}
```