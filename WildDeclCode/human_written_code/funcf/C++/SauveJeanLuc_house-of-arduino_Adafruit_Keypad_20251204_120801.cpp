```cpp
volatile byte *Adafruit_Keypad::getKeyState(byte key) {
  for (int i = 0; i < _numRows * _numCols; i++) {
    if (_userKeymap[i] == key) {
      return _keystates + i;
    }
  }
  return NULL;
}
```