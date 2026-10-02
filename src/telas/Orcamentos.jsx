import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDados, Linha, Campo, Texto } from '../componentes/base.jsx'
import { moeda, totalDoOrcamento, dataCurta, parametros, somarDias, hojeISO } from '../dados/armazenamento.js'
import {
  reabrirOrcamento,
  moverOrcamento,
  apagarOrcamento,
  marcarPerdido,
  renovarValidade,
  registrarContato,
  diasSugeridos,
  RESULTADOS,
} from '../dados/acoes.js'
import { marcaDoCartao, tarefasDoDia, primeiroNome } from '../dados/agenda.js'
import { linkWhatsapp } from '../dados/armazenamento.js'

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
  const [registrando, setRegistrando] = useState(null)
  const [arrastando, setArrastando] = useState('')
  const [colunaAlvo, setColunaAlvo] = useState('')
  const [ordens, setOrdens] = useState({})

  const params = parametros(conta)
  const todos = b.orcamentos.filter((o) => o.contaId === conta.id)
  const perdidos = todos.filter((o) => o.situacao === 'perdido')
  const tarefas = tarefasDoDia(b, conta, params)
  const GRUPOS = [
    ['cobranca', 'Cobrar orçamento'],
    ['perda', 'Sem resposta há muito tempo'],
    ['limpeza', 'Limpeza do aparelho'],
    ['parado', 'Cliente sumido'],
  ]
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

  return (
    <>
      <div className="cabeca">
        <h1>Orçamentos</h1>
        <div className="acoes">
          <button
            className={'botao pequeno' + (vista === 'acompanhamento' ? ' principal' : '')}
            onClick={() => setVista(vista === 'acompanhamento' ? 'quadro' : 'acompanhamento')}
          >
            Acompanhamento {tarefas.length > 0 ? '(' + tarefas.length + ')' : ''}
          </button>
          <button
            className={'botao pequeno' + (vista === 'perdidos' ? ' principal' : '')}
            onClick={() => setVista(vista === 'perdidos' ? 'quadro' : 'perdidos')}
          >
            Perdidos {perdidos.length > 0 ? '(' + perdidos.length + ')' : ''}
          </button>
          <button className="botao principal" onClick={() => navegar('/orcamentos/novo')}>
            Novo orçamento
          </button>
        </div>
      </div>

      {vista === 'acompanhamento' ? (
        <div className="acompanhamento">
          {tarefas.length === 0 ? (
            <p className="fraco">Ninguém para chamar hoje.</p>
          ) : (
            GRUPOS.map(([tipo, titulo]) => {
              const doGrupo = tarefas.filter((t) => t.tipo === tipo)
              if (doGrupo.length === 0) return null
              return (
                <div className="grupo-tarefas" key={tipo}>
                  <h2>
                    {titulo} <span className="coluna-contagem">{doGrupo.length}</span>
                  </h2>
                  {doGrupo.map((t) => (
                    <div className="tarefa" key={t.chave}>
                    <div className="linha-tarefa">
                      <div className="tarefa-quem">
                        <div className="tarefa-nome">{t.pessoa.nome}</div>
                        <div className="tarefa-sub">{t.titulo}</div>
                      </div>
                      <div className="acoes">
                        <a
                          className="botao zap pequeno"
                          href={linkWhatsapp(t.pessoa.whatsapp, t.mensagem)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          WhatsApp
                        </a>
                        <button
                          className="botao pequeno"
                          onClick={() =>
                            setRegistrando(
                              registrando?.chave === t.chave
                                ? null
                                : {
                                    chave: t.chave,
                                    tarefa: t,
                                    resultado: 'nao-atendeu',
                                    anotacao: '',
                                    proximoEm: somarDias(hojeISO(), diasSugeridos('nao-atendeu')).slice(0, 10),
                                  }
                            )
                          }
                        >
                          Registrar contato
                        </button>
                      </div>
                    </div>
                    {registrando?.chave === t.chave ? (
                      <div className="caixa-contato">
                        <div className="escolha-resultado">
                          {RESULTADOS.map((r) => (
                            <button
                              key={r.valor}
                              className={registrando.resultado === r.valor ? 'ativo' : ''}
                              onClick={() =>
                                setRegistrando({
                                  ...registrando,
                                  resultado: r.valor,
                                  proximoEm: somarDias(hojeISO(), r.dias).slice(0, 10),
                                })
                              }
                            >
                              {r.texto}
                            </button>
                          ))}
                        </div>
                        <Linha>
                          <Campo rotulo="Falar de novo em" tamanho="medio">
                            <input
                              type="date"
                              value={registrando.proximoEm}
                              onChange={(e) => setRegistrando({ ...registrando, proximoEm: e.target.value })}
                            />
                          </Campo>
                          <Texto
                            rotulo="Anotação (opcional)"
                            valor={registrando.anotacao}
                            aoMudar={(v) => setRegistrando({ ...registrando, anotacao: v })}
                          />
                        </Linha>
                        <div className="acoes">
                          <button
                            className="botao principal pequeno"
                            onClick={async () => {
                              await registrarContato({
                                contaId: conta.id,
                                pessoaId: t.pessoa.id,
                                orcamentoId: t.orcamento?.id,
                                equipamentoId: t.equipamento?.id,
                                resultado: registrando.resultado,
                                anotacao: registrando.anotacao,
                                proximoEm: new Date(registrando.proximoEm + 'T12:00:00').toISOString(),
                              })
                              setRegistrando(null)
                            }}
                          >
                            Salvar
                          </button>
                          <button className="botao pequeno" onClick={() => setRegistrando(null)}>
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : null}
                    </div>
                  ))}
                </div>
              )
            })
          )}
        </div>
      ) : vista === 'perdidos' ? (
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
                      const marca = marcaDoCartao(o, params)
                      const mover = (passo) => (e) => {
                        e.stopPropagation()
                        moverOrcamento(o, ETAPAS[posicao + passo][0], params)
                      }
                      return (
                        <div
                          className={
                            'cartao' +
                            (arrastando === o.id ? ' arrastando' : '') +
                            (marca ? ' marcado ' + marca.tipo : '')
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
                          {marca ? (
                            <div className="cartao-marca">
                              <span>{marca.texto}</span>
                              {marca.tipo === 'vencido' ? (
                                <span className="cartao-acoes">
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
                                    title="Dar como perdido"
                                  >
                                    Perdido
                                  </button>
                                </span>
                              ) : null}
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
