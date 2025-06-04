import { useESPData } from "../../hooks/ESPDataRead";
import "./DisplayPanel.css";
import "../../styles/Responsive.css"; // import responsive styles

function DisplayPanel() {
  const data = useESPData();

  return (
    <div className="display-panel">
      <div className="data-block">
        <span className="icon">🌡️</span>
        <div className="text-block">
          <p className="label">Nhiệt độ</p>
          <p className={`value ${!data || data.temperature === null ? "loading" : ""}`}>
            {data && data.temperature !== null ? `${data.temperature} °C` : "Loading..."}
          </p>
        </div>
      </div>

      <div className="data-block">
        <span className="icon">💡</span>
        <div className="text-block">
          <p className="label">Ánh sáng</p>
          <p className={`value ${!data || data.light === null ? "loading" : ""}`}>
            {data && data.light !== null ? `${data.light} %` : "Loading..."}
          </p>
        </div>
      </div>

      <div className="data-block">
        <span className="icon">🌀</span>
        <div className="mode-block">
          <p className="mode-label">Chế độ</p>
          <p
            className={`mode-value ${
              !data || data.isManual === undefined || data.fanLevel === undefined ? "loading" : ""
            }`}
          >
            {data && data.isManual !== undefined && data.fanLevel !== undefined
              ? `${data.isManual ? "Thủ công" : "Tự động"} - Cấp quạt: ${data.fanLevel}`
              : "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DisplayPanel;
