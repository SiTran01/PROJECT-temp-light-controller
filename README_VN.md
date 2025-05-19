# Temp_Light_Controller

Một dự án sử dụng ESP32-WROOM-32 để điều khiển quạt dựa trên nhiệt độ và điều khiển đèn dựa trên độ sáng môi trường xung quanh. Hệ thống có chức năng hiển thị nhiệt độ theo thời gian thực thông qua màn hình LED 7 đoạn TM1637 và bao gồm nút nhấn để chuyển đổi giữa chế độ tự động và chế độ điều khiển thủ công.

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
├── 1. Block Diagram/           # Sơ đồ khối hệ thống
├── 2. Schematic Diagram/       # Sơ đồ nguyên lý mạch điện
├── 3. Codes/                   # Mã nguồn chương trình
│   ├── LDR-LED/                # Điều khiển đèn bằng cảm biến ánh sáng (LDR)
│   ├── LM35-FAN/               # Điều khiển quạt bằng cảm biến nhiệt độ (LM35)
│   ├── TM_LDR_LM35/            # Hiển thị nhiệt độ và điều khiển dựa vào LDR + LM35
│   └── TM_LDR_LM35_4BUTTON/    # Phiên bản đầy đủ, thêm 4 nút nhấn điều khiển
├── 4. Algorithm Flowchart/     # Lưu đồ thuật toán
├── 5. Document/                # Tài liệu mô tả, báo cáo
├── 6. Demo/                    # Hình ảnh và video mô tả hệ thống thực tế
│   ├── Images/                 # Ảnh thực tế sau khi in mạch, lắp ráp
│   └── Videos/                 # Video hoạt động
└── README.md                   # Mô tả tổng quan dự án



