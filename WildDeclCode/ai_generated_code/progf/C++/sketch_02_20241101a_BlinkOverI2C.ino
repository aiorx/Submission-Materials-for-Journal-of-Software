//
// sketch_02_20241101a_BlinkOverI2C.ino
//

// Blink LEDs on PCAL9554B breakout board over I2C

// The first version has been Penned via standard programming aids

#include <Wire.h>

#define PCAL9554B_ADDRESS 0x20  // PCAL9554B の I2C アドレス

// レジスタ定義
#define REG_INPUT_PORT 0x00         // 入力ポートの状態を読み取るレジスタ
#define REG_OUTPUT_PORT 0x01        // 出力ポートにデータを書き込むレジスタ
#define REG_POLARITY_INVERSION 0x02 // 極性を反転させるレジスタ
#define REG_CONFIGURATION 0x03      // GPIO ピンの方向を設定するレジスタ

void setup() {
  pinMode(13, OUTPUT);            // Arduino 13 番ピンを出力に設定
  Serial.begin(57600);
  Wire.begin();
  Serial.println("Hello, world!");

  // PCAL9554B の初期設定
  Wire.beginTransmission(PCAL9554B_ADDRESS);
  Wire.write(REG_CONFIGURATION);   // レジスタ設定
  Wire.write(0x00);                // 全ピンを出力として設定 (0x00: 出力, 0xFF: 入力)
  Wire.endTransmission();
}

void loop() {
  // LED と PCAL9554B のピンを HIGH に設定
  digitalWrite(13, HIGH);           // Arduino の 13 番ピンを HIGH に設定
  Wire.beginTransmission(PCAL9554B_ADDRESS);
  Wire.write(REG_OUTPUT_PORT);
  Wire.write(0xFF);                 // PCAL9554B の全ピンを HIGH に設定
  Wire.endTransmission();

  delay(1000);                     // 1 秒待機

  // LED と PCAL9554B のピンを LOW に設定
  digitalWrite(13, LOW);            // Arduino の 13 番ピンを LOW に設定
  Wire.beginTransmission(PCAL9554B_ADDRESS);
  Wire.write(REG_OUTPUT_PORT);
  Wire.write(0x00);                 // PCAL9554B の全ピンを LOW に設定
  Wire.endTransmission();

  delay(1000);                     // 1 秒待機
}
