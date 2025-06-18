import mqtt from 'mqtt';

let client = null;

export const initMQTT = () => {
  if (client) return;

  const brokerUrl = "wss://9a3ae4b9d2f34c67a830b8bbb5b03877.s1.eu.hivemq.cloud:8884/mqtt";
  const options = {
    clientId: 'react-control-' + Math.random().toString(16).substr(2, 8),
    username: 'quocs',
    password: 'Henry121212',
    protocol: 'wss',
    rejectUnauthorized: false
  };

  client = mqtt.connect(brokerUrl, options);

  client.on('connect', () => {
    console.log("✅ MQTT control đã kết nối");
  });

  client.on('error', (err) => {
    console.error("❌ MQTT control lỗi:", err);
  });
};

export const sendControlState = ({ temp2, temp3, isManual, fanLevel }) => {
  if (!client || client.connected === false) {
    console.warn("⚠️ MQTT control chưa sẵn sàng");
    return;
  }

  const payload = JSON.stringify({ temp2, temp3, isManual, fanLevel });
  client.publish("iot/device1/control", payload);
  console.log("📤 Gửi điều khiển MQTT:", payload);
};
