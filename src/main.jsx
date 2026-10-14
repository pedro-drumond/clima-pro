import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './estilo.css'
import { iniciar } from './dados/armazenamento.js'
import { supabase } from './dados/supabase.js'

// O link do e-mail de "Esqueci a senha" chega com a sessão no endereço
// (#access_token=...&type=recovery). Ele ocupa o mesmo lugar das rotas, então
// a sessão é lida antes de as rotas existirem, e só depois a tela de nova
// senha abre.
const endereco = window.location.hash
const veioDoEmail = /access_token=/.test(endereco)
const ehRecuperacao = /type=recovery/.test(endereco)

async function comecar() {
  if (veioDoEmail) {
    await supabase.auth.getSession()
    window.location.hash = ehRecuperacao ? '#/nova-senha' : '#/'
  }
  iniciar()
  createRoot(document.getElementById('raiz')).render(
    <HashRouter>
      <App />
    </HashRouter>
  )
}

comecar()
