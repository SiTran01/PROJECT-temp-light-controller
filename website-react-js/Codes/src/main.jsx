import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';


/* ------------------------------------------------------------------------------
    use API for HTTP protocol communication   */
    
// import { ESPDataProvider } from './api/http_protocol/ESPDataRead.jsx';
/* ----------------------------------------------------------------------------- */


/* ------------------------------------------------------------------------------
    use API for WebSocket protocol communication   */

import { ESPDataProvider } from './api/websocket_protocol/ESPDataRead.jsx';
import { initWebSocket } from "./api/websocket_protocol/ESPDataWrite.jsx"; 
initWebSocket(); // 👉 initial websocket
/* ----------------------------------------------------------------------------- */


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ESPDataProvider>
      <App />
    </ESPDataProvider>
  </React.StrictMode>
);
