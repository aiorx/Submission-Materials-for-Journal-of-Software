// this code is Produced via common programming aids-4o
// i just fed it the PDF and it wrote this code with some prompting
// but, this just works

#include <SPI.h>

#define CS_PIN D10         // Chip Select pin
#define CHIP_SIZE 1048576  // 1 MB, the size of the T25S80
#define RDSR 0x05          // Read Status Register command
#define READ 0x03          // Read Data command

void setup() {
  // Initialize Serial communication for debugging
  Serial.begin(115200);
  Serial.println();

  // Initialize the SPI bus
  SPI.begin();
  SPI.setFrequency(1000000);   // 1 MHz
  SPI.setDataMode(SPI_MODE0);  // Mode 0: CPOL = 0, CPHA = 0

  // Set CS_PIN as an output
  pinMode(CS_PIN, OUTPUT);
  digitalWrite(CS_PIN, HIGH);  // CS should start high

  Serial.println("ready");

  // Read and print the chip ID
  read_chip_ID();

  // Check if chip is ready
  while (!is_chip_ready()) {
    Serial.println("Chip is not ready!");
    delay(1000);
  }

  read_and_print_all_data();
}

void loop() {
  // Main loop does nothing
}

bool is_chip_ready() {
  digitalWrite(CS_PIN, LOW);
  SPI.transfer(RDSR);
  byte status = SPI.transfer(0x00);
  digitalWrite(CS_PIN, HIGH);
  return (status & 0x01) == 0;  // WIP bit must be 0
}

void read_chip_ID() {
  // Command to read device ID (0x9F)
  byte cmd = 0x9F;

  // Select the chip by setting CS low
  digitalWrite(CS_PIN, LOW);

  // Send the command
  SPI.transfer(cmd);

  // Read the response (3 bytes: Manufacturer ID, Memory Type, and Memory Capacity)
  byte manufacturerID = SPI.transfer(0x00);
  byte memoryType = SPI.transfer(0x00);
  byte memoryCapacity = SPI.transfer(0x00);

  // Deselect the chip by setting CS high
  digitalWrite(CS_PIN, HIGH);

  // Print the results
  Serial.print("Manufacturer ID: 0x");
  Serial.println(manufacturerID, HEX);
  Serial.print("Memory Type: 0x");
  Serial.println(memoryType, HEX);
  Serial.print("Memory Capacity: 0x");
  Serial.println(memoryCapacity, HEX);
}

void read_data_block(unsigned long address, unsigned int length) {
  // Command to read data (0x03)
  byte cmd = 0x03;

  // Select the chip by setting CS low
  digitalWrite(CS_PIN, LOW);

  // Send the command and the 24-bit address
  SPI.transfer(cmd);
  SPI.transfer((address >> 16) & 0xFF);  // Most significant byte
  SPI.transfer((address >> 8) & 0xFF);   // Middle byte
  SPI.transfer(address & 0xFF);          // Least significant byte

  // Read the data block
  for (unsigned int i = 0; i < length; i++) {
    byte data = SPI.transfer(0x00);
    Serial.print(data, HEX);
    Serial.print(" ");
  }

  // Deselect the chip by setting CS high
  digitalWrite(CS_PIN, HIGH);
  Serial.println();
}

void read_and_print_all_data() {
  Serial.println("Reading all data from T25S80...");

  for (unsigned long address = 0; address < CHIP_SIZE; address += 256) {
    read_data_block(address, 256);
  }

  Serial.println("Finished reading all data.");
}
