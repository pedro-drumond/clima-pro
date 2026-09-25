import React, { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useDados } from '../componentes/base.jsx'
import { novoOrcamento } from '../dados/acoes.js'

export const MODELOS = [
  {
    valor: 'margem',
    titulo: 'Por margem',
    linha:
      'Você define margem líquida e percentual de imposto, entra com o custo unitário e o sistema calcula o preço de venda.',
  },
  {
    valor: 'venda',
    titulo: 'Por preço de venda',
    linha: 'Você entra com o preço final de venda de cada item e o sistema só soma.',
  },
  {
    valor: 'avulso',
    titulo: 'Itens avulsos',
    linha:
      'Você escreve os itens na hora com o preço final, e escolhe se quer salvar cada um na biblioteca.',
  },
]

export default function NovoOrcamento() {
  const { conta } = useDados()
  const navegar = useNavigate()
  const [busca] = useSearchParams()
  const clienteId = busca.get('cliente') || ''
  const [ocupado, setOcupado] = useState(false)
  const [erro, setErro] = useState('')

  async function criar(modelo) {
    if (ocupado) return
    setErro('')
    setOcupado(true)
    const r = await novoOrcamento(conta, clienteId, modelo)
    setOcupado(false)
    if (r?.erro || !r?.id) {
      setErro(r?.erro || 'Não foi possível criar o orçamento.')
      return
    }
    navegar('/orcamentos/' + r.id)
  }

  return (
    <>
      <div className="cabeca">
        <div>
          <Link to="/orcamentos" className="botao texto voltar">
            Voltar
          </Link>
          <h1>Novo orçamento</h1>
        </div>
      </div>

      {erro ? <p className="erro">{erro}</p> : null}

      <div className="escolha-modelo">
        {MODELOS.map((m) => (
          <button key={m.valor} className="cartao-modelo" disabled={ocupado} onClick={() => criar(m.valor)}>
            <span className="cartao-modelo-titulo">{m.titulo}</span>
            <span className="cartao-modelo-linha">{m.linha}</span>
          </button>
        ))}
      </div>
    </>
  )
}
