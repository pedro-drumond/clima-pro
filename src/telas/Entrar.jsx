import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { entrar, usuarioAtual, recuperarSenha } from '../dados/armazenamento.js'
import { Texto } from '../componentes/base.jsx'

export default function Entrar() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const navegar = useNavigate()

  if (usuarioAtual()) return <Navigate to="/" replace />

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    setAviso('')
    setOcupado(true)
    const r = await entrar(email, senha)
    setOcupado(false)
    if (r.erro) {
      setErro(r.erro)
      return
    }
    navegar(r.usuario?.papel === 'master' ? '/master' : '/')
  }

  async function esqueci() {
    setErro('')
    setAviso('')
    if (!email.trim()) {
      setErro('Escreva o e-mail para receber o link.')
      return
    }
    const r = await recuperarSenha(email)
    if (r.erro) setErro(r.erro)
    else setAviso('Enviamos um link para ' + email + '.')
  }

  return (
    <div className="entrar">
      <div className="entrar-marca">Clima Pro</div>

      <form className="bloco" onSubmit={enviar}>
        <Texto rotulo="E-mail" valor={email} aoMudar={setEmail} type="email" autoComplete="username" />
        <Texto rotulo="Senha" valor={senha} aoMudar={setSenha} type="password" autoComplete="current-password" />
        {erro ? <p className="erro">{erro}</p> : null}
        {aviso ? <p className="fraco">{aviso}</p> : null}
        <button className="botao principal grande" type="submit" disabled={ocupado}>
          {ocupado ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <button className="botao texto" onClick={esqueci}>
        Esqueci a senha
      </button>
    </div>
  )
}
