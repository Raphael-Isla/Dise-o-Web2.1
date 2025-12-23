
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Importar BrowserRouter
import App from './app.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* Envolver App con BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)