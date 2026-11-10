```c
void Rotary::process() {
  unsigned char pinstate = 0;

  if (digitalRead(pin1)) pinstate |= 0x01;
  if (digitalRead(pin2)) pinstate |= 0x02;

  state = ttable[state & 0xf][pinstate];

  if (state & DIR_CW) {
    value++;
    if (value > max) value = max;
  }
  else if (state & DIR_CCW) {
    value--;
    if (value < min) value = min;
  }
}
```