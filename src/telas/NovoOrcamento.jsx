import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useDados } from '../componentes/base.jsx'
import { novoOrcamento } from '../dados/acoes.js'

// Só existe um jeito de orçar desde 13/10: preço de venda. Não há o que
// escolher, então a tela cria o orçamento e já abre a ficha dele.
export default function NovoOrcamento() {
  const { conta } = useDados()
  const navegar = useNavigate()
  const [busca] = useSearchParams()
  const clienteId = busca.get('cliente') || ''
  const [erro, setErro] = useState('')
  const criando = useRef(false)

  useEffect(() => {
    if (!conta || criando.current) return
    criando.current = true
    novoOrcamento(conta, clienteId).then((r) => {
      if (r?.erro || !r?.id) {
        setErro(r?.erro || 'Não foi possível criar o orçamento.')
        return
      }
      navegar('/orcamentos/' + r.id, { replace: true })
    })
  }, [conta])

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
    </>
  )
}
