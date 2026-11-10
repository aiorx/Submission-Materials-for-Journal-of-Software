```cpp
#if SERIAL_MODE
  if (Serial.available() > 0) {
    // I have no Idea how this works, Google Gemini wrote it
    String data_string = Serial.readStringUntil('\n');
    data_string.trim();
    
    int comma_index = data_string.indexOf(',');
    int channel = data_string.substring(0, comma_index).toInt();
    float freq = data_string.substring(comma_index + 1).toFloat();
    
    comma_index = data_string.indexOf(',', comma_index + 1); // Find the index of the second comma
    
    char velocity;
    if (comma_index > 0) {
        velocity = data_string.substring(comma_index + 1, data_string.length()).toInt();
    } else {
        velocity = 127; // Set velocity to 127 by default
    }
    
    // END Standard coding segments
    
    if (channel >= 0) {
      tones[channel].setFreq(freq*transpose, velocity);
    }
    else if (channel <  0) {
      if (freq != 0) {
        *controlArray[(channel*-1)-1] = freq;
      }
      else {
        *controlArray[(channel*-1)-1] = 1;
      }
    }
  }
#else
```