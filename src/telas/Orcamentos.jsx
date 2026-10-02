import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDados } from '../componentes/base.jsx'
import { moeda, totalDoOrcamento, dataCurta, parametros, somarDias, hojeISO } from '../dados/armazenamento.js'
import {
  reabrirOrcamento,
  moverOrcamento,
  apagarOrcamento,
  marcarPerdido,
  renovarValidade,
  registrarContato,
  RESULTADOS,
} from '../dados/acoes.js'
import { estadoDoCartao } from '../dados/agenda.js'
import Modelos from './Modelos.jsx'

const ETAPAS = [
  ['contato', 'Em elaboração'],
  ['enviado', 'Enviados'],
  ['fechado', 'Fechados'],
  ['instalado', 'Entregues'],
]

const ORDENS = [
  ['recente', 'Mais recente'],
  ['antigo', 'Mais antigo'],
  ['maior', 'Maior preço'],
  ['menor', 'Menor preço'],
  ['nome', 'Alfabética'],
]

export default function Orcamentos() {
  const { b, conta } = useDados()
  const navegar = useNavigate()
  const [vista, setVista] = useState('quadro')
  const [menuAberto, setMenuAberto] = useState('')
  const [apagando, setApagando] = useState('')
  const [registrando, setRegistrando] = useState('')
  const [arrastando, setArrastando] = useState('')
  const [colunaAlvo, setColunaAlvo] = useState('')
  const [ordens, setOrdens] = useState({})

  const params = parametros(conta)
  const todos = b.orcamentos.filter((o) => o.contaId === conta.id)
  const perdidos = todos.filter((o) => o.situacao === 'perdido')
  const contatos = b.contatos || []
  const pessoaDe = (o) => b.pessoas.find((p) => p.id === o.pessoaId)

  function ordenar(lista, chave) {
    const ordem = ordens[chave] || 'recente'
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

  if (vista === 'modelos') return <Modelos aoVoltar={() => setVista('quadro')} />

  return (
    <>
      <div className="cabeca">
        <h1>Orçamentos</h1>
        <div className="acoes">
          <button
            className={'botao pequeno' + (vista === 'perdidos' ? ' principal' : '')}
            onClick={() => setVista(vista === 'perdidos' ? 'quadro' : 'perdidos')}
          >
            Perdidos {perdidos.length > 0 ? '(' + perdidos.length + ')' : ''}
          </button>
          <button
            className={'botao pequeno modelos' + (vista === 'modelos' ? ' principal' : '')}
            onClick={() => setVista(vista === 'modelos' ? 'quadro' : 'modelos')}
          >
            Modelos
          </button>
          <button className="botao principal" onClick={() => navegar('/orcamentos/novo')}>
            Novo orçamento
          </button>
        </div>
      </div>

      {vista === 'perdidos' ? (
        <div className="perdidos">
          {perdidos.length === 0 ? (
            <p className="fraco">Nenhum orçamento perdido.</p>
          ) : (
            ordenar(perdidos, 'perdido').map((o) => {
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
        <div className="quadro">
          {ETAPAS.map(([chave, titulo]) => {
            const lista = ordenar(todos.filter((o) => o.situacao === chave), chave)
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
                <div className="coluna-topo">
                  <button
                    className={'coluna-cabeca' + (menuAberto === chave ? ' aberta' : '')}
                    onClick={() => setMenuAberto(menuAberto === chave ? '' : chave)}
                    title="Ordenar esta coluna"
                  >
                    <span className="coluna-titulo">{titulo}</span>
                    <span className="coluna-contagem">{lista.length}</span>
                    <span className="coluna-seta">⌄</span>
                  </button>
                  {menuAberto === chave ? (
                    <div className="menu-ordem">
                      {ORDENS.map(([valor, texto]) => (
                        <button
                          key={valor}
                          className={(ordens[chave] || 'recente') === valor ? 'escolhido' : ''}
                          onClick={() => {
                            setOrdens({ ...ordens, [chave]: valor })
                            setMenuAberto('')
                          }}
                        >
                          {texto}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="coluna-lista">
                  {lista.length === 0 ? (
                    <p className="fraco">—</p>
                  ) : (
                    lista.map((o) => {
                      const pessoa = pessoaDe(o)
                      const posicao = ETAPAS.findIndex(([c]) => c === chave)
                      const estado = estadoDoCartao(o, contatos, RESULTADOS)
                      const mover = (passo) => (e) => {
                        e.stopPropagation()
                        moverOrcamento(o, ETAPAS[posicao + passo][0], params)
                      }
                      return (
                        <div
                          className={
                            'cartao' +
                            (arrastando === o.id ? ' arrastando' : '') +
                            (estado.tarja ? ' ' + estado.tarja : '') +
                            (registrando === o.id ? ' aberto' : '')
                          }
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
                          <div className="cartao-canto">
                            {posicao > 0 ? (
                              <button onClick={mover(-1)} title={'Voltar para ' + ETAPAS[posicao - 1][1]}>
                                ‹
                              </button>
                            ) : null}
                            {posicao < ETAPAS.length - 1 ? (
                              <button onClick={mover(1)} title={'Passar para ' + ETAPAS[posicao + 1][1]}>
                                ›
                              </button>
                            ) : null}
                            {chave === 'enviado' && estado.tarja !== 'vencido' ? (
                              <button
                                className="registrar"
                                title="Registrar contato"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setRegistrando(registrando === o.id ? '' : o.id)
                                }}
                              >
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.9"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.4-.7L3 21l1.9-5.1A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
                                </svg>
                              </button>
                            ) : null}
                          </div>

                          <div className="cartao-alto">
                            <div className="cartao-linha-nome">
                              {estado.temperatura ? (
                                <span className={'bolinha ' + estado.temperatura} title={'Negócio ' + estado.temperatura} />
                              ) : null}
                              <span className="cartao-nome">{pessoa ? pessoa.nome : 'Sem cliente'}</span>
                            </div>
                            <div className={'cartao-passo' + (estado.tarja ? ' ' + estado.tarja : '')}>{estado.linha}</div>
                          </div>

                          <div className="cartao-pe">
                            <span className={'valor' + (totalDoOrcamento(o) === 0 ? ' zero' : '')}>
                              {moeda(totalDoOrcamento(o))}
                            </span>
                            {estado.tarja === 'vencido' ? (
                              <span className="cartao-mini">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    renovarValidade(o, o.validadeDias)
                                  }}
                                  title="Empurrar a validade mantendo o preço"
                                >
                                  Renovar
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    marcarPerdido(o.id, 'Validade vencida')
                                  }}
                                >
                                  Perdido
                                </button>
                              </span>
                            ) : null}
                          </div>

                          {registrando === o.id ? (
                            <div className="cartao-menu" onClick={(e) => e.stopPropagation()}>
                              {RESULTADOS.map((r) => (
                                <button
                                  key={r.valor}
                                  onClick={async () => {
                                    setRegistrando('')
                                    await registrarContato({
                                      contaId: conta.id,
                                      pessoaId: o.pessoaId,
                                      orcamentoId: o.id,
                                      resultado: r.valor,
                                      anotacao: '',
                                      proximoEm: somarDias(hojeISO(), r.dias),
                                    })
                                  }}
                                >
                                  <i>
                                    <span className={'bolinha ' + r.temp} />
                                    {r.texto}
                                  </i>
                                  <span>{r.dias}D</span>
                                </button>
                              ))}
                              <div className="menu-risco" />
                              <button
                                className="menu-perdido"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setRegistrando('')
                                  marcarPerdido(o.id, prompt('Por que perdeu?') || '')
                                }}
                              >
                                Perdido
                              </button>
                            </div>
                          ) : null}
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
