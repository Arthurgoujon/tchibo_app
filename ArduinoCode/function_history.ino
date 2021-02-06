// read history data from SD card and print it to M5 stack screen
void readHistory () {
  // Open file for reading
  File file = SD.open("/data.txt");

  DeserializationError err = deserializeJson(doc, file);
  if (err) {
    isHistory = false;
    Serial.print("ERROR: ");
    Serial.println(F(err.c_str()));
  }
  else {
    isHistory = true;
  }
}

//save history data received from the phone on the SD card (and delete existing file)
void saveHistory(const char historyData[200]) {
  // Delete existing file
  SD.remove("/data.txt");
  writeFile(SD, "/data.txt", historyData);
}

//write char to file
void writeFile(fs::FS &fs, const char * path, const char * message) {
  Serial.printf("Writing file: %s\n", path);

  File file = fs.open(path, FILE_WRITE);
  if (!file) {
    Serial.println("Failed to open file for writing");
    return;
  }
  if (file.print(message)) {
    Serial.println("File written");
  } else {
    Serial.println("Write failed");
  }
  file.close();
}

//print history data to M5Stack screen
void printHistory () {
  if (isHistory) {
    Serial.print("Counter: ");
    Serial.println(counter);
    myproduct = doc["history"][counter]["name"];
    myuser = doc["history"][counter]["user"];
    mydate = doc["history"][counter]["date"];
    M5.Lcd.fillScreen(BLACK);
    M5.Lcd.setTextSize(2);
    M5.Lcd.drawString(myproduct, 10, 10, 2);// Print the string name of the font
    M5.Lcd.drawString(myuser, 10, 40, 2);// Print the string name of the font
    M5.Lcd.setTextSize(1);
    M5.Lcd.drawString(mydate, 10, 70, 2);// Print the string name of the font
  }
  else {
    M5.Lcd.fillScreen(BLACK);
    M5.Lcd.setTextSize(2);
    const char * defaultMessage = "no coupons yet";
    M5.Lcd.drawString(defaultMessage, 10, 10, 2);// Print the string name of the font
  }
}
