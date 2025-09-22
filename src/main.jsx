// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Your global stylesheet

ReactDOM.createRoot(document.getElementById('root')).render(
  // By removing StrictMode, components will only mount once in development,
  // preventing the WebSocket reconnect cycle and cleaning up console logs.
  <BrowserRouter>
    <App />
  </BrowserRouter>
);