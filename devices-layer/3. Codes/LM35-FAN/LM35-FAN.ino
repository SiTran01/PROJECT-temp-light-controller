#define LM35_PIN 34  // Chân đọc tín hiệu từ LM35
#define LED_PIN 21   // Chân điều khiển LED

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int sensorValue = analogRead(LM35_PIN); // Đọc giá trị từ LM35
  float voltage = sensorValue * (3.3 / 4095.0); // Chuyển đổi ADC sang điện áp
  float temperature = voltage * 100.0; // LM35 có độ nhạy 10mV/°C

  // Điều chỉnh độ sáng LED dựa trên nhiệt độ
  int brightness = 0;
  
  if (temperature < 30) {
    brightness = 0;  // Đèn tắt (quạt không chạy)
  }
  else if (temperature >= 30 && temperature <= 40) {
    brightness = 85;  // Quạt cấp 1
  }
  else if (temperature > 40 && temperature <= 50) {
    brightness = 170;  // Quạt cấp 2
  }
  else if (temperature > 50) {
    brightness = 255;  // Quạt cấp 3 (mạnh nhất)
  }

  brightness = constrain(brightness, 0, 255); // Giới hạn giá trị 0-255

  analogWrite(LED_PIN, brightness); // Điều chỉnh độ sáng LED

  // In ra Serial
  Serial.print("Nhiệt độ: ");
  Serial.print(temperature);
  Serial.print(" °C | Độ sáng LED: ");
  Serial.println(brightness);

  delay(500); // Đọc lại sau 1 giây
}
