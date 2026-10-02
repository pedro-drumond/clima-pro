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
      <header className="topo">
        <nav className="menu">
          {master ? (
            <>
              <Item para="/master" texto="Contas" />
              <Item para="/master/parametros" texto="Parâmetros gerais" />
            </>
          ) : (
            <>
              <Item para="/" texto="Início" fim />
              <Item para="/orcamentos" texto="Orçamentos" />
              <Item para="/pessoas" texto="Clientes" />
              <Item para="/biblioteca" texto="Biblioteca" />
              <Item para="/numeros" texto="Financeiro" />
              <Item para="/empresa" texto="Minha empresa" />
              <Item para="/ajuda" texto="Ajuda" />
            </>
          )}
          <span className="menu-divisor" />
          <button
            className="menu-sair"
            onClick={async () => {
              gravarPendentes()
              await sair()
              navegar('/entrar')
            }}
          >
            Sair
          </button>
        </nav>

        <div className="topo-direita">
          <span className="topo-conta">{conta ? conta.nomeFantasia : usuario ? usuario.nome : ''}</span>
          <span className="topo-marca">
            <Logo />
            Clima Pro
          </span>
        </div>
      </header>
      <div className="conteudo">{children}</div>
    </div>
  )
}

// marca do Clima Pro: o ar saindo do aparelho, em três correntes
export function Logo({ tamanho = 22 }) {
  return (
    <svg className="logo" width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="3.5" width="19" height="7.5" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M6 7.2h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      <path
        d="M6.5 15c1.6-1.6 3.1 1.6 4.7 0M9.5 19.4c1.6-1.6 3.1 1.6 4.7 0M13.5 14.6c1.6-1.6 3.1 1.6 4.7 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
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

export function Area({ rotulo, valor, aoMudar, linhas = 3, tamanho }) {
  return (
    <Campo rotulo={rotulo} tamanho={tamanho}>
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
    instalado: 'Entregue',
    perdido: 'Perdido',
  }
  return <span className={'marcador ' + situacao}>{nomes[situacao] || situacao}</span>
}

export function Vazio({ texto }) {
  return <p className="vazio">{texto}</p>
}
