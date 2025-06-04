import { useEffect, useState } from "react";
import DisplayPanel from "./components/DisplayPanel/DisplayPanel";
import FanControl from "./components/FanControl/FanControl";
import ThresholdControl from "./components/ThresholdControl/ThresholdControl";
import "./App.css"; // import CSS
// import "./styles/Responsive.css"; // import responsive styles


function App() {
  const [data, setData] = useState({
    temp: 0,
    light: 0,
    temp2: 40,
    temp3: 50,
    isManual: false,
    fanLevel: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Giả lập dữ liệu (sẽ thay bằng fetch từ ESP32)
      setData((prev) => ({
        ...prev,
        temp: Math.floor(Math.random() * 60),
        light: Math.floor(Math.random() * 100),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">Fan Control Dashboard</h1>

      <DisplayPanel data={data} />
    
      <div className="control-row">
        <ThresholdControl data={data} setData={setData} />
        <FanControl data={data} setData={setData} />
      </div>
    </div>
  );
}

export default App;
