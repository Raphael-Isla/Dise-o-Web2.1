// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.tsx'
import './index.css' // ← ESTA LÍNEA DEBE ESTAR

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)