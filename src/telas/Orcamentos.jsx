import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDados } from '../componentes/base.jsx'
import { moeda, totalDoOrcamento, dataCurta, parametros, somarDias, hojeISO } from '../dados/armazenamento.js'
import { TEMPERATURAS, resultadosDa, OUTRO, DIAS_DO_OUTRO, diaMes } from '../dados/vocabulario.js'
import { Temperatura, SetaAcao, Alerta, Balao } from '../componentes/icones.jsx'
import {
  reabrirOrcamento,
  moverOrcamento,
  apagarOrcamento,
  marcarPerdido,
  renovarValidade,
  registrarContato,
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
  // o menu tem dois passos: primeiro a temperatura, depois a frase
  const [tempEscolhida, setTempEscolhida] = useState('')
  const [textoLivre, setTextoLivre] = useState('')
  const [diaEscolhido, setDiaEscolhido] = useState('')
  const [editandoDia, setEditandoDia] = useState('')

  function fecharMenu() {
    setRegistrando('')
    setTempEscolhida('')
    setTextoLivre('')
    setDiaEscolhido('')
    setEditandoDia('')
  }

  // o dia que vai ser gravado: o escolhido na mão, senão o prazo da frase
  const diaDe = (dias) => (diaEscolhido ? new Date(diaEscolhido + 'T12:00:00').toISOString() : somarDias(hojeISO(), dias))

  async function registrar(orcamento, resultado, dias, anotacao) {
    const proximoEm = diaDe(dias)
    fecharMenu()
    await registrarContato({
      contaId: conta.id,
      pessoaId: orcamento.pessoaId,
      orcamentoId: orcamento.id,
      resultado,
      anotacao: anotacao || '',
      proximoEm,
    })
  }
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
                      const estado = estadoDoCartao(o, contatos)
                      const aberto = registrando === o.id
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
                            (aberto ? ' aberto' : '')
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
                          {/* nome com a temperatura, e no canto o prazo */}
                          <div className="cartao-topo">
                            <div className="cartao-linha-nome">
                              {estado.temperatura ? (
                                <Temperatura valor={estado.temperatura} tamanho={11} traco={2.4} />
                              ) : null}
                              <span className="cartao-nome">{pessoa ? pessoa.nome : 'Sem cliente'}</span>
                            </div>
                            {estado.prazo ? (
                              <span className={'cartao-prazo ' + estado.prazo.estado}>
                                {estado.prazo.estado === 'ok' ? null : <Alerta />}
                                {estado.prazo.texto}
                              </span>
                            ) : null}
                          </div>

                          {/* as duas últimas ações, a seta aponta para a mais recente */}
                          <div className="cartao-acoes" title={estado.tudo.map((t) => t.texto).join('  →  ')}>
                            {estado.vazio ? (
                              <span className="acao-vazia">{estado.vazio}</span>
                            ) : (
                              estado.ultimas.map((t, i) => (
                                <React.Fragment key={i}>
                                  {i > 0 ? <SetaAcao /> : null}
                                  <span className="acao">
                                    <Temperatura valor={t.temp} tamanho={13} />
                                    {t.curto}
                                  </span>
                                </React.Fragment>
                              ))
                            )}
                          </div>

                          <div className="cartao-pe">
                            <span className={'valor' + (totalDoOrcamento(o) === 0 ? ' zero' : '')}>
                              {moeda(totalDoOrcamento(o))}
                            </span>

                            <span className="cartao-mini">
                              {estado.tarja === 'vencido' ? (
                                <>
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
                                </>
                              ) : (
                                <>
                                  {posicao > 0 ? (
                                    <button className="seta" onClick={mover(-1)} title={'Voltar para ' + ETAPAS[posicao - 1][1]}>
                                      ‹
                                    </button>
                                  ) : null}
                                  {posicao < ETAPAS.length - 1 ? (
                                    <button className="seta" onClick={mover(1)} title={'Passar para ' + ETAPAS[posicao + 1][1]}>
                                      ›
                                    </button>
                                  ) : null}
                                  {chave === 'enviado' ? (
                                    <button
                                      className="registrar"
                                      title="Registrar o que o cliente fez"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        if (aberto) fecharMenu()
                                        else {
                                          fecharMenu()
                                          setRegistrando(o.id)
                                        }
                                      }}
                                    >
                                      <Balao />
                                    </button>
                                  ) : null}
                                </>
                              )}
                            </span>
                          </div>

                          {aberto ? (
                            <div className="cartao-menu" onClick={(e) => e.stopPropagation()}>
                              {!tempEscolhida ? (
                                <div className="menu-temperaturas">
                                  {TEMPERATURAS.map((t) => (
                                    <button key={t.valor} onClick={() => setTempEscolhida(t.valor)}>
                                      <Temperatura valor={t.valor} tamanho={22} traco={2} />
                                      {t.texto}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <>
                                  <div className="menu-cabeca">
                                    <button className="menu-voltar" onClick={() => setTempEscolhida('')}>
                                      ‹
                                    </button>
                                    <Temperatura valor={tempEscolhida} tamanho={15} traco={2.2} />
                                    {TEMPERATURAS.find((t) => t.valor === tempEscolhida).texto}
                                  </div>

                                  {resultadosDa(tempEscolhida).map((r) => (
                                    <button
                                      key={r.valor}
                                      className="menu-frase"
                                      onClick={() => registrar(o, r.valor, r.dias)}
                                    >
                                      <i>{r.texto}</i>
                                      <span
                                        className={'menu-dia' + (diaEscolhido ? ' trocado' : '')}
                                        role="button"
                                        tabIndex={0}
                                        title="Trocar o dia de chamar"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setEditandoDia(editandoDia === r.valor ? '' : r.valor)
                                        }}
                                      >
                                        {diaEscolhido
                                          ? diaMes(new Date(diaEscolhido + 'T12:00:00').toISOString())
                                          : diaMes(somarDias(hojeISO(), r.dias))}
                                      </span>
                                    </button>
                                  ))}

                                  {editandoDia ? (
                                    <input
                                      className="menu-calendario"
                                      type="date"
                                      value={diaEscolhido}
                                      onChange={(e) => setDiaEscolhido(e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  ) : null}

                                  <div className="menu-risco" />

                                  <div className="menu-outro">
                                    <input
                                      className="texto"
                                      placeholder="Outro…"
                                      value={textoLivre}
                                      onChange={(ev) => setTextoLivre(ev.target.value)}
                                      onClick={(ev) => ev.stopPropagation()}
                                      onKeyDown={(ev) => {
                                        if (ev.key === 'Enter' && textoLivre.trim()) {
                                          registrar(o, OUTRO[tempEscolhida], DIAS_DO_OUTRO[tempEscolhida], textoLivre.trim())
                                        }
                                      }}
                                    />
                                    <div className="pe">
                                      <input
                                        type="date"
                                        value={diaEscolhido || somarDias(hojeISO(), DIAS_DO_OUTRO[tempEscolhida]).slice(0, 10)}
                                        onChange={(ev) => setDiaEscolhido(ev.target.value)}
                                        onClick={(ev) => ev.stopPropagation()}
                                      />
                                      <button
                                        className="botao miudo principal"
                                        disabled={!textoLivre.trim()}
                                        onClick={() =>
                                          registrar(o, OUTRO[tempEscolhida], DIAS_DO_OUTRO[tempEscolhida], textoLivre.trim())
                                        }
                                      >
                                        Marcar
                                      </button>
                                    </div>
                                  </div>

                                  <button
                                    className="menu-perdido"
                                    onClick={() => {
                                      fecharMenu()
                                      marcarPerdido(o.id, prompt('Por que perdeu?') || '')
                                    }}
                                  >
                                    Perdido
                                  </button>
                                </>
                              )}
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
