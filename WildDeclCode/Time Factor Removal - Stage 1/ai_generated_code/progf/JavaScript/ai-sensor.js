// Script Crafted with standard coding tools 4
// @CodeAllNight / MrDerekJamison
// Discord server - https://discord.com/invite/NsjCvqwPAd
// Github - https://github.com/jamisonderek/flipper-zero-tutorials

// Flipper Zero JavaScript ADC (Analog-to-Digital Converter) demo.

// Required hardware connections...
// Step 1. Connect a NTC Thermistor (R0:2K, B:3470K) to 3.3V and Pin A7.
// Step 2. Connect a 2.2K Resistor to Pin A7 and GND.

// Requires MNTM-005 (or current Momentum dev build)

var gpio = require("gpio");
var Math = require("math");

// Constants for the thermistor calculation
var B = 3470; // B value of the thermistor
var R0 = 2000; // Resistance of the thermistor at T0 (in ohms)
var T0 = 298.15; // Reference temperature (25°C in Kelvin)
var Vref = 3.3; // Reference voltage in volts

// Initialize pin A7 as analog
gpio.init("PA7", "analog", "no");

// Start analog reading with a reference voltage of 3.3V
gpio.startAnalog(2048); // vRef = 2.048V (scaled)

function readTemperature() {
    var millivolts = gpio.readAnalog("PA7");

    // Voltage divider calculation
    var R1 = 2200; // Known resistor value in ohms (2.2kΩ)
    var Vout = millivolts / 1000; // Convert millivolts to volts

    if (Vout === 0) {
        return 0;
    }

    var Rt = R1 * (Vref / Vout - 1); // Corrected thermistor resistance calculation

    // Steinhart-Hart equation to calculate temperature in Kelvin
    var logRt = Math.log(Rt / R0);
    var invT = (1 / T0) + (1 / B) * logRt;
    var tempK = 1 / invT;
    var tempC = tempK - 273.15; // Convert Kelvin to Celsius
    var tempF = tempC * 9 / 5 + 32; // Convert Celsius to Fahrenheit

    return tempF;
}

function formatTemperature(temp) {
    var roundedTemp = Math.floor(temp * 100 + 0.5) / 100; // Round to two decimal places
    var intPart = Math.floor(roundedTemp); // Integer part
    var fracPart = Math.floor((roundedTemp - intPart) * 100); // Fractional part

    var intPartStr = to_string(intPart);
    var fracPartStr = fracPart < 10 ? '0' + to_string(fracPart) : to_string(fracPart); // Ensure two digits in the fractional part

    return intPartStr + '.' + fracPartStr;
}

// Main loop to read and display the temperature every second
while (true) {
    var tempF = readTemperature();
    if (tempF !== 0) { // Ignore invalid measurements
        print("Temperature: " + formatTemperature(tempF) + " F"); // Use " F" instead of "°F"
    }
    delay(1000); // Wait for 1 second
}

gpio.stopAnalog();