import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDados, Vazio } from '../componentes/base.jsx'
import { salvarPessoa } from '../dados/acoes.js'

export default function Pessoas() {
  const { b, conta } = useDados()
  const navegar = useNavigate()
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('todos')

  const lista = b.pessoas
    .filter((p) => p.contaId === conta.id)
    .filter((p) => (filtro === 'todos' ? true : filtro === 'clientes' ? p.ehCliente : !p.ehCliente))
    .filter((p) =>
      (p.nome + ' ' + (p.endereco || '') + ' ' + (p.whatsapp || ''))
        .toLowerCase()
        .includes(busca.toLowerCase())
    )

  function criar() {
    const novoId = salvarPessoa(
      { nome: 'Novo contato', tipo: 'pf', documento: '', whatsapp: '', email: '', endereco: '' },
      conta.id
    )
    navegar('/pessoas/' + novoId)
  }

  return (
    <>
      <div className="cabeca">
        <h1>Clientes</h1>
        <button className="botao principal" onClick={criar}>
          Novo cliente
        </button>
      </div>

      <div className="filtros">
        {[
          ['todos', 'Todos'],
          ['contatos', 'Ainda não compraram'],
          ['clientes', 'Clientes'],
        ].map(([valor, texto]) => (
          <button
            key={valor}
            className={'botao pequeno' + (filtro === valor ? ' principal' : '')}
            onClick={() => setFiltro(valor)}
          >
            {texto}
          </button>
        ))}
      </div>

      <div className="campo">
        <input placeholder="Buscar por nome, endereço ou telefone" value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      <div className="bloco">
        {lista.length === 0 ? (
          <Vazio texto="Nenhuma pessoa aqui." />
        ) : (
          lista.map((p) => {
            const orcamentos = b.orcamentos.filter((o) => o.pessoaId === p.id)
            return (
              <div className="linha-item" key={p.id}>
                <div>
                  <Link to={'/pessoas/' + p.id}>{p.nome}</Link>
                  <div className="fraco">
                    {p.tipo === 'pj' ? 'Pessoa jurídica' : 'Pessoa física'}
                    {p.endereco ? ' · ' + p.endereco : ''}
                  </div>
                </div>
                <div className="fraco" style={{ textAlign: 'right' }}>
                  {p.ehCliente ? 'Cliente' : 'Contato'}
                  <div>{orcamentos.length} orçamento(s)</div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
