import "./DisplayPanel.css";
import "../../styles/Responsive.css"; // import responsive styles


/* ------------------------------------------------------------------------------
    use API for HTTP protocol communication   */
// import { useESPData } from "../../api/http_protocol/ESPDataRead";
/* ----------------------------------------------------------------------------- */


/* ------------------------------------------------------------------------------
    use API for WebSocket protocol communication   */
import { useESPData } from "../../api/websocket_protocol/ESPDataRead";
/* ----------------------------------------------------------------------------- */


function DisplayPanel() {
  const data = useESPData();

  return (
    <div className="display-panel">
      <div className="data-block">
        <span className="icon">🌡️</span>
        <div className="text-block">
          <p className="label">Temp</p>
          <p className={`value ${!data || data.temperature === null ? "loading" : ""}`}>
            {data && data.temperature !== null ? `${data.temperature} °C` : "Loading..."}
          </p>
        </div>
      </div>

      <div className="data-block">
        <span className="icon">💡</span>
        <div className="text-block">
          <p className="label">Light</p>
          <p className={`value ${!data || data.light === null ? "loading" : ""}`}>
            {data && data.light !== null ? `${data.light} %` : "Loading..."}
          </p>
        </div>
      </div>

      <div className="data-block">
        <span className="icon">🌀</span>
        <div className="mode-block">
          <p className="mode-label">Mode</p>
          <p
            className={`mode-value ${
              !data || data.isManual === undefined || data.fanLevel === undefined ? "loading" : ""
            }`}
          >
            {data && data.isManual !== undefined && data.fanLevel !== undefined
              ? `${data.isManual ? "manual" : "automation"} - Fan level: ${data.fanLevel}`
              : "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DisplayPanel;
