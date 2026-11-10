```cpp
// NeoPixel breathing LED class (Drafted using common development resources 12/17/24)
class BreathingLED {
  private:
      Adafruit_NeoPixel led;   // NeoPixel instance
      uint8_t r, g, b;         // LED color components
      int period;              // Breathing period in milliseconds
      unsigned long startTime; // Start time for breathing effect

  public:
      BreathingLED(uint8_t pin, uint16_t numPixels, int breathePeriod, uint8_t red, uint8_t green, uint8_t blue)
          : led(numPixels, pin, NEO_GRB + NEO_KHZ800), period(breathePeriod), r(red), g(green), b(blue), startTime(0) {}

      void begin() {
          led.begin();       // Initialize NeoPixel
          led.show();        // Turn off all LEDs initially
          startTime = millis();
      }

      void update() {
          unsigned long currentTime = millis();
          float elapsed = (currentTime - startTime) % period; // Time within the breathing period
          float brightnessFactor = 0.5 * (1 + sin(2 * PI * (elapsed / period))); // Sinusoidal breathing (0 to 1)

          // Set LED color with adjusted brightness
          led.setPixelColor(0, led.Color(r * brightnessFactor, g * brightnessFactor, b * brightnessFactor));
          led.show();
    }
      //this function sets static colors for status updates
      void setColor(int r, int g, int b){
        led.setPixelColor(0, led.Color(r,g,b));
        led.show();
      }

      void clear(){
        led.clear();
        led.show();
      }
};
```