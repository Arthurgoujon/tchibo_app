// example config {"storeId":"A001", "storeSecret":"krKB321nPAHyjCSvQWdLNd"}

// Saves the configuration to a file
void saveConfiguration(const char storeId[20], const char storeSecret[20]) {
  // Delete existing file
  SD.remove("/config.txt");

  // Open file for writing
  File file = SD.open("/config.txt", FILE_WRITE);
  if (!file) {
    Serial.println(F("Failed to create file"));
    return;
  }

  StaticJsonDocument<256> doc;

  // Set the values in the document
  doc["storeId"] = storeId;
  doc["storeSecret"] = storeSecret;

  // Serialize JSON to file
  if (serializeJson(doc, file) == 0) {
    Serial.println(F("Failed to write to file"));
  }

  // Close the file
  file.close();
}

// Loads the configuration from a file
void loadConfiguration() {
  // Open file for reading
  File file = SD.open("/config.txt");

  // Allocate a temporary JsonDocument
  StaticJsonDocument<512> doc;

  // Deserialize the JSON document
  DeserializationError error = deserializeJson(doc, file);
  if (error)
    Serial.println(F("Failed to read config file"));

  // Store values from the JsonDocument in storeId and storeSecret
  strcpy(storeId, doc["storeId"]);
  strcpy(storeSecret, doc["storeSecret"]);

  // Close the file
  file.close();
}

void readFile(fs::FS &fs, const char * path) {
  Serial.printf("Reading file: %s\n", path);

  File file = fs.open(path);
  if (!file) {
    Serial.println("Failed to open file for reading");
    return;
  }

  Serial.print("Read from file: ");
  while (file.available()) {
    Serial.write(file.read());
  }
  file.close();
}
