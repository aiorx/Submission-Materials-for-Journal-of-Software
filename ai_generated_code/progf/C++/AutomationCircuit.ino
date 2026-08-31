/*
Program Briefing :
This Program is made for ESP8266 to serve the purpose of smartly controlling Relays which are supposedly are connected to LIGHT and FAN.
 - Relay1 is supposed to be connected to a Fan.
 - Relay2 is supposed to be connected to a Light.

Requirements :
1) ST7735 Display
2) ESP8266
3) DHT11 Sensor
4) 2 Relays (I'm using mechanical ones)
5) 3 Touch Sensors
6) PCF8574 GPIO Extender
7) An LDR resistor connected to a 10K Ohm resistor to create a voltage divider


Program Flow (Assisted using common GitHub development utilities) :
1. Setup hardware peripherals and display
2. Retrieve Wi-Fi credentials from EEPROM and attempt connection
    - If successful, start TCP server in client mode
    - Else, create an Access Point for configuration
3. Begin DHT sensor and monitor environmental conditions
4. Handle manual relay toggling via physical buttons
5. Listen for and process client-side commands (e.g. relay toggle, save Wi-Fi, enable AutoMode)
6. In AutoMode, evaluate sensor readings to automatically control relays
7. Display system status and sensor readings on TFT display
8. Continuously serve client connection and actuator logic inside the main loop
*/

#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <EEPROM.h>
#include <Adafruit_ST7735.h>        // Made by Adafruit
#include <CommandInterpreter.h>     // Made by me
#include <DHT.h>                    // Made by Adafruit
#include <Adafruit_PCF8574.h>       // Made by Adafruit
#include "SETTINGS.h"               // Local File, Contains all the configuration

// Structures and Classes

// Variables
Interpreter interpreter;
Adafruit_ST7735 Display = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_RESET);
Adafruit_PCF8574 ExtraPins;
DHT dht(DHT_PIN, DHT11);
WiFiServer Server(80);
WiFiClient client;

// ------ Track Variables ------ //
bool CCS = false;
bool RELAY1_ON = false;
bool RELAY2_ON = false;
bool BUTTON1_STATE = false;
bool BUTTON2_STATE = false;
bool BUTTON3_STATE = false;
bool AutoMode = false;
uint32_t frame_time = millis();
uint16_t temperature = 0;
uint16_t humidity = 0;
uint16_t light = 0;

// Functions
void exit() { while (1) yield(); }

void process_client_connection() {
  if (!CCS) {
    if (Server.hasClient()) { client = Server.accept(); CCS = true; }
  } else {
    if (client.connected() == 0) { client.stop(); CCS = false; }
  }
}

// It prints onto the tft.
void print(String str, int16_t x, int16_t y, int16_t color = 0xFFFF, int8_t size = 1, bool fill_rect = true) {
  // 7 x 5 characters
  int sizex = size * 7 + 1;
  int sizey = size * 5 + 1;
  if (fill_rect) Display.fillRect(x, y, sizex * str.length(), sizey, BACKGROUND_COLOR);

  Display.setCursor(x, y);
  Display.setTextSize(size);
  Display.setTextColor(color);
  Display.print(str.c_str());
}

// Saves the WIFI detail in EEPROM
char* saveWIFI(char** arguments) {
  EEPROM.begin(EEPROM_SIZE);

  char* SSID = arguments[0];
  char* PASS = arguments[1];

  if (SSID == nullptr || PASS == nullptr) { return (char*) "Credentials were not given."; }
  if (strlen(SSID) > MAX_STRING_SIZE - 1 || strlen(PASS) > MAX_STRING_SIZE - 1) { return (char*) "Credentials given exceed maximum characters limit."; }
  for (uint8_t i = 0; i < MAX_STRING_SIZE; i++) { EEPROM.write(i, i < strlen(SSID) ? SSID[i] : '\0'); }
  for (uint8_t i = 0; i < MAX_STRING_SIZE; i++) { EEPROM.write(MAX_STRING_SIZE + i, i < strlen(PASS) ? PASS[i] : '\0'); }

  EEPROM.commit();
  EEPROM.end();

  return (char*) "Success";
}

// sends a 16 bit value to the client
void send_u16(WiFiClient& cl, uint16_t val) {
  cl.write(val >> 8 & 0xFF);
  cl.write(val & 0xFF);
}

// Fetches the WIFI details from the EEPROM
String* readWIFI() {
  EEPROM.begin(EEPROM_SIZE);

  static String WIFI[2] = {"", ""};
  WIFI[0] = "";
  WIFI[1] = "";
  for (uint8_t i = 0; i < MAX_STRING_SIZE; i++) {
    char character = EEPROM.read(i);
    if (character != '\0') WIFI[0].concat(character);
    else break;
  }

  for (uint8_t i = 0; i < MAX_STRING_SIZE; i++) {
    char character = EEPROM.read(MAX_STRING_SIZE + i);
    if (character != '\0') WIFI[1].concat(character);
    else break;
  }

  EEPROM.end();

  return WIFI;
}

// If any command is received from the client then this function will process it.
void process_command(String command) {
  if (command.charAt(0) == 'R') {
    if (command.charAt(1) == '1') {
      RELAY1_ON = !RELAY1_ON;
    } else {
      RELAY2_ON = !RELAY2_ON;
    }
  } else if (command.charAt(0) == 'S') {
    String actualCommand = command.substring(1);
    interpreter.run(actualCommand.c_str());
  } else if (command.charAt(0) == 'A') {
    AutoMode = !AutoMode;
  } else if (command.charAt(0) == 'G') {
    send_u16(client, temperature);
    send_u16(client, humidity);
    send_u16(client, light);

    client.write(RELAY1_ON ? 0x01 : 0x00);
    client.write(RELAY2_ON ? 0x01 : 0x00);
    client.write(AutoMode ? 0x01 : 0x00);
  }
}

// this function is responsible to connect to a network and return a boolean if connected successfully.
bool try_connecting_to_network(const char* ssid, const char* pass, uint16_t timeout) {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pass);

  uint16_t start_time = millis();
  while (millis() - start_time < timeout) {
    if (WiFi.status() == WL_CONNECTED) return true;
    yield();
  }

  WiFi.disconnect(true);
  return false;
}

// It simply creates an AP
String create_AP(const char* ssid, const char* pass) {
  WiFi.softAP(ssid, pass);
  delay(1);

  return WiFi.softAPIP().toString();
}

// Place holder function
char* print_serial(char** arguments) {
  Serial.println(arguments[0]);
  return (char*) "Success";
}

// Main Program Code
void setup() {
  // Initializing Serial //
  Serial.begin(115200);
  delay(1);

  // Initializing ST7735 Display //
  Display.initR(INITR_BLACKTAB);
  Display.setRotation(3);
  Display.fillScreen(0x0000);

  // Initializing PCF8574 Module //
  if (!ExtraPins.begin(0x20, &Wire)) exit();
  ExtraPins.pinMode(RELAY1, OUTPUT);
  ExtraPins.pinMode(RELAY2, OUTPUT);
  ExtraPins.pinMode(BUTTON1, INPUT);
  ExtraPins.pinMode(BUTTON2, INPUT);
  ExtraPins.pinMode(BUTTON3, INPUT);

  // Loading the interpreter with some commands //
  interpreter.addCommand("PRINT", print_serial);
  interpreter.addCommand("WIFI_SAVE", saveWIFI);

  // Starting DHT Sensor //
  pinMode(DHT_PIN, INPUT_PULLUP);
  dht.begin();

  // Connect to WiFi //
  String* Wifi = readWIFI();
  Serial.println(Wifi[0]);
  Serial.println(Wifi[1]);

  if (!try_connecting_to_network(Wifi[0].c_str(), Wifi[1].c_str(), 10000)) {
    Serial.println("Connection to WiFi failed.");
    Serial.println("Started AP.");

    create_AP("ESP8266_HOTSPOT", "12345678");
    print(WiFi.softAPIP().toString(), 0, 110);
  } else {
    Serial.println("Connected to WiFi.");
    Serial.println(WiFi.localIP());

    print(WiFi.localIP().toString(), 0, 110);
  }

  // Run Server //
  Server.begin();
}

// First we will see hardware input.
// Then we will see Server input.
void loop() {
  // Check for any clients.
  process_client_connection();

  // Gather information
  temperature = dht.readTemperature();  
  humidity = dht.readHumidity();
  light = analogRead(LDR_PIN);

  // Check for button presses by detecting a falling edge.
  bool b1 = false;
  bool b2 = false;
  bool b3 = false;
  if (!AutoMode) 
  {
    if ((b1 = ExtraPins.digitalRead(BUTTON1)) == false) {
      if (BUTTON1_STATE == true && b1 == false) {
        Serial.println("Button 1 pressed.");
        RELAY1_ON = !RELAY1_ON;
      }
    }
    if ((b2 = ExtraPins.digitalRead(BUTTON2)) == false) {
      if (BUTTON2_STATE == true && b2 == false) {
        Serial.println("Button 2 pressed.");
        RELAY2_ON = !RELAY2_ON;
      }
    }
  }

  if ((b3 = ExtraPins.digitalRead(BUTTON3)) == false) {
    if (BUTTON3_STATE == true && b3 == false) {
      Serial.println("Button 3 pressed.");
      AutoMode = !AutoMode;
      if (AutoMode) { b1 = false; b2 = false; }
    }
  }

  BUTTON1_STATE = b1;
  BUTTON2_STATE = b2;
  BUTTON3_STATE = b3;

  // Checks for any data from Client.
  if (CCS) {
    if (client.available() > 2) {
      String input = client.readStringUntil('.');
      process_command(input);
    }
  }

  // AutoMode smartly turns on or off the relays.
  if (AutoMode) {
    if (temperature > TEMPERATURE_THRESHHOLD) {
      RELAY1_ON = true;
    } else {
      RELAY1_ON = false;
    }

    if (light < LIGHT_INTENSITY_THRESHHOLD) {
      RELAY2_ON = true;
    } else {
      RELAY2_ON = false;
    }
  }

  // Print the information to TFT.
  if (millis() - frame_time > 50) {
    print("Temp - " + String(temperature), 0, 0); 
    print("Humidity - " + String(humidity), 0, 15);
    print("Analog Light - " + String(light), 0, 30);
    print(String("RELAY1 : ") + (RELAY1_ON ? "ON" : "OFF"), 0, 45);
    print(String("RELAY2 : ") + (RELAY2_ON ? "ON" : "OFF"), 0, 60);
    print(String("AutoMode : ") + (AutoMode ? "ON" : "OFF"), 0, 75);

    if (CCS) {
      print("Client : Connected", 0, 100);
    } else {
      print("Client : Not Connected", 0, 100);    
    }

    frame_time = millis();
  }

  // Run the actuators
  ExtraPins.digitalWrite(RELAY1, RELAY1_ON);
  ExtraPins.digitalWrite(RELAY2, RELAY2_ON);
}
