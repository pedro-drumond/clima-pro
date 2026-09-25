import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { trocarMinhaSenha } from '../dados/armazenamento.js'
import { Texto } from '../componentes/base.jsx'

export default function NovaSenha() {
  const [senha, setSenha] = useState('')
  const [repetir, setRepetir] = useState('')
  const [erro, setErro] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const navegar = useNavigate()

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.')
      return
    }
    if (senha !== repetir) {
      setErro('As duas senhas estão diferentes.')
      return
    }
    setOcupado(true)
    const r = await trocarMinhaSenha(senha)
    setOcupado(false)
    if (r.erro) {
      setErro(r.erro)
      return
    }
    navegar('/')
  }

  return (
    <div className="entrar">
      <div className="entrar-marca">Clima Pro</div>
      <form className="bloco" onSubmit={enviar}>
        <h2>Escolher nova senha</h2>
        <Texto rotulo="Nova senha" valor={senha} aoMudar={setSenha} type="password" autoComplete="new-password" />
        <Texto rotulo="Repita a senha" valor={repetir} aoMudar={setRepetir} type="password" autoComplete="new-password" />
        {erro ? <p className="erro">{erro}</p> : null}
        <button className="botao principal grande" type="submit" disabled={ocupado}>
          {ocupado ? 'Salvando...' : 'Salvar senha'}
        </button>
      </form>
    </div>
  )
}
