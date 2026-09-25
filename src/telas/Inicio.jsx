import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDados, Marcador, Vazio } from '../componentes/base.jsx'
import { parametros, moeda, totalDoOrcamento, dataCurta } from '../dados/armazenamento.js'
import { tarefasDoDia } from '../dados/agenda.js'

export default function Inicio() {
  const { b, conta } = useDados()
  const navegar = useNavigate()
  const params = parametros(conta)
  const tarefas = tarefasDoDia(b, conta, params)
  const abertos = b.orcamentos.filter((o) => o.contaId === conta.id && o.situacao === 'enviado')
  const parado = abertos.reduce((s, o) => s + totalDoOrcamento(o), 0)

  return (
    <>
      <div className="colunas" style={{ marginBottom: 24 }}>
        <div className="bloco">
          <div className="fraco">Para chamar hoje</div>
          <div className="numero-grande">{tarefas.length}</div>
        </div>
        <div className="bloco">
          <div className="fraco">Orçamentos em aberto</div>
          <div className="numero-grande">{abertos.length}</div>
        </div>
        <div className="bloco">
          <div className="fraco">Valor parado</div>
          <div className="numero-grande">{moeda(parado)}</div>
        </div>
      </div>

      <div style={{ marginBottom: 26 }}>
        <button className="botao principal grande" onClick={() => navegar('/orcamentos/novo')}>
          Novo orçamento
        </button>
      </div>

      <div className="bloco">
        <div className="cabeca" style={{ marginBottom: 10 }}>
          <h2 style={{ margin: 0 }}>Quem chamar hoje</h2>
          <Link to="/chamar">Ver todos</Link>
        </div>
        {tarefas.length === 0 ? (
          <Vazio texto="Ninguém vencido hoje." />
        ) : (
          tarefas.slice(0, 4).map((t) => (
            <div className="linha-item" key={t.chave}>
              <div>
                <Link to={'/pessoas/' + t.pessoa.id}>{t.pessoa.nome}</Link>
                <div className="fraco">{t.titulo}</div>
              </div>
              <span className="fraco">venceu {dataCurta(t.vencimento)}</span>
            </div>
          ))
        )}
      </div>

      <div className="bloco">
        <div className="cabeca" style={{ marginBottom: 10 }}>
          <h2 style={{ margin: 0 }}>Orçamentos em aberto</h2>
          <Link to="/orcamentos">Ver quadro</Link>
        </div>
        {abertos.length === 0 ? (
          <Vazio texto="Nenhum orçamento aguardando resposta." />
        ) : (
          abertos.map((o) => {
            const pessoa = b.pessoas.find((p) => p.id === o.pessoaId)
            return (
              <div className="linha-item" key={o.id}>
                <div>
                  <Link to={'/orcamentos/' + o.id}>{pessoa ? pessoa.nome : 'Sem pessoa'}</Link>
                  <div className="fraco">
                    nº {o.numero} · enviado em {dataCurta(o.enviadoEm)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span className="valor">{moeda(totalDoOrcamento(o))}</span>
                  <Marcador situacao={o.situacao} />
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
