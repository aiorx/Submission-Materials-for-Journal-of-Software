```cpp
void LOLIN_EPD::sendCmd(uint8_t c)
{
  // SPI
  csHigh();
  dcLow();
  csLow();

  uint8_t data = fastSPIwrite(c);

  csHigh();
}
```