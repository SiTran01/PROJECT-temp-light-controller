import { useState, useEffect } from "react";
import { useESPData } from "../hooks/ESPDataRead";
import { updateControlState } from "../hooks/ESPDataWrite";

function ThresholdControl() {
  const espData = useESPData();
  const [data, setData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (espData) setData(espData);
  }, [espData]);

  if (!data) return <p>Đang tải ngưỡng...</p>;

  const refreshFromESP = async () => {
    const updated = await fetch("http://192.168.0.148/status")
      .then((res) => res.json())
      .catch((err) => {
        console.error("Lỗi khi đọc lại từ ESP:", err);
        return null;
      });

    if (updated) setData(updated);
  };

  const handleIncreaseTemp2 = async () => {
    let newTemp2 = data.temp2 + 2;
    if (newTemp2 >= data.temp3) {
      newTemp2 = 31;
    }

    // Cập nhật UI tạm thời
    setData((prev) => ({ ...prev, temp2: newTemp2 }));
    setIsUpdating(true);

    // Gửi lên ESP32
    await updateControlState(newTemp2, data.temp3, data.isManual, data.fanLevel);
    await refreshFromESP();

    setIsUpdating(false);
  };

  const handleIncreaseTemp3 = async () => {
    let newTemp3 = data.temp3 + 2;
    if (newTemp3 > 99) {
      newTemp3 = data.temp2 + 1;
    }

    // Cập nhật UI tạm thời
    setData((prev) => ({ ...prev, temp3: newTemp3 }));
    setIsUpdating(true);

    // Gửi lên ESP32
    await updateControlState(data.temp2, newTemp3, data.isManual, data.fanLevel);
    await refreshFromESP();

    setIsUpdating(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-2">
      <p className="font-semibold">🧊 Ngưỡng nhiệt độ:</p>

      <div className="flex justify-between items-center">
        <span>Temp2: {data.temp2}°C</span>
        <button
          onClick={handleIncreaseTemp2}
          className="bg-blue-500 text-white px-2 py-1 rounded disabled:opacity-50"
          disabled={isUpdating}
        >
          +2
        </button>
      </div>

      <div className="flex justify-between items-center">
        <span>Temp3: {data.temp3}°C</span>
        <button
          onClick={handleIncreaseTemp3}
          className="bg-blue-500 text-white px-2 py-1 rounded disabled:opacity-50"
          disabled={isUpdating}
        >
          +2
        </button>
      </div>
    </div>
  );
}

export default ThresholdControl;
