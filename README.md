# Temp_Light_Controller

A project using **ESP32-WROOM-32** to control a fan based on temperature and a light based on ambient brightness. The system features real-time temperature display via a **TM1637 7-segment display** and includes a push button to switch between automatic and manual control modes.

---

## 📥 Input

| Thiết bị              | Chức năng                                                          |
|-----------------------|--------------------------------------------------------------------|
| **Cảm biến nhiệt độ** | Đo nhiệt độ môi trường, làm cơ sở để bật/tắt quạt                  |
| **Cảm biến ánh sáng** | Đo cường độ ánh sáng xung quanh, quyết định cường độ sáng đèn      |
| **Nút nhấn**          | Chuyển đổi giữa chế độ tự động và chế độ điều khiển thủ công,      |
                        | Điều chỉnh nhiệt độ để điều khiển quạt, chuyển đổi chế độ hiển thị | 
---

## 📤 Output

| Thiết bị             | Chức năng hoạt động                                                 |
|----------------------|---------------------------------------------------------------------|
| **Quạt**             | Bật/tắt theo nhiệt độ hoặc theo nút nhấn (ở chế độ thủ công)        |
| **Đèn**              | Thay đổi độ sáng đèn theo cường độ ánh sáng đo được                 |
| **LED 7 ĐOẠN**       | Hiển thị giá trị nhiệt độ, độ sáng và chế độ hoạt động              |

---

## ⚙️ Phần cứng sử dụng (Hardware)

| Thiết bị               | Vai trò                                                            |
|------------------------|--------------------------------------------------------------------|
| **ESP32-WROOM-32**     | Vi điều khiển chính                                                |
| **LM35**               | Cảm biến nhiệt độ analog                                           |
| **LDR**                | Cảm biến ánh sáng                                                  |
| **4 Nút nhấn**         | Điều khiển các chức năng khác nhau                                 |
| **TM1637**             | LED 7 đoạn hiển thị nhiệt độ                                       |
| **Quạt 12VDC**         | Đóng/ngắt theo nhiệt độ                                            |
| **Đèn 5mm**            | Đóng/ngắt theo ánh sáng                                            |

---

## 🔋 Khối nguồn (Power Supply)

| Thiết bị               | Vai trò                                                                |
|------------------------|------------------------------------------------------------------------|
| **12VDC**              | Cấp nguồn tổng cho toàn bộ hệ thống                                    |
| **LM2596S**            | Module giảm áp DC-DC: hạ từ 12V xuống 5V                               |
| **LM1117-3.3**         | Ổn áp tuyến tính: từ 5V xuống 3.3V, dùng cấp nguồn ổn định cho ESP32   |
| **Nguồn 12VDC riêng**  | Cấp riêng cho động cơ/quạt (tránh nhiễu, sụt áp so với mạch logic)     |


---

## 🛠️ Công cụ & Phần mềm

| Công cụ / Phần mềm        | Mục đích sử dụng                                              |
|---------------------------|---------------------------------------------------------------|
| **Arduino IDE**           | Lập trình và nạp code cho ESP32                               |
| **Proteus**               | Mô phỏng mạch điện                                            |
| **Altium Designer**       | Thiết kế sơ đồ nguyên lý và mạch in PCB                       |
| **Draw.io**               | Vẽ sơ đồ khối, sơ đồ chức năng, tài liệu hóa hệ thống         |
| **ESP32 Board Package**   | Hỗ trợ biên dịch và upload chương trình lên ESP32             |
| **TM1637Display Library** | Giao tiếp với module hiển thị 7 đoạn TM1637                   |



---

## 🔁 Nguyên lý hoạt động

1. Khi cấp nguồn, ESP32 khởi tạo cảm biến, nút nhấn và màn hình TM1637.
2. Ở chế độ **tự động**:
   - Đọc nhiệt độ và ánh sáng môi trường.
   - So sánh với ngưỡng cài đặt:
     - Nhiệt độ cao → bật hoặc tăng cấp độ quạt.
     - Ánh sáng yếu → bật đèn; đủ sáng → tắt đèn.
3. Ở chế độ **thủ công**:
   - Người dùng điều chỉnh cấp độ quạt (1, 2, 3, tắt) bằng nút nhấn.
   - Hệ thống tạm dừng điều khiển tự động cho đến khi chuyển lại.
4. Nút nhấn dùng để:
   - Thay đổi chế độ hiển thị.
   - Tăng/giảm ngưỡng nhiệt độ.
   - Chuyển đổi chế độ điều khiển.
5. Màn hình TM1637 hiển thị:
   - Nhiệt độ hiện tại
   - Ngưỡng cài đặt
   - Cấp độ quạt

---

## 📂 Cấu trúc thư mục dự án

```plaintext
Temp_Light_Controller/
├── src/                # Mã nguồn chính
├── include/            # Header files (nếu có)
├── lib/                # Thư viện tùy chỉnh (nếu có)
├── docs/               # Sơ đồ mạch, ảnh mô tả
└── README.md           # Mô tả dự án
