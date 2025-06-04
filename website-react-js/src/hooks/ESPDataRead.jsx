import React, { createContext, useContext, useEffect, useState } from 'react';

// Tạo context
const ESPDataContext = createContext(null);

// Hook dùng để lấy data
export const useESPData = () => useContext(ESPDataContext);

// Provider
export const ESPDataProvider = ({ children }) => {
  const [espData, setEspData] = useState(null);

  const fetchESPData = async () => {
    try {
      const response = await fetch('http://192.168.0.148/status'); // ← thay bằng IP ESP32 thật
      const data = await response.json();

      // Giả sử JSON trả về có: temperature, light, fanLevel, isManual
      setEspData({
        temperature: data.temperature,
        light: data.light,
        fanLevel: data.fanLevel,
        isManual: data.isManual,
        temp2: data.Temp2,  // 👈 thêm dòng này
        temp3: data.Temp3   // 👈 thêm dòng này
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ ESP32:", error);
    }
  };

  useEffect(() => {
    fetchESPData(); // gọi lần đầu

    const interval = setInterval(fetchESPData, 1000); // gọi mỗi 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <ESPDataContext.Provider value={espData}>
      {children}
    </ESPDataContext.Provider>
  );
};
