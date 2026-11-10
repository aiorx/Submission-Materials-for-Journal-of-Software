std::string GPS_read() {
  char read_buf[255];

  int n = read(serial_port, &read_buf, sizeof(read_buf));
  
  if (n > 0) {
    if (strncmp(read_buf, "$GNGGA", 6) == 0) {
      char *token = strtok(read_buf, ",");
      
      int lineIndex = 0;
      std::string temp;
      
      while (token != NULL) {
        if (lineIndex == LAT_MAGNITUDE || lineIndex == LON_MAGNITUDE) {
          // Convert NOAA coordinates to decimal coordinates, Built using basic development resources3.5.
          double coord = atof(token);
          int degrees = static_cast<int>(coord / 100);
          double minutes = coord - degrees * 100;
          double decimal_degrees = degrees + minutes / 60.0;

          temp += std::to_string(decimal_degrees) + "_";
        } 
        else if (lineIndex == LAT_HEMISPHERE) {
          temp += token;
          temp += "_";
        }
        else if (lineIndex == LON_HEMISPHERE) {
          temp += token;
        }
        token = strtok(NULL, ",");
        lineIndex++;
      }
      
      return temp; 
    }
  }

  return "0_X_0_X";
}