# 🏠 Temp & Light Smart Home System

A complete smart home system including hardware (ESP32-based controller), a mobile app (React Native), and a web dashboard (React + Vite). This project monitors and controls a fan and light based on environmental temperature and brightness.

---

## 📦 Project Components

### 1. 🔌 Hardware (ESP32 Controller)

The hardware uses **ESP32-WROOM-32** to control:

* A **fan** based on temperature
* A **light** based on ambient brightness
* Includes **buttons** to toggle modes and adjust settings
* Real-time display via **TM1637 7-segment LED**

#### 📥 Input Devices

| Device                        | Function                                                         |
| ----------------------------- | ---------------------------------------------------------------- |
| **Temperature sensor (LM35)** | Measures ambient temperature as basis for fan control            |
| **Light sensor (LDR)**        | Measures ambient brightness for light control                    |
| **Push buttons (4)**          | Toggle control mode, change thresholds, and switch display modes |

#### 📤 Output Devices

| Device             | Function                                                        |
| ------------------ | --------------------------------------------------------------- |
| **Fan**            | On/off or speed control based on temperature or manual override |
| **Light**          | On/off based on brightness                                      |
| **TM1637 Display** | Shows temperature, brightness, fan level, and operation mode    |


---

### 2. 📱 Mobile App – React Native

A mobile application built using **React Native** that communicates with the ESP32 over HTTP.
It displays:

* Real-time temperature and brightness
* Current fan speed and operation mode
* UI for manual mode control

#### 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/SiTran01/PROJECT-temp-light-controller.git
cd PROJECT-temp-light-controller\app-android-react-native

# Install dependencies
npm install

# Configure Android SDK path
# Create a file named 'android/local.properties' and add:
# On Windows:
sdk.dir=C:\\Users\\<your-username>\\AppData\\Local\\Android\\Sdk
# On macOS:
sdk.dir=/Users/<your-username>/Library/Android/sdk

# Run on Android
npx react-native run-android
```

⚠️ Ensure:

* Android device has USB Debugging enabled
* OR emulator is running in Android Studio


---


### 3. 💻 Web Dashboard – React + Vite

A modern web interface to monitor the same sensor data and control fan/light over HTTP API.

#### ⚙️ Technologies

* ⚛️ React.js
* ⚡ Vite.js
* 🎨 CSS/Tailwind (optional)
* 🔄 HTTP API communication with ESP32

#### 🛠 Run Locally

```bash
# clone project web=site
git clone https://github.com/SiTran01/PROJECT-temp-light-controller.git
cd PROJECT-temp-light-controller\website-react-js

# Install dependencies
npm install

# Start dev server
npm run dev
```

🌐 Visit the Web Dashboard:
  🌍 Public Access: http://smarthomeworld.cyou/
  ⏳ Available Until: 15/06/2026

## 📬 Contact

* 👤 Developer: **Si Tran**
* ✉️ Email: quocsi15@gmail.com
