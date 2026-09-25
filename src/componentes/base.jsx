import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { observar, usuarioAtual, contaAtual, sair, banco, estaCarregando } from '../dados/armazenamento.js'
import { gravarPendentes } from '../dados/acoes.js'

export function useDados() {
  const [, forcar] = useState(0)
  useEffect(() => observar(() => forcar((n) => n + 1)), [])
  return {
    b: banco(),
    usuario: usuarioAtual(),
    conta: contaAtual(),
    carregando: estaCarregando(),
  }
}

export function Moldura({ children }) {
  const { usuario, conta } = useDados()
  const navegar = useNavigate()
  const master = usuario && usuario.papel === 'master'

  return (
    <div className="app">
      <div className="topo">
        <span className="marca">Clima Pro</span>
        <div className="topo-direita">
          <span>{conta ? conta.nomeFantasia : usuario ? usuario.nome : ''}</span>
          <button
            onClick={async () => {
              gravarPendentes()
              await sair()
              navegar('/entrar')
            }}
          >
            Sair
          </button>
        </div>
      </div>
      <nav className="menu">
        {master ? (
          <>
            <Item para="/master" texto="Contas" />
            <Item para="/master/parametros" texto="Parâmetros gerais" />
          </>
        ) : (
          <>
            <Item para="/" texto="Início" fim />
            <Item para="/chamar" texto="Quem chamar" />
            <Item para="/orcamentos" texto="Orçamentos" />
            <Item para="/pessoas" texto="Clientes" />
            <Item para="/biblioteca" texto="Biblioteca" />
            <Item para="/numeros" texto="Financeiro" />
            <Item para="/empresa" texto="Minha empresa" />
          </>
        )}
      </nav>
      <div className="conteudo">{children}</div>
    </div>
  )
}

function Item({ para, texto, fim }) {
  return (
    <NavLink to={para} end={fim} className={({ isActive }) => (isActive ? 'ativo' : '')}>
      {texto}
    </NavLink>
  )
}

// tamanho: 'curto' para porcentagem, dias e quantidade; 'medio' para documento,
// telefone e valor; sem tamanho o campo ocupa a linha (nome, endereço, texto).
export function Campo({ rotulo, tamanho, children }) {
  return (
    <div className={'campo' + (tamanho ? ' ' + tamanho : '')}>
      <label>{rotulo}</label>
      {children}
    </div>
  )
}

export function Texto({ rotulo, valor, aoMudar, tamanho, ...resto }) {
  return (
    <Campo rotulo={rotulo} tamanho={tamanho}>
      <input value={valor ?? ''} onChange={(e) => aoMudar(e.target.value)} {...resto} />
    </Campo>
  )
}

export function Numero({ rotulo, valor, aoMudar, tamanho = 'curto', ...resto }) {
  return (
    <Campo rotulo={rotulo} tamanho={tamanho}>
      <input
        type="number"
        value={valor ?? 0}
        onChange={(e) => aoMudar(e.target.value === '' ? '' : Number(e.target.value))}
        {...resto}
      />
    </Campo>
  )
}

export function Area({ rotulo, valor, aoMudar, linhas = 3 }) {
  return (
    <Campo rotulo={rotulo}>
      <textarea rows={linhas} value={valor ?? ''} onChange={(e) => aoMudar(e.target.value)} />
    </Campo>
  )
}

export function Escolha({ rotulo, valor, aoMudar, opcoes, tamanho }) {
  return (
    <Campo rotulo={rotulo} tamanho={tamanho}>
      <select value={valor} onChange={(e) => aoMudar(e.target.value)}>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
    </Campo>
  )
}

// junta campos curtos na mesma linha
export function Linha({ children }) {
  return <div className="linha-campos">{children}</div>
}

export function Marcador({ situacao }) {
  const nomes = {
    contato: 'Primeiro contato',
    enviado: 'Enviado',
    fechado: 'Fechado',
    instalado: 'Instalado',
    perdido: 'Perdido',
  }
  return <span className={'marcador ' + situacao}>{nomes[situacao] || situacao}</span>
}

export function Vazio({ texto }) {
  return <p className="vazio">{texto}</p>
}
