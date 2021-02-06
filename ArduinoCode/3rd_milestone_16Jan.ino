//////////////////////////////////////////////////////////////
//////////////////imports/////////////////////////////////////
//////////////////////////////////////////////////////////////
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <EEPROM.h>
#include <Hash.h>
#include <M5Stack.h>
#include "SD.h"
#include "FS.h"
#include <ArduinoJson.h>
#include "Image.c"

//////////////////////////////////////////////////////////////
//////////////////variables///////////////////////////////////
//////////////////////////////////////////////////////////////
//those variables are used to read data from serial
const byte numChars = 100;
char receivedChars[numChars];
boolean newData = false;

BLEServer *pServer = NULL;
BLECharacteristic * pTxCharacteristic;
bool deviceConnected = false;
bool oldDeviceConnected = false;

bool isHistory = true;

char storeId[30];
char storeSecret[30];
long randNumber;
char randNumberChar[10];
char txmsg[30];

//can we change this to char?
String c;

int count = 1;
int adress = 0;
int i = 0;
char serialInput[50];
char buff[50];
String crypto1;
int response = 0;
File myFile;
const int chipSelect = 4;
const char* myproduct;
const char* myuser;
const char* mydate;
int counter = 1;
StaticJsonDocument<1024> doc;

#define SERVICE_UUID           "6E400001-B5A3-F393-E0A9-E50E24DCCA9E" // UART service UUID
#define CHARACTERISTIC_UUID_RX "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
#define CHARACTERISTIC_UUID_TX "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"


//////////////////////////////////////////////////////////////
//////////////////other functions/////////////////////////////
//////////////////////////////////////////////////////////////

void update_info() {
  randNumber = random(1, 1000000);
  sprintf(randNumberChar, "%li", randNumber);
  strcat(txmsg, randNumberChar);
  char comma[] = ",";
  strcat(txmsg, comma);
  strcat(txmsg, storeId);
  Serial.println(F(txmsg));

  c = String(randNumber) + "," + String(storeSecret);
  crypto1 = sha1(c);
  Serial.println("crypto1  :");
  Serial.println(crypto1);

}

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
    };
    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
    }
};

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string rxValue = pCharacteristic->getValue();
      count = 0;

      //      converting the sdt::string to a char, which we need for ArduinoJSON
      const char *rxValueChar = rxValue.c_str();

      //deserialise JSON
      DeserializationError err = deserializeJson(doc, rxValueChar);
      if (err) {
        Serial.print("ERROR: ");
        Serial.println(err.c_str());
      }

      //get the receivedKey from JSON, in char format
      const char* receivedKeyChar = doc["accessKey"];
      Serial.print("access key");
      Serial.println(receivedKeyChar);

      if (strcmp(receivedKeyChar, crypto1.c_str()) == 0) {
        Serial.println("Success");
        M5.Lcd.fillScreen(GREEN);
        saveHistory(rxValueChar);
        delay(2000);
        printHistory();
      }
      else {
        Serial.println("Failure");
        M5.Lcd.fillScreen(RED);
      }

      //reset the M5Stack to generate a new random number
      Serial.println();
      Serial.println("*********");
      update_info();
      // At the moment we can call back printMyData because the M5Stack crashed. I think the heap memory is full and we need to optimise our
      // use of char* and string.
      delay(2000);
    }
};

//////////////////////////////////////////////////////////////
//////////////////setup///////////////////////////////////////
//////////////////////////////////////////////////////////////
void setup() {
  M5.begin();
  Serial.begin(115200);
  Serial.print("Initializing SD card...");
  if (!SD.begin(chipSelect))
  {
    Serial.println(F("SD initialization failed!"));
    return;
  }
  Serial.println(F("SD initialization done."));

  M5.Lcd.drawBitmap(0, 0, 320, 240, (uint8_t *)image_map);
  delay(2000);
  readHistory();



  loadConfiguration();
  Serial.print("current storeId : ");
  Serial.println(storeId);
  Serial.print("current storeSecret: ");
  Serial.println(storeSecret);

  update_info();

  // Create the BLE Device
  BLEDevice::init("monKado");
  Serial.println("enter store id and store secret in this format");
  Serial.println("{\"storeId\":\"A001\", \"storeSecret\":\"krKB321nPAHyjCSvQWdLNd\"}");
  delay(1000);

  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create a BLE Characteristic
  pTxCharacteristic = pService->createCharacteristic(
                        CHARACTERISTIC_UUID_TX,
                        BLECharacteristic::PROPERTY_NOTIFY
                      );

  pTxCharacteristic->addDescriptor(new BLE2902());

  BLECharacteristic * pRxCharacteristic = pService->createCharacteristic(
      CHARACTERISTIC_UUID_RX,
      BLECharacteristic::PROPERTY_WRITE
                                          );
  pRxCharacteristic->setCallbacks(new MyCallbacks());

  // Start the service
  pService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
}

//////////////////////////////////////////////////////////////
//////////////////loop////////////////////////////////////////
//////////////////////////////////////////////////////////////
void loop() {
  receiveInputFromSerial();

  if (deviceConnected && count) {
    delay(5000);
    pTxCharacteristic->setValue(txmsg);
    Serial.println(txmsg);
    pTxCharacteristic->notify();
    // count=0;
    //        txValue++;
    delay(10); // bluetooth stack will go into congestion, if too many packets are sent
  }

  // disconnecting
  if (!deviceConnected && oldDeviceConnected) {
    delay(500); // give the bluetooth stack the chance to get things ready
    pServer->startAdvertising(); // restart advertising
    Serial.println("start advertising");
    oldDeviceConnected = deviceConnected;
    count = 1;
  }

  // connecting
  if (deviceConnected && !oldDeviceConnected) {
    // do stuff here on connecting
    oldDeviceConnected = deviceConnected;
  }

  M5.update(); // need to call update()
  M5.Lcd.setCursor(0, 0);

  if (M5.BtnA.wasPressed()) {
    M5.Lcd.drawBitmap(0, 0, 320, 240, (uint8_t *)image_map);
  }

  if (M5.BtnB.wasPressed()) {
    if (counter - 1 < 0) {
      counter = doc["history"].size() - 1;
    }
    else {
      counter = counter - 1;
    }
    printHistory();
  }

  if (M5.BtnC.wasPressed()) {
    if (counter + 1 > doc["history"].size() - 1) {
      counter = 0;
    }
    else {
      counter = counter + 1;
    }
    printHistory();
  }
}
