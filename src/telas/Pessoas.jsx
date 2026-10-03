import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDados, Vazio } from '../componentes/base.jsx'
import { parametros } from '../dados/armazenamento.js'
import { tarefasDoDia } from '../dados/agenda.js'
import { salvarPessoa } from '../dados/acoes.js'

// deixa o telefone legível sem mexer no que está guardado
function telefone(valor) {
  const n = String(valor || '').replace(/\D/g, '')
  if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
  if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`
  return valor
}

export default function Pessoas() {
  const { b, conta } = useDados()
  const navegar = useNavigate()
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('todos')

  const params = parametros(conta)
  // quem já passou do tempo de limpeza, contado da última entrega
  const chamar = tarefasDoDia(b, conta, params)
  const tarefaDe = (id) => chamar.find((t) => t.pessoa.id === id)

  const lista = b.pessoas
    .filter((p) => p.contaId === conta.id)
    .filter((p) => {
      if (filtro === 'limpeza') return !!tarefaDe(p.id)
      if (filtro === 'clientes') return p.ehCliente
      if (filtro === 'contatos') return !p.ehCliente
      return true
    })
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
          ['limpeza', 'Limpeza vencida' + (chamar.length ? ' (' + chamar.length + ')' : '')],
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

      {lista.length === 0 ? (
        <div className="bloco">
          <Vazio texto="Nenhuma pessoa aqui." />
        </div>
      ) : (
        <div className="cartoes-pessoa">
          {lista.map((p) => {
            const dela = b.orcamentos.filter((o) => o.pessoaId === p.id)
            // em aberto é o que ainda espera resposta; contrato é o que ela já
            // fechou e ainda não foi entregue
            const emAberto = dela.filter((o) => o.situacao === 'contato' || o.situacao === 'enviado').length
            const contratos = dela.filter((o) => o.situacao === 'fechado').length
            const tarefa = filtro === 'limpeza' ? tarefaDe(p.id) : null
            return (
              <Link className="cartao-pessoa" to={'/pessoas/' + p.id} key={p.id}>
                <span className="cartao-pessoa-nome">{p.nome}</span>
                <span className="cartao-pessoa-dado">{p.whatsapp ? telefone(p.whatsapp) : '\u00a0'}</span>
                <span className="cartao-pessoa-dado">{p.email || '\u00a0'}</span>
                <span className="cartao-pessoa-conta">
                  <span>{emAberto} orç.</span>
                  {contratos > 0 ? <span>{contratos === 1 ? '1 contrato' : contratos + ' contratos'}</span> : null}
                </span>
                {tarefa ? (
                  <span className="cartao-pessoa-chamar">
                    <span className="fraco">{tarefa.titulo}</span>
                  </span>
                ) : null}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
