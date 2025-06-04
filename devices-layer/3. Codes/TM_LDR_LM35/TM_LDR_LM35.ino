#include <TM1637.h>

#define LED_TEMP_PIN 21  // LED/quạt điều khiển bằng nhiệt độ (LM35)
#define LED_LDR_PIN 4    // LED điều khiển bằng ánh sáng (LDR)
#define LDR_PIN 35       // Cảm biến ánh sáng (LDR)
#define LM35_PIN 34      // Cảm biến nhiệt độ (LM35)

#define CLK 19  // Chân CLK cho TM1637
#define DIO 18  // Chân DIO cho TM1637

TM1637 tm(CLK, DIO);

void setup() {
  Serial.begin(9600);
  pinMode(LED_TEMP_PIN, OUTPUT);
  pinMode(LED_LDR_PIN, OUTPUT);
  
  tm.set(2);  // Độ sáng tối đa cho TM1637
}

void loop() {
  // Đọc giá trị từ cảm biến ánh sáng
  int lightValue = analogRead(LDR_PIN); // (0 - 4095)
  int brightnessLDR = map(lightValue, 0, 4095, 255, 0); // Chuyển đổi sang PWM
  int lightPercent = map(lightValue, 0, 4095, 99, 0); // Chuyển đổi sang %

  // Đọc giá trị từ cảm biến nhiệt độ
  int sensorValue = analogRead(LM35_PIN);
  float voltage = sensorValue * (3.3 / 4095.0); // Chuyển đổi ADC sang điện áp
  int temperature = voltage * 100.0; // LM35 có độ nhạy 10mV/°C

  // Điều chỉnh độ sáng dựa trên nhiệt độ
  int brightnessTemp = 0;
  if (temperature < 30) {
    brightnessTemp = 0;
  } else if (temperature >= 30 && temperature <= 40) {
    brightnessTemp = 85;
  } else if (temperature > 40 && temperature <= 50) {
    brightnessTemp = 170;
  } else if (temperature > 50) {
    brightnessTemp = 255;
  }

  // Điều chỉnh LED theo nhiệt độ
  analogWrite(LED_TEMP_PIN, brightnessTemp);
  analogWrite(LED_LDR_PIN, brightnessLDR);

  // Hiển thị lên TM1637
  tm.point(true);
  // Hiển thị nhiệt độ ở hai LED bên trái
  tm.display(0, (int)temperature / 10);  // Chữ số hàng chục của nhiệt độ
  tm.display(1, (int)temperature % 10);  // Chữ số hàng đơn vị của nhiệt độ

  // Hiển thị phần trăm ánh sáng ở hai LED bên phải
  tm.display(2, lightPercent / 10);  // Chữ số hàng chục của cường độ ánh sáng
  tm.display(3, lightPercent % 10);  // Chữ số hàng đơn vị của cường độ ánh sáng


  // In ra Serial để kiểm tra
  Serial.print("Nhiệt độ: "); Serial.print(temperature); Serial.print("°C");
  Serial.print(" | Ánh sáng: "); Serial.print(lightPercent); Serial.println("%");

  delay(1000);
}
