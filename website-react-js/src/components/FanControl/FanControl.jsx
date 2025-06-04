import { useState, useEffect } from "react";
import { useESPData } from "../../hooks/ESPDataRead";
import { updateControlState } from "../../hooks/ESPDataWrite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFan } from "@fortawesome/free-solid-svg-icons";
import "./FanControl.css";
import "../../styles/Responsive.css"; // import responsive styles

function FanControl() {
  const espData = useESPData();
  const [overrideData, setOverrideData] = useState(null);
  const data = overrideData || espData;

  useEffect(() => {
    if (overrideData) {
      const timeout = setTimeout(() => setOverrideData(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [overrideData]);

  const refreshFromESP = async () => {
    try {
      const response = await fetch("http://192.168.0.148/status");
      const updated = await response.json();
      setOverrideData(updated);
    } catch (err) {
      console.error("Lỗi khi đọc lại từ ESP:", err);
    }
  };

  const toggleManual = async () => {
    const newManual = !data?.isManual;
    const newFanLevel = newManual ? 1 : 0;

    await updateControlState(data.temp2, data.temp3, newManual, newFanLevel);
    await refreshFromESP();
  };

  const increaseFan = async () => {
    if (!data?.isManual) return;

    const nextFanLevel = (data.fanLevel + 1) % 4;
    await updateControlState(data.temp2, data.temp3, data.isManual, nextFanLevel);
    await refreshFromESP();
  };

  return (
    <div className="fan-control-block">
      {/* Icon quạt bên trái */}
      <div
        className={`fan-icon ${
          data?.fanLevel > 0 ? "spinning" : ""
        } spin-level-${data?.fanLevel ?? 0}`}
      >
        <FontAwesomeIcon icon={faFan} />
      </div>

      {/* Nút điều khiển bên phải */}
      <div className="fan-controls">
        <button onClick={toggleManual} className="fan-btn manual-toggle">
          {data?.isManual === undefined ? (
            <span className="loading2">Loading...</span>
          ) : data.isManual ? (
            "Chuyển sang Tự động"
          ) : (
            "Bật chế độ Thủ công"
          )}
        </button>

        {data?.isManual && (
          <button onClick={increaseFan} className="fan-btn increase">
            {data?.fanLevel === undefined ? (
              <span className="loading2">Loading...</span>
            ) : (
              `Tăng cấp quạt (Hiện tại: ${data.fanLevel})`
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default FanControl;
