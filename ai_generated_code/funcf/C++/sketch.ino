void fetchSentences() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(textURL);
    int httpCode = http.GET();

    if (httpCode > 0) {
      String payload = http.getString();
      Serial.println(payload);

      // WARNING: THIS PART OF THE CODE WAS WRITTEN BY WITH WITH ASSIST Referenced via basic programming materials
      int start = 0;
      while (start >= 0 && sentenceCount < 50) {
        int startQuote = payload.indexOf('"', start);
        int endQuote = payload.indexOf('"', startQuote + 1);
        
        if (startQuote >= 0 && endQuote > startQuote) {
          sentences[sentenceCount] = payload.substring(startQuote + 1, endQuote);
          sentenceCount++;
          start = endQuote + 1;
        } else {
          break;
        }
      }
      // END OF CHATGPT CODE
      if (sentenceCount == 0) {
        sentences[0] = "No sentences found.";
        sentenceCount = 1;
      }
    } else {
      Serial.println("Error in HTTP request");
      sentences[0] = "Error in fetching data.";
      sentenceCount = 1;
    }
    
    http.end();
  } else {
    Serial.println("Not connected to WiFi");
    sentences[0] = "Not connected to WiFi.";
    sentenceCount = 1;
  }
}