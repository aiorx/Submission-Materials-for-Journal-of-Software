```c
void goToHwSerial() {
    Serial.println("go to hwSerial");
    Serial1.begin(57600);
    while (!Serial1) {
        ; // wait for serial port to connect. Needed for native USB port only
    }
    Serial.println("Found fingerprint sensor!");
    Serial.println("Ready to match 1:1 a fingerprint!");
    Serial.println("Please type in the ID # (from 1 to 127) you want to match...");
}
```