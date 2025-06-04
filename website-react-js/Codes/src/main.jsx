import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ESPDataProvider } from './hooks/ESPDataRead.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ESPDataProvider>
      <App />
    </ESPDataProvider>
  </React.StrictMode>
);
