import React, { useState } from 'react'
import { useDados, Texto, Vazio } from '../componentes/base.jsx'
import { dataCurta } from '../dados/armazenamento.js'
import { criarContaDeCliente, apagarContaDeCliente, trocarSenhaDeUsuario } from '../dados/acoes.js'

const VAZIO = { nomeEmpresa: '', nomeUsuario: '', email: '', senha: '' }

export default function Master() {
  const { b } = useDados()
  const [novo, setNovo] = useState(VAZIO)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const [ocupado, setOcupado] = useState(false)

  async function criar() {
    setErro('')
    setAviso('')
    if (!novo.nomeEmpresa.trim() || !novo.email.trim() || !novo.senha.trim()) {
      setErro('Empresa, e-mail e senha são obrigatórios.')
      return
    }
    if (novo.senha.trim().length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.')
      return
    }
    setOcupado(true)
    const r = await criarContaDeCliente(novo)
    setOcupado(false)
    if (r.erro) {
      setErro(r.erro)
      return
    }
    setAviso('Conta criada. Passe o e-mail e a senha para o cliente.')
    setNovo(VAZIO)
  }

  async function trocar(usuario) {
    setErro('')
    setAviso('')
    const senha = prompt('Nova senha para ' + usuario.email)
    if (!senha) return
    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.')
      return
    }
    const r = await trocarSenhaDeUsuario(usuario.id, senha)
    if (r.erro) setErro(r.erro)
    else setAviso('Senha trocada para ' + usuario.email + '.')
  }

  async function apagar(conta) {
    setErro('')
    setAviso('')
    if (!confirm('Apagar a conta ' + conta.nomeFantasia + ' e tudo dela?')) return
    await apagarContaDeCliente(conta.id)
  }

  const contas = b.contas

  return (
    <>
      <div className="cabeca">
        <h1>Contas</h1>
      </div>

      <div className="bloco">
        <h2>Criar conta de cliente</h2>
        <div className="par">
          <Texto rotulo="Empresa" valor={novo.nomeEmpresa} aoMudar={(v) => setNovo({ ...novo, nomeEmpresa: v })} />
          <Texto rotulo="Responsável" valor={novo.nomeUsuario} aoMudar={(v) => setNovo({ ...novo, nomeUsuario: v })} />
        </div>
        <div className="par">
          <Texto rotulo="E-mail de acesso" valor={novo.email} aoMudar={(v) => setNovo({ ...novo, email: v })} />
          <Texto rotulo="Senha inicial" valor={novo.senha} aoMudar={(v) => setNovo({ ...novo, senha: v })} />
        </div>
        {erro ? <p className="erro">{erro}</p> : null}
        {aviso ? <p className="fraco">{aviso}</p> : null}
        <button className="botao principal" onClick={criar} disabled={ocupado}>
          {ocupado ? 'Criando...' : 'Criar conta'}
        </button>
      </div>

      <div className="bloco">
        <h2>Contas ativas</h2>
        {contas.length === 0 ? (
          <Vazio texto="Nenhuma conta." />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Acesso</th>
                <th className="n">Uso</th>
                <th className="n"></th>
              </tr>
            </thead>
            <tbody>
              {contas.map((c) => {
                const usuario = b.usuarios.find((u) => u.contaId === c.id)
                const orcamentos = b.orcamentos.filter((o) => o.contaId === c.id)
                const ultimo = orcamentos
                  .map((o) => o.criadoEm)
                  .sort()
                  .pop()
                return (
                  <tr key={c.id}>
                    <td>
                      {c.nomeFantasia}
                      <div className="fraco">desde {dataCurta(c.criadaEm)}</div>
                    </td>
                    <td>
                      {usuario ? usuario.email : '—'}
                      <div className="fraco">{usuario ? usuario.nome : ''}</div>
                    </td>
                    <td className="n">
                      {orcamentos.length} orçamento(s)
                      <div className="fraco">{ultimo ? 'último em ' + dataCurta(ultimo) : 'ainda sem uso'}</div>
                    </td>
                    <td className="n">
                      <button className="botao pequeno" disabled={!usuario} onClick={() => trocar(usuario)}>
                        Trocar senha
                      </button>
                      <button className="botao perigo" onClick={() => apagar(c)}>
                        Apagar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
