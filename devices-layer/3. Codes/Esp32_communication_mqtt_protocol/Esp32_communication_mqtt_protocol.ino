#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <TM1637.h>

// WiFi
const char* ssid = "CK House 1";
const char* password = "cklog2019";

// MQTT HiveMQ Cloud
const char* mqtt_server = "54.221.114.254"; // ✅ Địa chỉ IP server
const int mqtt_port = 1883;   
//const char* mqtt_username = "quocs";
//const char* mqtt_password = "Henry121212";

// MQTT topic
const char* topic_status = "iot/device1/status";
const char* topic_control = "iot/device1/control";

// ESP32 - MQTT
WiFiClient espClient;          // ✅ Không phải WiFiClientSecure
PubSubClient client(espClient);

// TM1637
#define CLK 19
#define DIO 18
TM1637 tm(CLK, DIO);

// IO pins
#define LED_TEMP_PIN 5
#define LED_LDR_PIN 4
#define LDR_PIN 35
#define LM35_PIN 34

#define BUTTON_Mode 27
#define BUTTON_T1 26
#define BUTTON_T2 25
#define BUTTON_Fan 12

// Biến toàn cục
int currentTemp = 0;
int currentLight = 0;
int Temp1 = 30;
int Temp2 = 40;
int Temp3 = 50;

bool fanWasRunning = false;
bool isManual = false;
int fanLevel = 0;
int displayMode = 0;

unsigned long lastBtnTime = 0;
unsigned long lastLoopTime = 0;

bool prevMode = HIGH;
bool prevT1 = HIGH;
bool prevT2 = HIGH;
bool prevFan = LOW;
unsigned long manualStart = 0;

// ===== WiFi Setup =====
void setup_wifi() {
  delay(10);
  Serial.print("Kết nối tới WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\n✅ Đã kết nối WiFi, IP: " + WiFi.localIP().toString());
}

// ===== MQTT Setup =====
void setup_mqtt() {
//  espClient.setInsecure(); // ⚠️ Dùng khi thử nghiệm
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

// ===== Gửi trạng thái lên MQTT =====
void sendStatus() {
  StaticJsonDocument<256> doc;
  doc["temperature"] = currentTemp;
  doc["light"] = currentLight;
  doc["isManual"] = isManual;
  doc["fanLevel"] = fanLevel;
  doc["Temp1"] = Temp1;
  doc["Temp2"] = Temp2;
  doc["Temp3"] = Temp3;

  char buffer[256];
  size_t len = serializeJson(doc, buffer);
  if (client.publish(topic_status, buffer, len)) {
    Serial.print("✅ Gửi MQTT: "); Serial.println(buffer);
  } else {
    Serial.println("❌ Gửi MQTT thất bại!");
  }
}

// ===== Xử lý khi nhận MQTT =====
void callback(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<256> doc;
  DeserializationError err = deserializeJson(doc, payload, length);
  if (err) {
    Serial.println("❌ Lỗi JSON nhận từ MQTT");
    return;
  }

  if (doc.containsKey("temp2") && doc.containsKey("temp3") &&
      doc.containsKey("isManual") && doc.containsKey("fanLevel")) {
    int t2 = doc["temp2"];
    int t3 = doc["temp3"];
    bool manual = doc["isManual"];
    int fan = doc["fanLevel"];

    if (t2 > 0 && t3 > 0 && t2 < t3 && fan >= 0 && fan <= 3) {
      Temp2 = t2;
      Temp3 = t3;
      isManual = manual;
      fanLevel = fan;
      Serial.println("✅ Nhận MQTT: cập nhật cấu hình");
      sendStatus();
    } else {
      Serial.println("⚠️ Dữ liệu không hợp lệ từ MQTT");
    }
  }
}

// ===== Reconnect MQTT nếu mất kết nối =====
void reconnect() {
  while (!client.connected()) {
    Serial.print("Đang kết nối MQTT... ");
    String clientId = "ESP32Client-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("✅ Kết nối thành công!");
      client.subscribe(topic_control);
    } else {
      Serial.print("❌ Thất bại (Lỗi: "); Serial.print(client.state()); Serial.println("). Thử lại sau 5s...");
      delay(5000);
    }
  }
}

// ===== Các nút bấm =====
void handleButtonMode() {
  if (digitalRead(BUTTON_Mode) == LOW && prevMode == HIGH) {
    displayMode = !displayMode;
    Serial.println(displayMode ? ">> Hiển thị Temp2/Temp3" : ">> Hiển thị nhiệt độ/ánh sáng");
    prevMode = LOW;
  } else if (digitalRead(BUTTON_Mode) == HIGH) prevMode = HIGH;
}

void handleButtonT1() {
  if (digitalRead(BUTTON_T1) == LOW && prevT1 == HIGH) {
    Temp2 += 2;
    if (Temp2 >= Temp3) Temp2 = Temp1 + 5;
    Serial.print(">> Temp2: "); Serial.println(Temp2);
    prevT1 = LOW;
  } else if (digitalRead(BUTTON_T1) == HIGH) prevT1 = HIGH;
}

void handleButtonT2() {
  if (digitalRead(BUTTON_T2) == LOW && prevT2 == HIGH) {
    Temp3 += 2;
    if (Temp3 > 99) Temp3 = Temp2 + 5;
    Serial.print(">> Temp3: "); Serial.println(Temp3);
    prevT2 = LOW;
  } else if (digitalRead(BUTTON_T2) == HIGH) prevT2 = HIGH;
}

void handleButtonFan() {
  static bool buttonHeld = false;
  bool isPressed = digitalRead(BUTTON_Fan) == HIGH;

  if (isPressed && !buttonHeld) {
    manualStart = millis();
    buttonHeld = true;
  }

  if (!isPressed && buttonHeld) {
    unsigned long pressTime = millis() - manualStart;

    if (pressTime >= 2000) {
      isManual = !isManual;
      fanLevel = isManual ? 1 : 0;
      Serial.println(isManual ? ">> Bật chế độ thủ công" : ">> Quay lại tự động");
    } else if (isManual) {
      fanLevel = (fanLevel + 1) % 4;
      Serial.print(">> Quạt thủ công cấp "); Serial.println(fanLevel);
    }
    buttonHeld = false;
  }
}

void handleButtons() {
  handleButtonFan();
  handleButtonMode();
  handleButtonT1();
  handleButtonT2();
}

// ===== Hiển thị TM1637 =====
void displayTM1637(int temperature, int lightPercent) {
  tm.point(true);
  if (isManual) {
    tm.display(0, 15); // F
    tm.display(1, 12); // C
    tm.display(2, 0);
    tm.display(3, fanLevel);
  } else {
    if (displayMode == 0) {
      tm.display(0, temperature / 10);
      tm.display(1, temperature % 10);
      tm.display(2, lightPercent / 10);
      tm.display(3, lightPercent % 10);
    } else {
      tm.display(0, Temp2 / 10);
      tm.display(1, Temp2 % 10);
      tm.display(2, Temp3 / 10);
      tm.display(3, Temp3 % 10);
    }
  }
}

// ===== Xử lý nhiệt độ và quạt =====
void readAndControlTemp() {
  int sensorValue = analogRead(LM35_PIN);
  float voltage = sensorValue * (3.3 / 4095.0);
  currentTemp = voltage * (5.0 / 3.3) * 100.0;

  int brightnessTemp = 0;

  if (!isManual) {
    if (currentTemp < Temp1) {
      brightnessTemp = 0; fanWasRunning = false;
    } else if (currentTemp < Temp2) {
      if (!fanWasRunning) {
        analogWrite(LED_TEMP_PIN, 255);
        delay(300); fanWasRunning = true;
      }
      brightnessTemp = 100;
    } else if (currentTemp < Temp3) {
      brightnessTemp = 180; fanWasRunning = true;
    } else {
      brightnessTemp = 255; fanWasRunning = true;
    }
  } else {
    switch (fanLevel) {
      case 0: brightnessTemp = 0; fanWasRunning = false; break;
      case 1:
        if (!fanWasRunning) {
          analogWrite(LED_TEMP_PIN, 255);
          delay(300); fanWasRunning = true;
        }
        brightnessTemp = 100; break;
      case 2: brightnessTemp = 180; fanWasRunning = true; break;
      case 3: brightnessTemp = 255; fanWasRunning = true; break;
    }
  }

  analogWrite(LED_TEMP_PIN, brightnessTemp);
  Serial.print("Nhiệt độ: "); Serial.print(currentTemp);
  Serial.print(isManual ? " | Quạt (Thủ công): cấp " : " | Quạt (Tự động): cấp ");
  Serial.println(brightnessTemp / 85);
}

// ===== Xử lý ánh sáng =====
void readAndControlLight() {
  int lightValue = analogRead(LDR_PIN);
  int brightnessLDR = map(lightValue, 0, 4095, 255, 0);
  analogWrite(LED_LDR_PIN, brightnessLDR);
  currentLight = map(lightValue, 0, 4095, 99, 0);
  Serial.print(" | Ánh sáng: "); Serial.println(currentLight);
}

// ===== Setup chính =====
void setup() {
  Serial.begin(9600);
  pinMode(LED_TEMP_PIN, OUTPUT);
  pinMode(LED_LDR_PIN, OUTPUT);
  pinMode(BUTTON_Mode, INPUT_PULLUP);
  pinMode(BUTTON_T1, INPUT_PULLUP);
  pinMode(BUTTON_T2, INPUT_PULLUP);
  pinMode(BUTTON_Fan, INPUT_PULLUP);

  tm.set(7); // Độ sáng
  setup_wifi();
  setup_mqtt();
}

// ===== Loop chính =====
void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  if (millis() - lastBtnTime >= 100) {
    handleButtons();
    lastBtnTime = millis();
  }

  if (millis() - lastLoopTime >= 1000) {
    readAndControlTemp();
    readAndControlLight();
    displayTM1637(currentTemp, currentLight);
    sendStatus();
    lastLoopTime = millis();
  }
}
