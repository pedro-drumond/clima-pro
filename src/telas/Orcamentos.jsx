import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDados, Marcador, Vazio } from '../componentes/base.jsx'
import { moeda, totalDoOrcamento, dataCurta } from '../dados/armazenamento.js'

const ETAPAS = [
  ['contato', 'Primeiro contato'],
  ['enviado', 'Orçamento enviado'],
  ['fechado', 'Fechado'],
  ['instalado', 'Instalado'],
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
  const [ordem, setOrdem] = useState('recente')
  const todos = b.orcamentos.filter((o) => o.contaId === conta.id)
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
          <span className="ordenar">
            Ver
            <select value={verPerdidos ? 'perdidos' : 'quadro'} onChange={(e) => setVerPerdidos(e.target.value === 'perdidos')}>
              <option value="quadro">Quadro de etapas</option>
              <option value="perdidos">Perdidos ({todos.filter((o) => o.situacao === 'perdido').length})</option>
            </select>
          </span>
          <button className="botao principal" onClick={() => navegar('/orcamentos/novo')}>
            Novo orçamento
          </button>
        </div>
      </div>

      <div className="quadro" style={{ display: verPerdidos ? 'none' : undefined }}>
        {ETAPAS.map(([chave, titulo]) => {
          const lista = ordenar(todos.filter((o) => o.situacao === chave))
          const soma = lista.reduce((s, o) => s + totalDoOrcamento(o), 0)
          return (
            <div className="coluna" key={chave}>
              <h3>
                {titulo} ({lista.length})
              </h3>
              <div className="coluna-lista">
                {lista.length === 0 ? (
                  <p className="fraco">—</p>
                ) : (
                  lista.map((o) => {
                    const pessoa = pessoaDe(o)
                    return (
                      <Link className="cartao" to={'/orcamentos/' + o.id} key={o.id}>
                        <div style={{ fontWeight: 600 }}>{pessoa ? pessoa.nome : 'Sem pessoa'}</div>
                        <div className="fraco">
                          nº {o.numero} · {dataCurta(o.enviadoEm || o.criadoEm)}
                        </div>
                        <div className="valor" style={{ marginTop: 8 }}>
                          {moeda(totalDoOrcamento(o))}
                        </div>
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

      {verPerdidos ? (
        <div className="bloco" style={{ marginTop: 20 }}>
          <h2>Perdidos</h2>
          {todos.filter((o) => o.situacao === 'perdido').length === 0 ? (
            <Vazio texto="Nenhum perdido." />
          ) : (
            ordenar(todos.filter((o) => o.situacao === 'perdido')).map((o) => {
              const pessoa = pessoaDe(o)
              return (
                <div className="linha-item" key={o.id}>
                  <div style={{ minWidth: 0 }}>
                    <Link to={'/orcamentos/' + o.id}>{pessoa ? pessoa.nome : 'Sem pessoa'}</Link>
                    <div className="fraco">{o.motivoPerda || 'Sem motivo registrado'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <span className="valor">{moeda(totalDoOrcamento(o))}</span>
                    <Marcador situacao="perdido" />
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : null}
    </>
  )
}
