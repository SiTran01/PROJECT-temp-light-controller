import { useESPData } from "../../hooks/ESPDataRead";
import { updateControlState } from "../../hooks/ESPDataWrite";
import "./ThresholdControl.css";
import "../../styles/Responsive.css"; // import responsive styles

function ThresholdControl() {
  const data = useESPData();

  const handleIncreaseTemp2 = () => {
    let newTemp2 = data.temp2 + 2;
    if (newTemp2 >= data.temp3) newTemp2 = 35;
    updateControlState(newTemp2, data.temp3, data.isManual, data.fanLevel);
  };

  const handleIncreaseTemp3 = () => {
    let newTemp3 = data.temp3 + 2;
    if (newTemp3 > 99) newTemp3 = data.temp2 + 1;
    updateControlState(data.temp2, newTemp3, data.isManual, data.fanLevel);
  };

  const isLoading = !data || data.temp2 == null || data.temp3 == null;

  return (
    <div className="threshold-block">
      <p className="threshold-title">🧊 Ngưỡng nhiệt độ:</p>

      <div className="threshold-row">
        <span className="threshold-label">Temp2:</span>
        <span className="threshold-value">
          {data && data.temp2 != null ? `${data.temp2}°C` : <span className="loading-text">Loading...</span>}
        </span>
        <button
          className="threshold-btn"
          onClick={handleIncreaseTemp2}
          disabled={isLoading}
        >
          +2
        </button>
      </div>

      <div className="threshold-row">
        <span className="threshold-label">Temp3:</span>
        <span className="threshold-value">
          {data && data.temp3 != null ? `${data.temp3}°C` : <span className="loading-text">Loading...</span>}
        </span>
        <button
          className="threshold-btn"
          onClick={handleIncreaseTemp3}
          disabled={isLoading}
        >
          +2
        </button>
      </div>
    </div>
  );
}

export default ThresholdControl;
