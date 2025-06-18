import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFan } from "@fortawesome/free-solid-svg-icons";
import "./FanControl.css";
import "../../styles/Responsive.css"; // import responsive styles


/* ------------------------------------------------------------------------------
    use API for HTTP protocol communication   */
import { useESPData } from "../../api/http_protocol/ESPDataRead";
import { updateControlState } from "../../api/http_protocol/ESPDataWrite";
/* ----------------------------------------------------------------------------- */


/* ------------------------------------------------------------------------------
    use API for WebSocket protocol communication   */
// import { useESPData } from "../../api/websocket_protocol/ESPDataRead";
// import { updateControlState } from "../../api/websocket_protocol/ESPDataWrite";
/* ----------------------------------------------------------------------------- */

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

  // 👉 Dùng khi bật lại HTTP:
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
    // 👉 Dùng khi bật lại HTTP:
  await refreshFromESP();
  };

  const increaseFan = async () => {
    if (!data?.isManual) return;

    const nextFanLevel = (data.fanLevel + 1) % 4;
    await updateControlState(data.temp2, data.temp3, data.isManual, nextFanLevel);
    // 👉 Dùng khi bật lại HTTP:
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
            "Automation"
          ) : (
            "Manual"
          )}
        </button>

        {data?.isManual && (
          <button onClick={increaseFan} className="fan-btn increase">
            {data?.fanLevel === undefined ? (
              <span className="loading2">Loading...</span>
            ) : (
              `Level up (current: ${data.fanLevel})`
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default FanControl;
