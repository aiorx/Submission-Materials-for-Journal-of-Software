//************FUNCTION Aided using common development resources************
void buttonInterrupt() {
  unsigned long currentTime = millis();
  if (currentTime - lastButtonTime > 200) {
    buttonFlag = true;
    lastButtonTime = currentTime;
  }
}