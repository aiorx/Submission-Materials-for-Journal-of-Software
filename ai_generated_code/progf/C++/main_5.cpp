// +-------------------------------------------------------------
//
// Equipment:
// ESP32, OLED SSD1306
//
// File: main.cpp
//
// Description:
//
// file to convert char array graphics and animations into binary file
// with the help of GitHub Copilot and to get the file to be verified
//
// History:     4-Dec-2023     Scarecrow1965   Created
//
// +-------------------------------------------------------------

#include <Arduino.h>
#include <Wire.h>
#include <U8g2lib.h>
#include <Adafruit_SSD1306.h>
#include <adafruit_gfx.h>
// this set of libraries is for File manipulation
#include <SPI.h>
#include <SD.h>
#include <TimeLib.h>

// library used to sort files when listing directory
#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>

// This will enable for the OLED screen to display information
// definition of OLED display SSD1306 for Arduino Mega SCA & SDL
#define OLED_CLOCK 22 // SCA pin on Display = pin 17 (I2C_SCL) on ESP32 = GPIO 22
#define OLED_DATA 21  // SDL pin on display = pin 20 (I2C_SDA) on ESP32 = GPIO 21
// U8G2 SSD1306 Driver here to run OLED Screen
// built constructor for the OLED function
U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, OLED_CLOCK, OLED_DATA, U8X8_PIN_NONE); // This works but according to the function, it shouldn't
uint8_t oled_LineH = 0;

// #define LED_BUILTIN 2 // pin for onboard LED or use LED_BUILTIN as the default location
bool bLED = LOW;

// ADAFRUIT SSD1306 Driver here to run animation
// NOTE: confirmed by I2C Scanner address for SSD1306 is 0x3c
// NOTE: const int SSD1306_addr = 0x3c;
// to initialilze the address of the OLED display
#define SCREEN_I2C_ADDR 0x3C // or 0x3C
#define SCREEN_WIDTH 128     // OLED display width, in pixels
#define SCREEN_HEIGHT 64     // OLED display height, in pixels
#define OLED_RST_PIN -1      // Reset pin (-1 if not available)
Adafruit_SSD1306 display(128, 64, &Wire, OLED_RST_PIN);

// adding the SD card reader
#define SCK 18  // GPIO 18 = VSPI_CLK
#define MISO 19 // GPIO 19 = VSPI_MISO
#define MOSI 23 // GPIO 23 = VSPI_MOSI
#define CS 5    // GPIO 5 = VSPI_CS

// variables for calling specific files
const char *file0 = "/";
File file; // this instance is for normal file manipulation
SPIClass spi = SPIClass(VSPI);

// #include "charArrayCommon.h"
#include "charArrayAnim.h"
#include "charArrayNonAnim.h"

// ==================================
// know graphics tested and working
// ==================================
// Tracks a weighted average in order to smooth out the values that is given. Computes the FPS as the simple reciprocal
// of the amount of time taken specified by the caller. so 1/3 of a second is 3 fps. It takes about 10 frames to stabilize.
double FramesPerSecond(double seconds)
{
    static double framesPerSecond;
    framesPerSecond = (framesPerSecond * 0.9) + (1.0 / seconds * 0.1);
    return framesPerSecond;
}; // end FramesPerSecond function

void DrawLinesAndGraphicsFrame(int FramesPerSecond)
{
    u8g2.clearBuffer();
    u8g2.home();

    // Draw some text on the left hand side
    u8g2.setCursor(3, oled_LineH * 2 + 2);
    u8g2.print("Hello");
    u8g2.setCursor(3, oled_LineH * 3 + 2);
    u8g2.print("World");
    u8g2.setCursor(3, oled_LineH * 4 + 2);
    u8g2.printf("%03d \n", FramesPerSecond); // Placeholder for framerate

    u8g2.drawFrame(0, 0, u8g2.getWidth(), u8g2.getHeight()); // Draw a border around the display

    // draw a moire pattern like it's 1984
    for (int x = 0; x < u8g2.getWidth(); x += 4) // this will give me some separation of lines within the two triangles
    {
        u8g2.drawLine(x, 0, u8g2.getWidth() - x, u8g2.getHeight());
    }

    // Draw a reticle on the right hand side
    const int reticleY = u8g2.getHeight() / 2;           // Vertical center of display
    const int reticleR = u8g2.getHeight() / 4 - 2;       // Slightly less than 1/4 screen height
    const int reticleX = u8g2.getWidth() - reticleR - 8; // Right-justified with a small margin

    for (int r = reticleR; r > 0; r -= 3)
    { // draw a series of nested circles
        u8g2.drawCircle(reticleX, reticleY, r);
        u8g2.drawHLine(reticleX - reticleR - 5, reticleY, 2 * reticleR + 10); // H line through reticle center
        u8g2.drawVLine(reticleX, reticleY - reticleR - 5, 2 * reticleR + 10); // V line through reticle center
    }

    u8g2.sendBuffer(); // Send it out
} // end draw lines, graphics function

// =====================================
// LIST DIRECTORY function
// =====================================
// including functions for SD card reader
// ORIGINAL FUNCTION for ARDUINO ONLY (aka no sorting)
// void listDir(fs::FS &fs, const char *dirname, uint8_t levels)
// {
//     Serial.printf("Listing directory: %s\n", dirname);
//
//     File root = fs.open(dirname);
//     if (!root)
//     {
//         Serial.println("Failed to open directory");
//         return;
//     }
//     if (!root.isDirectory())
//     {
//         Serial.println("Not a directory");
//         return;
//     }
//
//     File file = root.openNextFile();
//     while (file)
//     {
//         if (file.isDirectory())
//         {
//             Serial.print("  DIR : ");
//             Serial.println(file.name());
//             if (levels)
//             {
//                 listDir(fs, file.name(), levels - 1);
//             }
//         }
//         else
//         {
//             Serial.print("  FILE: ");
//             Serial.print(file.name());
//             Serial.print("  SIZE: ");
//             Serial.println(file.size());
//         }
//         file = root.openNextFile();
//     }
// }; // end listDir function

// NEW FUNCTION for ESP32 ONLY
void listDir(fs::FS &fs, const char *dirname, uint8_t levels)
{
    Serial.printf("Listing directory: %s\n", dirname);

    File root = fs.open(dirname);
    if (!root)
    {
        Serial.println("Failed to open directory");
        return;
    }
    if (!root.isDirectory())
    {
        Serial.println("Not a directory");
        return;
    }

    File file = root.openNextFile();
    std::vector<String> files;
    while (file)
    {
        if (file.isDirectory())
        {
            Serial.print("  DIR : ");
            Serial.println(file.name());
            if (levels)
            {
                listDir(fs, file.name(), levels - 1);
            }
        }
        else
        {
            files.push_back(String(file.name()) + " - " + String(file.size()) + " bytes");
        }
        file = root.openNextFile();
    }
    // Sort the files
    std::sort(files.begin(), files.end());

    // Print the sorted files
    for (const String &file : files)
    {
        Serial.println(file);
    }
};

// ====================================
// MAIN SETUP FUNCTION - DO NOT DELETE
// ====================================
void setup()
{
    delay(1000); // give me time to bring up serial monitor

    Serial.begin(115200);
    Serial.println("Starting setup");

    pinMode(LED_BUILTIN, OUTPUT); // relying on GPIO2 LED to light up on MB

    // for U8G2 library setup
    u8g2.begin();
    u8g2.clear();
    u8g2.setFont(u8g2_font_profont10_tf);
    oled_LineH = u8g2.getFontAscent() + u8g2.getFontAscent();

    // for Adafruit library setup
    display.begin(SSD1306_SWITCHCAPVCC, SCREEN_I2C_ADDR);
    display.clearDisplay();

    spi.begin(SCK, MISO, MOSI, CS);

    // for SD card setup using <sd.h> library
    if (!SD.begin(CS))
    {
        Serial.println("Card Mount Failed");
        return;
    }

    uint8_t cardType = SD.cardType();

    if (cardType == CARD_NONE)
    {
        Serial.println("No SD card attached");
        return;
    }

    Serial.print("SD Card Type: ");
    if (cardType == CARD_MMC)
    {
        Serial.println("MMC");
    }
    else if (cardType == CARD_SD)
    {
        Serial.println("SDSC");
    }
    else if (cardType == CARD_SDHC)
    {
        Serial.println("SDHC");
    }
    else
    {
        Serial.println("UNKNOWN");
    }

    uint64_t cardSize = SD.cardSize() / (1024 * 1024);
    Serial.printf("SD Card Size: %lluMB\n", cardSize);
    Serial.println("Setup complete");
}; // end setup function

// ====================================
// MAIN LOOP FUNCTION - DO NOT DELETE
// ====================================
void loop()
{
    // listing the directory before the loops starts
    // this should list the files that we added from the
    // fileInput() function
    Serial.println("SD Card content before function");
    listDir(SD, file0, 0);

    if (SD.begin(CS)) // Check if the SD card is mounted successfully
    {
        fileInput(charArrayNonAnimation); // this works

        fileInput(charArrayAnimation);
    }
    else
    {
        Serial.println("Failed to mount SD card");
    }

    Serial.println("SD Card content after function");
    listDir(SD, file0, 0);

    Serial.println("Verifying all saved files");

    Serial.println("starting non animation function"); // this works
    // function to display icons
    charArray_NonAnim(); // this works

    Serial.println("starting animation function");
    // function to display animations
    verifyAllAnimations(charArrayAnimation, totalcharAnimArray);

    // start our fps tracking
    int fps = 0;

    for (;;)
    {
        bLED = !bLED; // toggle LED State
        digitalWrite(LED_BUILTIN, bLED);

        double dStart = millis() / 1000.0; // record the start time
        DrawLinesAndGraphicsFrame(fps);
        double dEnd = millis() / 1000.0; // record the completion time
        fps = FramesPerSecond(dEnd - dStart);
    }
}; // end loop function

// ====================================
// END OF PROGRAM
// ====================================
