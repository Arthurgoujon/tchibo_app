void receiveInputFromSerial() {
  static byte ndx = 0;
  char endMarker = '\n';
  char rc;
  while (Serial.available() > 0 && newData == false) {
    rc = Serial.read();
    if (rc != endMarker) {
      receivedChars[ndx] = rc;
      ndx++;
      if (ndx >= numChars) {
        ndx = numChars - 1;
      }
    }
    else {
      receivedChars[ndx] = '\0'; // terminate the string
      ndx = 0;
      newData = true;
    }
  }
  if (newData == true) {
    
    Serial.print("Received data: ");
    Serial.println(receivedChars);
    DeserializationError err = deserializeJson(doc, receivedChars);
    if (err) {
      Serial.print("ERROR: ");
      Serial.println(err.c_str());
    }
    const char* storeId = doc["storeId"];
    const char* storeSecret = doc["storeSecret"];
    Serial.print("the store id is: ");
    Serial.println(storeId);
    Serial.print("the store secret is: ");
    Serial.println(storeSecret);
    saveConfiguration(storeId, storeSecret);
    newData = false;
  }
}
