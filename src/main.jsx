import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './estilo.css'
import { iniciar } from './dados/armazenamento.js'

iniciar()

createRoot(document.getElementById('raiz')).render(
  <HashRouter>
    <App />
  </HashRouter>
)
