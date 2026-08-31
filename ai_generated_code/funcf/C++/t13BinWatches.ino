uint8_t Time(uint8_t currState) {
  uint8_t LEDValue = 0;
  switch (currState) {  //Final state machine
    case 0:
      if (!MSec) {  // protect divide by zero(if MSec not = 0), thanks ChatGPT
        Hours = 0;
      } else {
        Hours = MSec / 3600000;  // 3600 sec per hour * 1000(ms)
      }

      if (Hours == 0) {
        LEDValue = 12;  //
      } else {
        LEDValue = Hours;
      }
      DDRB = 0b1111;  // Turn on ouptuts

      currState = 1;  // Next state
      break;

    case 1:
      if (!MSec) {  // protect divide by zero, thanks ChatGPT
        Minutes = 0;
      } else {
        Minutes = ((MSec / 60000) % 60) / 5;  // 60 Seconds per minutes(5 min to discrete)
      }

      LEDValue = Minutes;

      currState = 2;
      break;

    case 2:
      LEDValue = 0;
      DDRB = 0b0000;  // Turn off outputs(Hi-Z state) for low consumption
      currState = 0;
      break;

    default:
      return -1;  // some wrong
  }

  PORTB = LEDValue;  // Set Port B to LEDValue
  return currState;
}