// mqttClient.js
const mqtt = require('mqtt');
const dotenv = require('dotenv');
dotenv.config();

const client = mqtt.connect(process.env.MQTT_BROKER_URL);
const STATUS_TOPIC = 'iot/device1/status';

let lastData = {}; // Bộ nhớ tạm cho backend

client.on('connect', () => {
  console.log('✅ MQTT Client đã kết nối');
  client.subscribe(STATUS_TOPIC, (err) => {
    if (!err) console.log(`📡 Đang lắng nghe topic: ${STATUS_TOPIC}`);
  });
});

client.on('message', (topic, message) => {
  try {
    lastData = JSON.parse(message.toString());
    console.log('✅ Nhận được từ ESP32:', lastData);
  } catch (err) {
    console.error('❌ Lỗi parse MQTT:', err);
  }
});

// ✅ Hàm để publish lệnh xuống ESP32
function publish(topic, payload, options = {}, callback) {
  client.publish(topic, payload, options, callback);
}

module.exports = {
  getLastData: () => lastData,
  publish,               // ✅ Thêm dòng này
  mqttClient: client     // optional nếu cần dùng trực tiếp
};
