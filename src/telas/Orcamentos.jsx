import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDados } from '../componentes/base.jsx'
import { moeda, totalDoOrcamento, dataCurta } from '../dados/armazenamento.js'
import { reabrirOrcamento } from '../dados/acoes.js'

const ETAPAS = [
  ['contato', 'Em elaboração'],
  ['enviado', 'Enviados'],
  ['fechado', 'Fechados'],
  ['instalado', 'Instalados'],
]

const ORDENS = [
  ['recente', 'Mais recente'],
  ['antigo', 'Mais antigo'],
  ['maior', 'Maior valor'],
  ['menor', 'Menor valor'],
  ['nome', 'Nome do cliente'],
]

export default function Orcamentos() {
  const { b, conta } = useDados()
  const navegar = useNavigate()
  const [verPerdidos, setVerPerdidos] = useState(false)
  const [colunaSozinha, setColunaSozinha] = useState('')
  const [motivoAberto, setMotivoAberto] = useState('')
  const [ordem, setOrdem] = useState('recente')

  const todos = b.orcamentos.filter((o) => o.contaId === conta.id)
  const perdidos = todos.filter((o) => o.situacao === 'perdido')
  const pessoaDe = (o) => b.pessoas.find((p) => p.id === o.pessoaId)

  function ordenar(lista) {
    const copia = lista.slice()
    const data = (o) => new Date(o.enviadoEm || o.criadoEm).getTime()
    const nome = (o) => (pessoaDe(o)?.nome || '').toLowerCase()
    if (ordem === 'recente') copia.sort((a, c) => data(c) - data(a))
    if (ordem === 'antigo') copia.sort((a, c) => data(a) - data(c))
    if (ordem === 'maior') copia.sort((a, c) => totalDoOrcamento(c) - totalDoOrcamento(a))
    if (ordem === 'menor') copia.sort((a, c) => totalDoOrcamento(a) - totalDoOrcamento(c))
    if (ordem === 'nome') copia.sort((a, c) => nome(a).localeCompare(nome(c)))
    return copia
  }

  const etapasNaTela = colunaSozinha ? ETAPAS.filter(([c]) => c === colunaSozinha) : ETAPAS

  return (
    <>
      <div className="cabeca">
        <h1>Orçamentos</h1>
        <div className="acoes">
          <span className="ordenar">
            Ordenar por
            <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
              {ORDENS.map(([valor, texto]) => (
                <option key={valor} value={valor}>
                  {texto}
                </option>
              ))}
            </select>
          </span>
          <button
            className={'botao pequeno' + (verPerdidos ? ' principal' : '')}
            onClick={() => setVerPerdidos(!verPerdidos)}
          >
            Perdidos {perdidos.length > 0 ? '(' + perdidos.length + ')' : ''}
          </button>
          <button className="botao principal" onClick={() => navegar('/orcamentos/novo')}>
            Novo orçamento
          </button>
        </div>
      </div>

      {verPerdidos ? (
        <div className="perdidos">
          {perdidos.length === 0 ? (
            <p className="fraco">Nenhum orçamento perdido.</p>
          ) : (
            ordenar(perdidos).map((o) => {
              const pessoa = pessoaDe(o)
              const aberto = motivoAberto === o.id
              return (
                <div className={'cartao-perdido' + (aberto ? ' aberto' : '')} key={o.id}>
                  <button
                    className="perdido-topo"
                    onClick={() => setMotivoAberto(aberto ? '' : o.id)}
                    title="Ver o motivo"
                  >
                    <span className="perdido-nome">{pessoa ? pessoa.nome : 'Sem cliente'}</span>
                    <span className="perdido-sub">
                      nº {o.numero} · {dataCurta(o.decididoEm || o.criadoEm)}
                    </span>
                    <span className="perdido-valor">{moeda(totalDoOrcamento(o))}</span>
                  </button>
                  {aberto ? (
                    <div className="perdido-motivo">
                      <p>{o.motivoPerda || 'Sem motivo registrado.'}</p>
                      <div className="acoes">
                        <Link className="botao pequeno" to={'/orcamentos/' + o.id}>
                          Abrir orçamento
                        </Link>
                        <button className="botao pequeno" onClick={() => reabrirOrcamento(o)}>
                          Reabrir
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })
          )}
        </div>
      ) : (
        <div className={'quadro' + (colunaSozinha ? ' uma-coluna' : '')}>
          {etapasNaTela.map(([chave, titulo]) => {
            const lista = ordenar(todos.filter((o) => o.situacao === chave))
            const soma = lista.reduce((s, o) => s + totalDoOrcamento(o), 0)
            return (
              <div className="coluna" key={chave}>
                <button
                  className={'coluna-cabeca' + (colunaSozinha === chave ? ' sozinha' : '')}
                  onClick={() => setColunaSozinha(colunaSozinha === chave ? '' : chave)}
                  title={colunaSozinha === chave ? 'Ver o quadro inteiro' : 'Ver só esta coluna'}
                >
                  <span className="coluna-titulo">{titulo}</span>
                  <span className="coluna-contagem">{lista.length}</span>
                </button>
                <div className="coluna-lista">
                  {lista.length === 0 ? (
                    <p className="fraco">—</p>
                  ) : (
                    lista.map((o) => {
                      const pessoa = pessoaDe(o)
                      return (
                        <Link className="cartao" to={'/orcamentos/' + o.id} key={o.id}>
                          <div className="cartao-nome">{pessoa ? pessoa.nome : 'Sem cliente'}</div>
                          <div className="cartao-sub">
                            nº {o.numero} · {dataCurta(o.enviadoEm || o.criadoEm)}
                          </div>
                          <div className="valor">{moeda(totalDoOrcamento(o))}</div>
                        </Link>
                      )
                    })
                  )}
                </div>
                {lista.length > 0 ? <div className="coluna-soma fraco">Soma: {moeda(soma)}</div> : null}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
