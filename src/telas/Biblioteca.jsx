import React, { useEffect, useState } from 'react'
import { useDados, Texto, Escolha, Vazio, Janela } from '../componentes/base.jsx'
import { Icone } from '../componentes/icones.jsx'
import { moeda } from '../dados/armazenamento.js'
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
  const [busca, setBusca] = useState('')
  const [natureza, setNatureza] = useState('tudo')
  const [ordem, setOrdem] = useState('nome')
  // null = janela fechada; objeto = item sendo cadastrado ou editado
  const [edicao, setEdicao] = useState(null)
  const [erro, setErro] = useState('')
  const [explicando, setExplicando] = useState(false)
  const [recem, setRecem] = useState('')

  useEffect(() => {
    if (!recem) return
    const t = setTimeout(() => setRecem(''), 2600)
    return () => clearTimeout(t)
  }, [recem])

  const itens = b.itens
    .filter((i) => i.contaId === conta.id)
    .filter((i) => filtro === 'todos' || i.tipo === filtro)
    .filter((i) =>
      natureza === 'tudo' ? true : natureza === 'custo' ? i.tipoPreco !== 'venda' : i.tipoPreco === 'venda'
    )
    .filter((i) => (i.nome + ' ' + nomeDoTipo(i)).toLowerCase().includes(busca.toLowerCase()))
    .slice()
    .sort((x, y) => {
      if (ordem === 'maior') return Number(y.custo) - Number(x.custo)
      if (ordem === 'menor') return Number(x.custo) - Number(y.custo)
      return x.nome.localeCompare(y.nome, 'pt-BR')
    })

  const unidadeConhecida = (u) => UNIDADES.some((x) => x.valor === u)

  function abrirNovo() {
    setErro('')
    setEdicao({ ...VAZIO, outraUnidade: false })
  }

  function abrirEdicao(item) {
    setErro('')
    setEdicao({ ...item, custo: String(item.custo ?? ''), outraUnidade: !unidadeConhecida(item.unidade) })
  }

  async function gravar() {
    if (!edicao.nome.trim()) {
      setErro('Escreva o nome do item.')
      return
    }
    const { outraUnidade, ...item } = edicao
    const id = await salvarItem({ ...item, custo: Number(item.custo) || 0 }, conta.id)
    setEdicao(null)
    setErro('')
    if (id) setRecem(id)
  }

  const Lixeira = Icone.lixeira
  const Lapis = Icone.lapis
  const porVenda = edicao?.tipoPreco === 'venda'

  return (
    <>
      <div className="cabeca">
        <h1>Biblioteca</h1>
      </div>

      <div className="barra-biblioteca">
        <input
          className="busca"
          placeholder="Buscar item pelo nome"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select className="seletor-barra" value={ordem} onChange={(e) => setOrdem(e.target.value)}>
          <option value="nome">Ordem alfabética</option>
          <option value="maior">Maior valor</option>
          <option value="menor">Menor valor</option>
        </select>
        <select className="seletor-barra" value={natureza} onChange={(e) => setNatureza(e.target.value)}>
          <option value="tudo">Custo e preço final</option>
          <option value="custo">Só custo</option>
          <option value="venda">Só preço final</option>
        </select>
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
        <button className="botao principal" onClick={abrirNovo}>
          Novo item
        </button>
      </div>

      <div className="bloco bloco-lista">
        {itens.length === 0 ? (
          <Vazio texto={busca ? 'Nenhum item com esse nome.' : 'Nenhum item cadastrado.'} />
        ) : (
          <>
            <div className="linha-biblioteca cabeca-biblioteca">
              <span>Item</span>
              <span className="n">
                <span className="com-dica">
                  Custo
                  <span className="dica">
                    O valor puro do item, sem nada por cima. Só aparece nos orçamentos por margem, que é onde o sistema
                    aplica o imposto e a margem para chegar no preço.
                  </span>
                </span>
              </span>
              <span className="n">
                <span className="com-dica">
                  Preço final
                  <span className="dica">
                    O valor já com a sua margem dentro, que é o que o cliente paga. Só aparece nos orçamentos por preço
                    de venda e nos de itens avulsos, onde você não informa margem.
                  </span>
                </span>
              </span>
              <span />
            </div>
            <div className="rolagem-biblioteca">
              {itens.map((i) => (
                <div className={'linha-biblioteca' + (recem === i.id ? ' recem-criada' : '')} key={i.id}>
                  <span>
                    <span className="nome-do-item">{i.nome}</span>
                    <span className="fraco">
                      {nomeDoTipo(i)} · por {i.unidade}
                    </span>
                  </span>
                  <span className="n valor-item">
                    {i.tipoPreco === 'venda' ? <span className="sem-valor">—</span> : moeda(i.custo)}
                  </span>
                  <span className="n valor-item">
                    {i.tipoPreco === 'venda' ? moeda(i.custo) : <span className="sem-valor">—</span>}
                  </span>
                  <span className="acoes-linha">
                    <button className="botao-icone" title="Editar item" onClick={() => abrirEdicao(i)}>
                      <Lapis />
                    </button>
                    <button className="botao-icone perigo" title="Apagar item" onClick={() => apagarItem(i.id)}>
                      <Lixeira />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {edicao ? (
        <Janela titulo={edicao.id ? 'Editar item' : 'Novo item'} aoFechar={() => setEdicao(null)}>
          <div className="forma">
            <div className="forma-larga">
              <Texto rotulo="Nome" valor={edicao.nome} aoMudar={(v) => setEdicao({ ...edicao, nome: v })} />
            </div>

            <Escolha
              rotulo="Tipo"
              valor={edicao.tipo}
              aoMudar={(v) => setEdicao({ ...edicao, tipo: v, tipoOutro: '' })}
              opcoes={TIPOS}
            />
            <Escolha
              rotulo="Unidade"
              valor={edicao.outraUnidade ? 'outra' : edicao.unidade}
              aoMudar={(v) =>
                v === 'outra'
                  ? setEdicao({ ...edicao, outraUnidade: true, unidade: '' })
                  : setEdicao({ ...edicao, outraUnidade: false, unidade: v })
              }
              opcoes={UNIDADES.concat([{ valor: 'outra', texto: 'Outra' }])}
            />

            {edicao.tipo === 'outro' ? (
              <div className="forma-larga">
                <Texto
                  rotulo="Qual tipo?"
                  valor={edicao.tipoOutro}
                  aoMudar={(v) => setEdicao({ ...edicao, tipoOutro: v })}
                />
              </div>
            ) : null}

            {edicao.outraUnidade ? (
              <div className="forma-larga">
                <Texto
                  rotulo="Qual unidade?"
                  valor={edicao.unidade}
                  aoMudar={(v) => setEdicao({ ...edicao, unidade: v })}
                />
              </div>
            ) : null}

            <Escolha
              rotulo="O valor é"
              valor={edicao.tipoPreco}
              aoMudar={(v) => setEdicao({ ...edicao, tipoPreco: v })}
              opcoes={[
                { valor: 'custo', texto: 'Custo' },
                { valor: 'venda', texto: 'Preço final' },
              ]}
            />
            <Texto
              rotulo={porVenda ? 'Preço final (R$)' : 'Custo (R$)'}
              type="number"
              valor={edicao.custo}
              aoMudar={(v) => setEdicao({ ...edicao, custo: v })}
            />
          </div>

          <p className="fraco">
            {porVenda
              ? 'Este item vai aparecer nos orçamentos por preço de venda e nos de itens avulsos.'
              : 'Este item vai aparecer nos orçamentos por margem, onde o preço é calculado.'}{' '}
            <button className="botao-detalhes" onClick={() => setExplicando(true)}>
              entenda a diferença
            </button>
          </p>

          {erro ? <p className="erro">{erro}</p> : null}

          <div className="janela-pe">
            <button className="botao" onClick={() => setEdicao(null)}>
              Cancelar
            </button>
            <button className="botao principal" onClick={gravar}>
              {edicao.id ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </Janela>
      ) : null}

      {explicando ? (
        <Janela titulo="Custo e preço final" aoFechar={() => setExplicando(false)}>
          <p>
            <strong>Custo</strong> é o valor puro do item, sem nada por cima: o que você paga no material, ou o que a
            hora de serviço custa para você.
          </p>
          <p>
            <strong>Preço final</strong> é o valor já com a sua margem dentro. É o que o cliente paga por aquele item.
          </p>
          <p>
            A diferença decide onde o item aparece. No orçamento <strong>por margem</strong>, só entram itens de custo,
            porque é esse orçamento que aplica o imposto e a margem para chegar no preço. Nos orçamentos{' '}
            <strong>por preço de venda</strong> e <strong>de itens avulsos</strong>, só entram itens de preço final,
            porque neles você não informa margem nenhuma.
          </p>
          <p className="fraco">
            Por isso cada item preenche uma coluna só. Um mesmo serviço pode estar cadastrado das duas formas, se você
            usar os dois tipos de orçamento.
          </p>
          <div className="janela-pe">
            <button className="botao principal" onClick={() => setExplicando(false)}>
              Entendi
            </button>
          </div>
        </Janela>
      ) : null}
    </>
  )
}
