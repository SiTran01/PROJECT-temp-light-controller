# Temp_Light_Controller

A project using **ESP32-WROOM-32** to control a fan based on temperature and a light based on ambient brightness. The system features real-time temperature display via a **TM1637 7-segment display** and includes push buttons to switch between automatic and manual control modes.

---

## 📥 Input

| Device                 | Function                                                                 |
|------------------------|--------------------------------------------------------------------------|
| **Temperature sensor** | Measures ambient temperature as a basis for fan control                 |
| **Light sensor**       | Measures ambient light intensity, decides light brightness              |
| **Push buttons**       | Switch between automatic/manual mode, adjust temperature threshold, and display mode |

---

## 📤 Output

| Device             | Function                                                                    |
|--------------------|-----------------------------------------------------------------------------|
| **Fan**            | Turns on/off or changes speed based on temperature or button control       |
| **Light**          | Turns on/off based on ambient light                                        |
| **7-Segment LED**  | Displays temperature, brightness, and operating mode                       |

---

## ⚙️ Hardware Used

| Device               | Role                                                                       |
|----------------------|----------------------------------------------------------------------------|
| **ESP32-WROOM-32**   | Main microcontroller                                                       |
| **LM35**             | Analog temperature sensor                                                  |
| **LDR**              | Light-dependent resistor (light sensor)                                   |
| **4 Push buttons**   | Controls various functions                                                 |
| **TM1637**           | 7-segment LED display for temperature                                      |
| **12VDC Fan**        | Turns on/off based on temperature                                          |
| **5mm LED**          | Acts as an indicator light based on brightness                            |

---

## 🔋 Power Supply Block

| Component             | Function                                                                   |
|------------------------|---------------------------------------------------------------------------|
| **12VDC Adapter**      | Main power supply for the entire system                                   |
| **LM2596S**            | DC-DC buck converter (12V to 5V)                                          |
| **LM1117-3.3**         | Linear regulator (5V to 3.3V) to power the ESP32 stably                   |
| **Separate 12V Line**  | Powers the fan separately to prevent interference with logic circuitry    |

---

## 🛠️ Tools & Software

| Tool / Software         | Purpose                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| **Arduino IDE**         | Code development and uploading to ESP32                                 |
| **Proteus**             | Electronic circuit simulation                                           |
| **Altium Designer**     | Schematic and PCB design                                                |
| **Draw.io**             | Drawing block diagrams and system documentation                         |
| **ESP32 Board Package** | ESP32 compilation and upload support                                    |
| **TM1637Display Library** | Interfacing with TM1637 7-segment display                             |

---

## 🔁 Operating Principle

1. Upon power-up, ESP32 initializes sensors, buttons, and the TM1637 display.  
2. In **automatic mode**:
   - Reads temperature and light data.
   - Compares with preset threshold:
     - High temperature → turn on or adjust fan speed.
     - Low ambient light → turn on light; sufficient light → turn off.
3. In **manual mode**:
   - User selects fan level (off, 1, 2, 3) using buttons.
   - Automatic control is paused until re-enabled.
4. Buttons are used to:
   - Switch display modes.
   - Increase/decrease temperature threshold.
   - Toggle control modes.
5. TM1637 displays:
   - Current temperature
   - Set threshold
   - Current fan level

---

## 📂 Project Folder Structure

```plaintext
devices-layer/
├── 1. Block Diagram/           # System block diagram
├── 2. Schematic Diagram/       # Electrical schematic diagram
├── 3. Codes/                   # Source code of the project
│   ├── LDR-LED/                # Light control using LDR
│   ├── LM35-FAN/               # Fan control using LM35
│   ├── TM_LDR_LM35/            # Display and control with LDR & LM35
│   └── TM_LDR_LM35_4BUTTON/    # Full version with 4-button control
├── 4. Algorithm Flowchart/     # Flowcharts for system logic
├── 5. Document/                # Reports and project documents
├── 6. Demo/                    # Real system images and demo videos
    ├── Images/                 # Real-world photos after PCB printing
    └── Videos/                 # Demonstration videos


### Link Project: 
      https://github.com/SiTran01/Temp_Light_Controller.git