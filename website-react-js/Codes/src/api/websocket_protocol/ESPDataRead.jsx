import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const ESPDataContext = createContext(null);
export const useESPData = () => useContext(ESPDataContext);

export const ESPDataProvider = ({ children }) => {
  const [espData, setEspData] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Kết nối WebSocket đến ESP32
    const socket = new WebSocket("ws://192.168.0.148:81"); // ← thay bằng IP ESP32 thực tế
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Kết nối WebSocket thành công");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Cập nhật state với dữ liệu mới từ ESP32
        setEspData({
          temperature: data.temperature,
          light: data.light,
          fanLevel: data.fanLevel,
          isManual: data.isManual,
          temp2: data.Temp2,
          temp3: data.Temp3,
        });
      } catch (error) {
        console.error("❌ Lỗi phân tích JSON:", error);
      }
    };

    socket.onerror = (err) => {
      console.error("❌ Lỗi WebSocket:", err);
    };

    socket.onclose = () => {
      console.warn("⚠️ WebSocket đã đóng");
    };

    // Cleanup khi unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <ESPDataContext.Provider value={espData}>
      {children}
    </ESPDataContext.Provider>
  );
};
