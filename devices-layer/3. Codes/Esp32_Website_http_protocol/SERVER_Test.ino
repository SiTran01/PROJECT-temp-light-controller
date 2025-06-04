#include <TM1637.h>
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

// Thay bằng WiFi thật của bạn
const char* ssid = "CK House 1";
const char* password = "cklog2019";

// HTTP server chạy ở port 80
WebServer server(80);

#define LED_TEMP_PIN 5
#define LED_LDR_PIN 4
#define LDR_PIN 35
#define LM35_PIN 34

#define BUTTON_Mode 27
#define BUTTON_T1 26
#define BUTTON_T2 25
#define BUTTON_Fan 12

#define CLK 19
#define DIO 18

TM1637 tm(CLK, DIO);
int currentTemp = 0;
int currentLight = 0;

int Temp1 = 30;
int Temp2 = 40;
int Temp3 = 50;

bool fanWasRunning = false; // Biến toàn cục, nhớ khai báo ở đầu file
bool isManual = false;
int fanLevel = 0;
int displayMode = 0;

unsigned long lastBtnTime = 0;
unsigned long lastLoopTime = 0;

// Fan button state
bool prevFan = LOW;
unsigned long manualStart = 0;


// Button states
bool prevMode = LOW;
bool prevT1 = LOW;
bool prevT2 = LOW;

void setup() {
  Serial.begin(9600);
  pinMode(LED_TEMP_PIN, OUTPUT);
  pinMode(LED_LDR_PIN, OUTPUT);
  pinMode(BUTTON_Mode, INPUT_PULLUP);
  pinMode(BUTTON_T1, INPUT_PULLUP);
  pinMode(BUTTON_T2, INPUT_PULLUP);
  pinMode(BUTTON_Fan, INPUT_PULLUP);
  tm.set(7);
  Serial.println("Hệ thống khởi động...");

  // Kết nối WiFi
  WiFi.begin(ssid, password);
  Serial.print("Kết nối WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Đã kết nối WiFi! Địa chỉ IP: ");
  Serial.println(WiFi.localIP());

  // Cấu hình endpoint
  server.on("/status", handleStatusRequest);
  server.on("/set-thresholds", HTTP_POST, handleSetThresholds);
  
  // ✅ Xử lý preflight OPTIONS để tránh lỗi CORS
  server.on("/set-thresholds", HTTP_OPTIONS, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(204);
  });
  
  server.begin();
  Serial.println("HTTP server đã khởi động."); 

}

void handleButtonMode() {
  if (digitalRead(BUTTON_Mode) == LOW && prevMode == HIGH) {
    displayMode = !displayMode;
    Serial.println(displayMode == 0 ? ">> Hiển thị nhiệt độ + ánh sáng" : ">> Hiển thị ngưỡng Temp2-Temp3");
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
      Serial.println(isManual ? ">> Bật chế độ quạt thủ công" : ">> Thoát chế độ quạt thủ công (trở về tự động)");
    } else if (isManual) {
      fanLevel = (fanLevel + 1) % 4;
      Serial.print(">> Chuyển cấp quạt thủ công: cấp ");
      Serial.println(fanLevel);
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

void displayTM1637(int temperature, int lightPercent) {
  tm.point(true);
  if (isManual) {
    tm.display(0, 15); // F
    tm.display(1, 12); // C
    tm.display(2, 0);  // Mặc định là 0
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

void readAndControlTemp() {
  int sensorValue = analogRead(LM35_PIN);

  // Điện áp đọc được từ LM35 khi cấp 3.3V
  float voltage = sensorValue * (3.3 / 4095.0);

  // Chuyển đổi điện áp sang nhiệt độ, chuẩn hóa về điều kiện cấp 5V
  currentTemp = voltage * (5.0 / 3.3) * 100.0;

  int brightnessTemp = 0;

  if (!isManual) {
    if (currentTemp < Temp1) {
      brightnessTemp = 0;
      fanWasRunning = false;
    } else if (currentTemp < Temp2) {
      if (!fanWasRunning) {
        analogWrite(LED_TEMP_PIN, 255);
        delay(300);
        fanWasRunning = true;
      }
      brightnessTemp = 100;
    } else if (currentTemp < Temp3) {
      brightnessTemp = 180;
      fanWasRunning = true;
    } else {
      brightnessTemp = 255;
      fanWasRunning = true;
    }
  } else {
    if (fanLevel == 0) {
      brightnessTemp = 0;
      fanWasRunning = false;
    } else if (fanLevel == 1) {
      if (!fanWasRunning) {
        analogWrite(LED_TEMP_PIN, 255);
        delay(300);
        fanWasRunning = true;
      }
      brightnessTemp = 100;
    } else if (fanLevel == 2) {
      brightnessTemp = 180;
      fanWasRunning = true;
    } else if (fanLevel == 3) {
      brightnessTemp = 255;
      fanWasRunning = true;
    }
  }

  analogWrite(LED_TEMP_PIN, brightnessTemp);

  Serial.print("Nhiệt độ: ");
  Serial.print(currentTemp);
  Serial.print(isManual ? " | Quạt (Thủ công): " : " | Quạt (Tự động): ");
  Serial.print(" cấp ");
  Serial.print(brightnessTemp / 85);
}



void readAndControlLight() {
  int lightValue = analogRead(LDR_PIN);
  int brightnessLDR = map(lightValue, 0, 4095, 255, 0);
  analogWrite(LED_LDR_PIN, brightnessLDR);
  currentLight = map(lightValue, 0, 4095, 99, 0);

  Serial.print(" | Ánh sáng: ");
  Serial.println(currentLight);
}


void handleStatusRequest() {
  String json = "{";
  json += "\"temperature\":" + String(currentTemp) + ",";
  json += "\"light\":" + String(currentLight) + ",";
  json += "\"isManual\":" + String(isManual ? "true" : "false") + ",";
  json += "\"fanLevel\":" + String(fanLevel) + ",";
  json += "\"Temp1\":" + String(Temp1) + ",";
  json += "\"Temp2\":" + String(Temp2) + ",";
  json += "\"Temp3\":" + String(Temp3);
  json += "}";


  server.sendHeader("Access-Control-Allow-Origin", "*");
  

  server.send(200, "application/json", json);
}


void handleSetThresholds() {
  if (!server.hasArg("plain")) {
    server.send(400, "application/json", "{\"error\":\"No data received\"}");
    return;
  }

  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, server.arg("plain"));
  if (error) {
    server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }

  int t2 = doc["temp2"];
  int t3 = doc["temp3"];
  bool manual = doc["isManual"];
  int fan = doc["fanLevel"];

  // ✅ Kiểm tra dữ liệu trước khi ghi
  if (t2 <= 0 || t3 <= 0 || t2 >= t3 || fan < 0 || fan > 3) {
    Serial.println("⚠️ Nhận dữ liệu không hợp lệ, bỏ qua cập nhật");
    server.send(400, "application/json", "{\"error\":\"Invalid data\"}");
    return;
  }

  // ✅ Dữ liệu hợp lệ → ghi vào biến toàn cục
  Temp2 = t2;
  Temp3 = t3;
  isManual = manual;
  fanLevel = fan;

  Serial.println("✅ Dữ liệu đã cập nhật từ Web:");
  Serial.print("Temp2: "); Serial.println(Temp2);
  Serial.print("Temp3: "); Serial.println(Temp3);
  Serial.print("isManual: "); Serial.println(isManual);
  Serial.print("fanLevel: "); Serial.println(fanLevel);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", "{\"status\":\"success\"}");
}



void loop() { 
  if (millis() - lastBtnTime >= 100) {
    handleButtons();
    lastBtnTime = millis();
  }

  if (millis() - lastLoopTime >= 1000) {
    readAndControlTemp();
    readAndControlLight();
    displayTM1637(currentTemp, currentLight); // gọi sau khi đã có cả 2 giá trị
    lastLoopTime = millis();
  }
  server.handleClient();
}
