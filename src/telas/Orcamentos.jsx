import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDados } from '../componentes/base.jsx'
import { moeda, totalDoOrcamento, dataCurta, parametros } from '../dados/armazenamento.js'
import { reabrirOrcamento, moverOrcamento, apagarOrcamento } from '../dados/acoes.js'

const ETAPAS = [
  ['contato', 'Em elaboração'],
  ['enviado', 'Enviados'],
  ['fechado', 'Fechados'],
  ['instalado', 'Entregues'],
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
  const [apagando, setApagando] = useState('')
  const [arrastando, setArrastando] = useState('')
  const [colunaAlvo, setColunaAlvo] = useState('')
  const [ordem, setOrdem] = useState('recente')

  const params = parametros(conta)
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

  function soltarEm(chave) {
    const o = todos.find((x) => x.id === arrastando)
    setArrastando('')
    setColunaAlvo('')
    if (o && o.situacao !== chave) moverOrcamento(o, chave, params)
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

              if (apagando === o.id) {
                return (
                  <div className="cartao-perdido confirmando" key={o.id}>
                    <div className="perdido-pergunta">Apagar este orçamento de vez?</div>
                    <div className="acoes">
                      <button className="botao perigo pequeno" onClick={() => apagarOrcamento(o.id)}>
                        Apagar
                      </button>
                      <button className="botao pequeno" onClick={() => setApagando('')}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  className="cartao-perdido"
                  key={o.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => navegar('/orcamentos/' + o.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') navegar('/orcamentos/' + o.id)
                  }}
                >
                  <button
                    className="perdido-apagar"
                    title="Apagar"
                    onClick={(e) => {
                      e.stopPropagation()
                      setApagando(o.id)
                    }}
                  >
                    ×
                  </button>
                  <div className="perdido-nome">{pessoa ? pessoa.nome : 'Sem cliente'}</div>
                  <div className="perdido-sub">
                    nº {o.numero} · {dataCurta(o.decididoEm || o.criadoEm)}
                  </div>
                  <div className="perdido-rodape">
                    <span className="valor">{moeda(totalDoOrcamento(o))}</span>
                    <button
                      className="botao pequeno"
                      onClick={(e) => {
                        e.stopPropagation()
                        reabrirOrcamento(o)
                      }}
                    >
                      Reabrir
                    </button>
                  </div>
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
              <div
                className={'coluna' + (colunaAlvo === chave ? ' recebendo' : '')}
                key={chave}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (colunaAlvo !== chave) setColunaAlvo(chave)
                }}
                onDragLeave={() => setColunaAlvo((atual) => (atual === chave ? '' : atual))}
                onDrop={(e) => {
                  e.preventDefault()
                  soltarEm(chave)
                }}
              >
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
                      const posicao = ETAPAS.findIndex(([c]) => c === chave)
                      const mover = (passo) => (e) => {
                        e.stopPropagation()
                        moverOrcamento(o, ETAPAS[posicao + passo][0], params)
                      }
                      return (
                        <div
                          className={'cartao' + (arrastando === o.id ? ' arrastando' : '')}
                          key={o.id}
                          role="link"
                          tabIndex={0}
                          draggable
                          onDragStart={() => setArrastando(o.id)}
                          onDragEnd={() => {
                            setArrastando('')
                            setColunaAlvo('')
                          }}
                          onClick={() => navegar('/orcamentos/' + o.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') navegar('/orcamentos/' + o.id)
                          }}
                        >
                          <div className="cartao-setas">
                            {posicao > 0 ? (
                              <button onClick={mover(-1)} title={'Voltar para ' + ETAPAS[posicao - 1][1]}>
                                ‹
                              </button>
                            ) : (
                              <span />
                            )}
                            {posicao < ETAPAS.length - 1 ? (
                              <button onClick={mover(1)} title={'Passar para ' + ETAPAS[posicao + 1][1]}>
                                ›
                              </button>
                            ) : (
                              <span />
                            )}
                          </div>
                          <div className="cartao-nome">{pessoa ? pessoa.nome : 'Sem cliente'}</div>
                          <div className="cartao-sub">
                            nº {o.numero} · {dataCurta(o.enviadoEm || o.criadoEm)}
                          </div>
                          <div className="valor">{moeda(totalDoOrcamento(o))}</div>
                        </div>
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
