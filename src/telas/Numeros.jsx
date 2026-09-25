import React from 'react'
import { useDados, Vazio } from '../componentes/base.jsx'
import { moeda, totalDoOrcamento, custoDoOrcamento, ehPorMargem, dataCurta } from '../dados/armazenamento.js'

export default function Numeros() {
  const { b, conta } = useDados()
  const todos = b.orcamentos.filter((o) => o.contaId === conta.id)
  const enviados = todos.filter((o) => o.enviadoEm)
  const ganhos = todos.filter((o) => o.situacao === 'fechado' || o.situacao === 'instalado')
  const perdidos = todos.filter((o) => o.situacao === 'perdido')
  const decididos = ganhos.length + perdidos.length
  const taxa = decididos ? Math.round((ganhos.length / decididos) * 100) : 0
  const faturado = ganhos.reduce((s, o) => s + totalDoOrcamento(o), 0)
  const comCusto = ganhos.filter((o) => ehPorMargem(o))
  const custo = comCusto.reduce((s, o) => s + custoDoOrcamento(o), 0)
  const faturadoComCusto = comCusto.reduce((s, o) => s + totalDoOrcamento(o), 0)
  const sobra = faturadoComCusto - custo
  const ticket = ganhos.length ? faturado / ganhos.length : 0

  return (
    <>
      <div className="cabeca">
        <h1>Financeiro</h1>
      </div>

      <div className="colunas" style={{ marginBottom: 24 }}>
        <Cartao titulo="Orçamentos enviados" valor={enviados.length} />
        <Cartao titulo="Taxa de aprovação" valor={taxa + '%'} />
        <Cartao titulo="Fechado no período" valor={moeda(faturado)} />
        <Cartao titulo="Ticket médio" valor={moeda(ticket)} />
        <Cartao titulo="Custo dos serviços fechados" valor={moeda(custo)} />
        <Cartao titulo="Sobra depois do custo" valor={moeda(sobra)} />
      </div>

      <div className="duas-colunas">
      <div className="bloco">
        <h2>Por situação</h2>
        <table>
          <tbody>
            {[
              ['contato', 'Primeiro contato'],
              ['enviado', 'Enviado'],
              ['fechado', 'Fechado'],
              ['instalado', 'Instalado'],
              ['perdido', 'Perdido'],
            ].map(([chave, titulo]) => {
              const lista = todos.filter((o) => o.situacao === chave)
              return (
                <tr key={chave}>
                  <td>{titulo}</td>
                  <td className="n">{lista.length}</td>
                  <td className="n">{moeda(lista.reduce((s, o) => s + totalDoOrcamento(o), 0))}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="bloco">
        <h2>Motivos de perda</h2>
        {perdidos.length === 0 ? (
          <Vazio texto="Nenhum orçamento perdido." />
        ) : (
          perdidos.map((o) => {
            const pessoa = b.pessoas.find((p) => p.id === o.pessoaId)
            return (
              <div className="linha-item" key={o.id}>
                <div>
                  <strong>{pessoa ? pessoa.nome : 'Sem pessoa'}</strong>
                  <div className="fraco">{o.motivoPerda || 'Sem motivo registrado'}</div>
                </div>
                <span className="fraco">{dataCurta(o.decididoEm)}</span>
              </div>
            )
          })
        )}
      </div>
      </div>
    </>
  )
}

function Cartao({ titulo, valor }) {
  return (
    <div className="bloco">
      <div className="fraco">{titulo}</div>
      <div className="numero-grande">{valor}</div>
    </div>
  )
}
