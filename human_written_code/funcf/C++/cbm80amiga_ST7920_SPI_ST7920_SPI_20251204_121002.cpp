```cpp
void ST7920_SPI::drawLineHfast(uint8_t x0, uint8_t x1, uint8_t y, uint8_t col) {
  if (y >= scrHt) return;
  if (x0 > x1) {
    uint8_t t = x0; x0 = x1; x1 = t;
  }
  if (x1 >= SCR_WD) x1 = SCR_WD - 1;
  uint8_t *p = scr + y * scrWd;
  uint8_t m0 = 0xFF >> (x0 & 7);
  uint8_t m1 = 0xFF << (7 - (x1 & 7));
  uint8_t i0 = x0 >> 3;
  uint8_t i1 = x1 >> 3;
  if (i0 == i1) {
    uint8_t m = m0 & m1;
    if (col) p[i0] |= m; else p[i0] &= ~m;
  } else {
    if (col) {
      p[i0] |= m0;
      for (uint8_t i = i0 + 1; i < i1; i++) p[i] = 0xFF;
      p[i1] |= m1;
    } else {
      p[i0] &= ~m0;
      for (uint8_t i = i0 + 1; i < i1; i++) p[i] = 0x00;
      p[i1] &= ~m1;
    }
  }
}
```