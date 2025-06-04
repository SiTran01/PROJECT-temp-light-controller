#define LED_PIN 21    // Chân LED
#define LDR_PIN 34    // Chân cảm biến ánh sáng (LDR)

void setup() {
  Serial.begin(9600);  
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int lightValue = analogRead(LDR_PIN); // Đọc giá trị ánh sáng (0 - 4095)
  int brightness = map(lightValue, 0, 4095, 255, 0); // Chuyển đổi sang PWM (0 - 255)

  analogWrite(LED_PIN, brightness); // Điều chỉnh độ sáng LED

  // In ra Serial để kiểm tra
  Serial.print("Ánh sáng đọc được: ");
  Serial.print(lightValue);
  Serial.print(" | Độ sáng LED: ");
  Serial.println(brightness);

  delay(500); // Chờ 0.5 giây
}
