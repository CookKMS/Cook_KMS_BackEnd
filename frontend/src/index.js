import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />  {/* 여기서 Router로 한 번 더 감싸지 말 것! */}
  </React.StrictMode>
);
