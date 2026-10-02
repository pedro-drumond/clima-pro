import React, { useState } from 'react'
import { useDados, Vazio } from '../componentes/base.jsx'
import { moeda, totalDoOrcamento } from '../dados/armazenamento.js'

const PERIODOS = [
  { valor: 'mes', texto: 'Este mês' },
  { valor: 'tres', texto: 'Últimos 3 meses' },
  { valor: 'ano', texto: 'Este ano' },
  { valor: 'tudo', texto: 'Tudo' },
]

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

// as duas cores do gráfico foram escolhidas para continuarem distintas para
// quem não enxerga cor da mesma forma
const COR_ORCADO = '#2f6fb5'
const COR_FECHADO = '#c2762a'

function inicioDoPeriodo(periodo) {
  const hoje = new Date()
  if (periodo === 'mes') return new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  if (periodo === 'tres') return new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1)
  if (periodo === 'ano') return new Date(hoje.getFullYear(), 0, 1)
  return null
}

const chaveDoMes = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')

export default function Numeros() {
  const { b, conta } = useDados()
  const [periodo, setPeriodo] = useState('tres')
  const [emCima, setEmCima] = useState(null)

  const todos = b.orcamentos.filter((o) => o.contaId === conta.id)
  const inicio = inicioDoPeriodo(periodo)
  const dentro = (iso) => {
    if (!iso) return false
    if (!inicio) return true
    return new Date(iso) >= inicio
  }

  // o orçamento conta como orçado no dia em que saiu da elaboração
  const dataDoOrcado = (o) => o.enviadoEm || o.criadoEm
  const ganhou = (o) => o.situacao === 'fechado' || o.situacao === 'instalado'

  const orcados = todos.filter((o) => o.situacao !== 'contato' && dentro(dataDoOrcado(o)))
  const fechados = todos.filter((o) => ganhou(o) && dentro(o.decididoEm))
  const perdidos = todos.filter((o) => o.situacao === 'perdido' && dentro(o.decididoEm))

  const valorOrcado = orcados.reduce((s, o) => s + totalDoOrcamento(o), 0)
  const valorFechado = fechados.reduce((s, o) => s + totalDoOrcamento(o), 0)
  const decididos = fechados.length + perdidos.length
  const taxa = decididos ? Math.round((fechados.length / decididos) * 100) : 0
  const ticket = fechados.length ? valorFechado / fechados.length : 0

  // últimos doze meses do gráfico, sempre, para a curva fazer sentido
  const hoje = new Date()
  const quantosMeses = periodo === 'mes' ? 6 : periodo === 'tres' ? 6 : 12
  const meses = []
  for (let i = quantosMeses - 1; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    meses.push({ chave: chaveDoMes(d), rotulo: MESES[d.getMonth()], ano: d.getFullYear(), orcado: 0, fechado: 0 })
  }
  const porChave = Object.fromEntries(meses.map((m) => [m.chave, m]))
  todos.forEach((o) => {
    if (o.situacao !== 'contato') {
      const m = porChave[chaveDoMes(new Date(dataDoOrcado(o)))]
      if (m) m.orcado += totalDoOrcamento(o)
    }
    if (ganhou(o) && o.decididoEm) {
      const m = porChave[chaveDoMes(new Date(o.decididoEm))]
      if (m) m.fechado += totalDoOrcamento(o)
    }
  })
  const teto = Math.max(...meses.map((m) => Math.max(m.orcado, m.fechado)), 1)
  const temGrafico = meses.some((m) => m.orcado > 0 || m.fechado > 0)

  // motivos juntados, do mais comum para o menos
  const motivos = {}
  perdidos.forEach((o) => {
    const texto = (o.motivoPerda || '').trim() || 'Sem motivo registrado'
    motivos[texto] = (motivos[texto] || 0) + 1
  })
  const listaMotivos = Object.entries(motivos).sort((a, b) => b[1] - a[1])

  // medidas do desenho
  const larg = 760
  const alt = 240
  const base = alt - 28
  const topo = 12
  const passo = larg / meses.length
  const largBarra = Math.min(22, passo / 2 - 4)

  return (
    <>
      <div className="cabeca">
        <h1>Financeiro</h1>
        <div className="filtros">
          {PERIODOS.map((p) => (
            <button
              key={p.valor}
              className={'botao pequeno' + (periodo === p.valor ? ' principal' : '')}
              onClick={() => setPeriodo(p.valor)}
            >
              {p.texto}
            </button>
          ))}
        </div>
      </div>

      <div className="numeros-topo">
        <Cartao titulo="Orçado" valor={moeda(valorOrcado)} apoio={orcados.length + ' orçamentos'} />
        <Cartao titulo="Fechado" valor={moeda(valorFechado)} apoio={fechados.length + ' serviços'} />
        <Cartao titulo="Taxa de aprovação" valor={taxa + '%'} apoio={decididos + ' decididos'} />
        <Cartao titulo="Ticket médio" valor={moeda(ticket)} apoio="por serviço fechado" />
      </div>

      <div className="bloco">
        <div className="cabeca-grafico">
          <h2>Mês a mês</h2>
          <div className="legenda">
            <span className="legenda-item">
              <span className="marca-legenda" style={{ background: COR_ORCADO }} />
              Orçado
            </span>
            <span className="legenda-item">
              <span className="marca-legenda" style={{ background: COR_FECHADO }} />
              Fechado
            </span>
          </div>
        </div>

        {!temGrafico ? (
          <Vazio texto="Ainda não há orçamento suficiente para desenhar a curva." />
        ) : (
          <div className="moldura-grafico">
            <svg viewBox={`0 0 ${larg} ${alt}`} className="grafico" role="img" aria-label="Orçado e fechado por mês">
              {[0, 0.5, 1].map((f) => (
                <line
                  key={f}
                  x1="0"
                  x2={larg}
                  y1={base - f * (base - topo)}
                  y2={base - f * (base - topo)}
                  stroke="#e3ebf3"
                  strokeWidth="1"
                />
              ))}

              {meses.map((m, i) => {
                const x = i * passo + passo / 2
                const hO = (m.orcado / teto) * (base - topo)
                const hF = (m.fechado / teto) * (base - topo)
                return (
                  <g key={m.chave} onMouseEnter={() => setEmCima(m.chave)} onMouseLeave={() => setEmCima(null)}>
                    <rect x={i * passo} y={topo} width={passo} height={base - topo} fill="transparent" />
                    <rect
                      x={x - largBarra - 1}
                      y={base - hO}
                      width={largBarra}
                      height={Math.max(hO, m.orcado > 0 ? 3 : 0)}
                      rx="4"
                      fill={COR_ORCADO}
                    />
                    <rect
                      x={x + 1}
                      y={base - hF}
                      width={largBarra}
                      height={Math.max(hF, m.fechado > 0 ? 3 : 0)}
                      rx="4"
                      fill={COR_FECHADO}
                    />
                    <text x={x} y={alt - 8} textAnchor="middle" className="rotulo-mes">
                      {m.rotulo}
                    </text>
                  </g>
                )
              })}
            </svg>

            {emCima ? (
              <div className="dica-grafico">
                <strong>
                  {porChave[emCima].rotulo}/{String(porChave[emCima].ano).slice(2)}
                </strong>
                <span>Orçado {moeda(porChave[emCima].orcado)}</span>
                <span>Fechado {moeda(porChave[emCima].fechado)}</span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="bloco">
        <h2>Por que você perdeu</h2>
        {listaMotivos.length === 0 ? (
          <Vazio texto="Nenhum orçamento perdido no período." />
        ) : (
          listaMotivos.map(([texto, quantas]) => (
            <div className="linha-motivo" key={texto}>
              <span>{texto}</span>
              <span className="barra-motivo">
                <span style={{ width: (quantas / listaMotivos[0][1]) * 100 + '%' }} />
              </span>
              <span className="n">{quantas}</span>
            </div>
          ))
        )}
      </div>
    </>
  )
}

function Cartao({ titulo, valor, apoio }) {
  return (
    <div className="cartao-numero">
      <span className="cartao-titulo">{titulo}</span>
      <span className="cartao-valor">{valor}</span>
      <span className="cartao-apoio">{apoio}</span>
    </div>
  )
}
