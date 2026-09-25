import React, { useState } from 'react'
import { useDados, Texto, Escolha, Vazio, Linha } from '../componentes/base.jsx'
import { moeda, precoDoCusto } from '../dados/armazenamento.js'
import { salvarItem, apagarItem } from '../dados/acoes.js'

export const TIPOS = [
  { valor: 'servico', texto: 'Serviço' },
  { valor: 'material', texto: 'Material' },
  { valor: 'equipamento', texto: 'Equipamento' },
  { valor: 'outro', texto: 'Outros' },
]

const UNIDADES = ['unidade', 'metro', 'hora', 'diária', 'peça']

const VAZIO = { tipo: 'servico', tipoOutro: '', tipoPreco: 'custo', nome: '', unidade: 'unidade', custo: '' }

export function nomeDoTipo(item) {
  if (item.tipo === 'outro') return item.tipoOutro || 'Outros'
  return TIPOS.find((t) => t.valor === item.tipo)?.texto || item.tipo
}

export default function Biblioteca() {
  const { b, conta } = useDados()
  const [filtro, setFiltro] = useState('todos')
  const [novo, setNovo] = useState(VAZIO)
  const [outraUnidade, setOutraUnidade] = useState(false)

  const itens = b.itens
    .filter((i) => i.contaId === conta.id)
    .filter((i) => filtro === 'todos' || i.tipo === filtro)

  function adicionar() {
    if (!novo.nome.trim()) return
    salvarItem({ ...novo, custo: Number(novo.custo) || 0 }, conta.id)
    setNovo({ ...VAZIO, tipo: novo.tipo, tipoPreco: novo.tipoPreco, unidade: novo.unidade })
  }

  const porVenda = novo.tipoPreco === 'venda'

  return (
    <>
      <div className="cabeca">
        <h1>Biblioteca</h1>
      </div>

      <div className="bloco">
        <h2>Novo item</h2>
        <Texto rotulo="Nome" valor={novo.nome} aoMudar={(v) => setNovo({ ...novo, nome: v })} />
        <Linha>
          <Escolha
            rotulo="Tipo"
            tamanho="medio"
            valor={novo.tipo}
            aoMudar={(v) => setNovo({ ...novo, tipo: v, tipoOutro: '' })}
            opcoes={TIPOS}
          />
          {novo.tipo === 'outro' ? (
            <Texto
              rotulo="Qual?"
              tamanho="medio"
              valor={novo.tipoOutro}
              aoMudar={(v) => setNovo({ ...novo, tipoOutro: v })}
            />
          ) : null}

          <Escolha
            rotulo="Unidade"
            tamanho="medio"
            valor={outraUnidade ? 'outra' : novo.unidade}
            aoMudar={(v) => {
              if (v === 'outra') {
                setOutraUnidade(true)
                setNovo({ ...novo, unidade: '' })
              } else {
                setOutraUnidade(false)
                setNovo({ ...novo, unidade: v })
              }
            }}
            opcoes={UNIDADES.map((u) => ({ valor: u, texto: u[0].toUpperCase() + u.slice(1) })).concat([
              { valor: 'outra', texto: 'Outra' },
            ])}
          />
          {outraUnidade ? (
            <Texto
              rotulo="Qual unidade?"
              tamanho="medio"
              valor={novo.unidade}
              aoMudar={(v) => setNovo({ ...novo, unidade: v })}
            />
          ) : null}

          <Escolha
            rotulo="O valor é"
            tamanho="medio"
            valor={novo.tipoPreco}
            aoMudar={(v) => setNovo({ ...novo, tipoPreco: v })}
            opcoes={[
              { valor: 'custo', texto: 'Custo' },
              { valor: 'venda', texto: 'Preço de venda' },
            ]}
          />
          <Texto
            rotulo={porVenda ? 'Preço de venda (R$)' : 'Custo (R$)'}
            tamanho="curto"
            type="number"
            valor={novo.custo}
            aoMudar={(v) => setNovo({ ...novo, custo: v })}
          />
        </Linha>
        <button className="botao principal" onClick={adicionar}>
          Adicionar
        </button>
        <p className="fraco">
          Item de custo entra no orçamento por margem. Item de preço de venda entra no orçamento por preço de venda.
          No orçamento de itens avulsos aparecem os dois.
        </p>
      </div>

      <div className="filtros">
        {[{ valor: 'todos', texto: 'Todos' }].concat(TIPOS).map((t) => (
          <button
            key={t.valor}
            className={'botao pequeno' + (filtro === t.valor ? ' principal' : '')}
            onClick={() => setFiltro(t.valor)}
          >
            {t.texto}
          </button>
        ))}
      </div>

      <div className="bloco">
        {itens.length === 0 ? (
          <Vazio texto="Nenhum item cadastrado." />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th className="n">Valor</th>
                <th className="n">Preço com sua margem</th>
                <th className="n"></th>
              </tr>
            </thead>
            <tbody>
              {itens.map((i) => (
                <tr key={i.id}>
                  <td>
                    <input
                      value={i.nome}
                      onChange={(e) => salvarItem({ ...i, nome: e.target.value }, conta.id)}
                      style={{ width: '100%', border: 'none', padding: 0, fontWeight: 600 }}
                    />
                    <div className="fraco">
                      {nomeDoTipo(i)} · por {i.unidade} · {i.tipoPreco === 'venda' ? 'preço de venda' : 'custo'}
                    </div>
                  </td>
                  <td className="n" style={{ width: 120 }}>
                    <input
                      type="number"
                      value={i.custo}
                      onChange={(e) => salvarItem({ ...i, custo: Number(e.target.value) }, conta.id)}
                      style={{
                        width: 110,
                        textAlign: 'right',
                        padding: '6px 8px',
                        border: '1px solid #e2e6ea',
                        borderRadius: 8,
                      }}
                    />
                  </td>
                  <td className="n">
                    {i.tipoPreco === 'venda' ? (
                      <span className="fraco">—</span>
                    ) : (
                      moeda(precoDoCusto(i.custo, conta.margemPct, conta.impostoPct))
                    )}
                  </td>
                  <td className="n">
                    <button className="botao perigo" onClick={() => apagarItem(i.id)}>
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="fraco">
        O preço da coluna da direita usa a margem de {conta.margemPct}% e o imposto de {conta.impostoPct}% da sua
        empresa. Em cada orçamento dá para mudar.
      </p>
    </>
  )
}
