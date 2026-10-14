import React, { useEffect, useRef, useState } from 'react'
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

// o valor de todo item é o preço de venda; o campo continua se chamando
// `custo` no banco por herança, mas guarda o preço
const VAZIO = { tipo: 'servico', tipoOutro: '', tipoPreco: 'venda', nome: '', unidade: 'unidade', custo: '' }

export function nomeDoTipo(item) {
  if (item.tipo === 'outro') return item.tipoOutro || 'Outros'
  return TIPOS.find((t) => t.valor === item.tipo)?.texto || item.tipo
}

export default function Biblioteca() {
  const { b, conta } = useDados()
  const [filtro, setFiltro] = useState('todos')
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState('nome')
  // null = janela fechada; objeto = item sendo cadastrado ou editado
  const [edicao, setEdicao] = useState(null)
  const [erro, setErro] = useState('')
  const [recem, setRecem] = useState('')
  const linhaNova = useRef(null)

  // o item entra em ordem alfabética e pode cair fora da parte visível da
  // lista; sem rolar até ele parece que o cadastro não funcionou
  useEffect(() => {
    if (!recem) return
    if (linhaNova.current) linhaNova.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    const t = setTimeout(() => setRecem(''), 2600)
    return () => clearTimeout(t)
  }, [recem])

  const itens = b.itens
    .filter((i) => i.contaId === conta.id)
    .filter((i) => filtro === 'todos' || i.tipo === filtro)
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
    const id = await salvarItem({ ...item, tipoPreco: 'venda', custo: Number(item.custo) || 0 }, conta.id)
    setEdicao(null)
    setErro('')
    if (id) setRecem(id)
  }

  const Lixeira = Icone.lixeira
  const Lapis = Icone.lapis

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
              <span className="n">Preço</span>
              <span />
            </div>
            <div className="rolagem-biblioteca">
              {itens.map((i) => (
                <div
                  className={'linha-biblioteca' + (recem === i.id ? ' recem-criada' : '')}
                  key={i.id}
                  ref={recem === i.id ? linhaNova : null}
                >
                  <span>
                    <span className="nome-do-item">{i.nome}</span>
                    <span className="fraco">
                      {nomeDoTipo(i)} · por {i.unidade}
                    </span>
                  </span>
                  <span className="n valor-item">{moeda(i.custo)}</span>
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

            <Texto
              rotulo="Preço (R$)"
              type="number"
              valor={edicao.custo}
              aoMudar={(v) => setEdicao({ ...edicao, custo: v })}
            />
          </div>

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
    </>
  )
}
