import React, { useState } from 'react'
import { useDados, Texto, Escolha, Vazio } from '../componentes/base.jsx'
import { Icone } from '../componentes/icones.jsx'
import { moeda, precoDoCusto } from '../dados/armazenamento.js'
import { salvarItem, apagarItem } from '../dados/acoes.js'

export const TIPOS = [
  { valor: 'servico', texto: 'Serviço' },
  { valor: 'material', texto: 'Material' },
  { valor: 'equipamento', texto: 'Equipamento' },
  { valor: 'outro', texto: 'Outros' },
]

const UNIDADES = [
  { valor: 'unidade', texto: 'Un.' },
  { valor: 'metro', texto: 'Metro' },
  { valor: 'hora', texto: 'Hora' },
  { valor: 'diária', texto: 'Diária' },
  { valor: 'peça', texto: 'Peça' },
]

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
  const Lixeira = Icone.lixeira

  return (
    <>
      <div className="cabeca">
        <h1>Biblioteca</h1>
      </div>

      <div className="tela-dupla">
        <div className="bloco">
          <h2>Novo item</h2>

          <div className="forma">
            <div className="forma-larga">
              <Texto rotulo="Nome" valor={novo.nome} aoMudar={(v) => setNovo({ ...novo, nome: v })} />
            </div>

            <Escolha
              rotulo="Tipo"
              valor={novo.tipo}
              aoMudar={(v) => setNovo({ ...novo, tipo: v, tipoOutro: '' })}
              opcoes={TIPOS}
            />
            <Escolha
              rotulo="Unidade"
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
              opcoes={UNIDADES.concat([{ valor: 'outra', texto: 'Outra' }])}
            />

            {novo.tipo === 'outro' ? (
              <div className="forma-larga">
                <Texto
                  rotulo="Qual tipo?"
                  valor={novo.tipoOutro}
                  aoMudar={(v) => setNovo({ ...novo, tipoOutro: v })}
                />
              </div>
            ) : null}

            {outraUnidade ? (
              <div className="forma-larga">
                <Texto
                  rotulo="Qual unidade?"
                  valor={novo.unidade}
                  aoMudar={(v) => setNovo({ ...novo, unidade: v })}
                />
              </div>
            ) : null}

            <Escolha
              rotulo="O valor é"
              valor={novo.tipoPreco}
              aoMudar={(v) => setNovo({ ...novo, tipoPreco: v })}
              opcoes={[
                { valor: 'custo', texto: 'Custo' },
                { valor: 'venda', texto: 'Preço de venda' },
              ]}
            />
            <Texto
              rotulo={porVenda ? 'Preço de venda (R$)' : 'Custo (R$)'}
              type="number"
              valor={novo.custo}
              aoMudar={(v) => setNovo({ ...novo, custo: v })}
            />
          </div>

          <button className="botao principal largo" onClick={adicionar}>
            Adicionar
          </button>
        </div>

        <div className="coluna-lista">
          <div className="filtros centralizados">
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

          <div className="bloco bloco-lista">
            {itens.length === 0 ? (
              <Vazio texto="Nenhum item cadastrado." />
            ) : (
              <>
                <div className="linha-biblioteca cabeca-biblioteca">
                  <span>Item</span>
                  <span className="n">Valor</span>
                  <span className="n">Com a sua margem</span>
                  <span />
                </div>
                <div className="rolagem-biblioteca">
                  {itens.map((i) => (
                    <div className="linha-biblioteca" key={i.id}>
                      <span>
                        <input
                          className="nome-do-item"
                          value={i.nome}
                          onChange={(e) => salvarItem({ ...i, nome: e.target.value }, conta.id)}
                        />
                        <span className="fraco">
                          {nomeDoTipo(i)} · por {i.unidade} · {i.tipoPreco === 'venda' ? 'preço de venda' : 'custo'}
                        </span>
                      </span>
                      <span className="n">
                        <input
                          className="celula larga"
                          type="number"
                          value={i.custo}
                          onChange={(e) => salvarItem({ ...i, custo: Number(e.target.value) }, conta.id)}
                        />
                      </span>
                      <span className="n valor-margem">
                        {i.tipoPreco === 'venda' ? '' : moeda(precoDoCusto(i.custo, conta.margemPct, conta.impostoPct))}
                      </span>
                      <button className="botao-lixeira" title="Remover item" onClick={() => apagarItem(i.id)}>
                        <Lixeira />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
