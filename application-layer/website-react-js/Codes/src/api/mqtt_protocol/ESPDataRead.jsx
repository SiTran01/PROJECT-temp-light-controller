import React, { createContext, useContext, useEffect, useState } from 'react';
import mqtt from 'mqtt';

const ESPDataContext = createContext(null);
export const useESPData = () => useContext(ESPDataContext);

export const ESPDataProvider = ({ children }) => {
  const [espData, setEspData] = useState(null);

  useEffect(() => {
    const brokerUrl = 'wss://9a3ae4b9d2f34c67a830b8bbb5b03877.s1.eu.hivemq.cloud:8884/mqtt';

    const options = {
      clientId: 'react-' + Math.random().toString(16).substr(2, 8),
      username: 'quocs',                // 🔐 Thay bằng username HiveMQ Cloud của bạn
      password: 'Henry121212',         // 🔐 Thay bằng password HiveMQ Cloud của bạn
      clean: true,
      connectTimeout: 5000,
      reconnectPeriod: 2000,
    };

    const client = mqtt.connect(brokerUrl, options);

    client.on('connect', () => {
      console.log('✅ MQTT đã kết nối');
      client.subscribe('esp32/data', (err) => {
        if (err) {
          console.error('❌ Không thể subscribe:', err);
        } else {
          console.log('📡 Subscribed topic: esp32/data');
        }
      });
    });

    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('📥 Nhận dữ liệu từ MQTT:', data);
        setEspData(data); // Cấu trúc JSON từ ESP32 phải phù hợp
      } catch (err) {
        console.error('❌ Lỗi xử lý JSON:', err);
      }
    });

    client.on('error', (err) => {
      console.error('❌ MQTT lỗi:', err);
    });

    client.on('close', () => {
      console.warn('⚠️ MQTT đã ngắt kết nối');
    });

    return () => {
      if (client.connected) {
        client.end(true);
      }
    };
  }, []);

  return (
    <ESPDataContext.Provider value={espData}>
      {children}
    </ESPDataContext.Provider>
  );
};
