import React, { useState } from 'react'
import { useDados } from '../componentes/base.jsx'
import { FolhaProposta, MODELOS_PROPOSTA } from '../componentes/proposta.jsx'
import { salvarConta } from '../dados/acoes.js'

// um orçamento de mentira, só para o instalador ver como a proposta dele vai
// sair em cada modelo. Os dados da empresa são os de verdade, para a logo
// aparecer no lugar certo.
const EXEMPLO = {
  orcamento: {
    numero: 1042,
    modelo: 'venda',
    mostrarUnitario: true,
    criadoEm: new Date().toISOString(),
    validadeDias: 15,
    situacao: 'enviado',
    condicoes: 'Entrada de 50% e o restante na entrega, ou 10x no cartão sem juros.',
    observacoes: 'Garantia de 1 ano sobre a instalação. Material e mão de obra inclusos.',
    seguro: false,
  },
  cliente: { nome: 'Mariana Alves', documento: '', endereco: 'Rua das Acácias, 120 — Campinas/SP' },
  itens: [
    { nome: 'Instalação de split 12.000 BTUs', unidade: 'unidade', qtd: 1, precoUnit: 1250 },
    { nome: 'Tubulação de cobre', unidade: 'metro', qtd: 4, precoUnit: 95 },
    { nome: 'Suporte de parede reforçado', unidade: 'unidade', qtd: 1, precoUnit: 140 },
    { nome: 'Limpeza e carga de gás', unidade: 'unidade', qtd: 1, precoUnit: 220 },
  ],
}

const precoExemplo = (i) => Number(i.precoUnit)

function Exemplo({ empresa, modelo }) {
  const validade = new Date(Date.now() + 15 * 86400000).toISOString()
  return (
    <FolhaProposta
      empresa={empresa}
      orcamento={EXEMPLO.orcamento}
      cliente={EXEMPLO.cliente}
      itens={EXEMPLO.itens}
      validade={validade}
      preco={precoExemplo}
      modelo={modelo}
    />
  )
}

export default function Modelos({ aoVoltar }) {
  const { conta } = useDados()
  const [vendo, setVendo] = useState('')
  const atual = conta.modeloCabecalho || 'simples'

  if (vendo) {
    const escolhido = MODELOS_PROPOSTA.find((m) => m.valor === vendo)
    return (
      <>
        <div className="cabeca sem-impressao">
          <div>
            <button className="botao texto voltar" onClick={() => setVendo('')}>
              Voltar aos modelos
            </button>
            <h1>{escolhido.titulo}</h1>
          </div>
          <div className="acoes">
            <button className="botao" onClick={() => window.print()}>
              Imprimir este exemplo
            </button>
            <button
              className="botao principal"
              onClick={() => {
                salvarConta({ ...conta, modeloCabecalho: vendo })
                setVendo('')
              }}
            >
              {atual === vendo ? 'Este já é o seu modelo' : 'Usar este modelo'}
            </button>
          </div>
        </div>

        <p className="fraco sem-impressao aviso-exemplo">
          Exemplo com cliente e itens inventados. Os dados e a logo da empresa são os seus, de Minha empresa.
        </p>

        <div className="moldura-exemplo">
          <Exemplo empresa={conta} modelo={vendo} />
        </div>
      </>
    )
  }

  return (
    <>
      <div className="cabeca">
        <div>
          <button className="botao texto voltar" onClick={aoVoltar}>
            Voltar ao quadro
          </button>
          <h1>Modelos de proposta</h1>
        </div>
      </div>

      <p className="fraco aviso-exemplo">
        O modelo escolhido vale para todas as propostas da empresa — no link que o cliente abre e no PDF.
      </p>

      <div className="grade-modelos">
        {MODELOS_PROPOSTA.map((m) => (
          <div className={'modelo-cartao' + (atual === m.valor ? ' escolhido' : '')} key={m.valor}>
            <div className="modelo-miniatura" onClick={() => setVendo(m.valor)}>
              <div className="modelo-folha">
                <Exemplo empresa={conta} modelo={m.valor} />
              </div>
            </div>
            <div className="modelo-dados">
              <div className="modelo-titulo">
                {m.titulo}
                {atual === m.valor ? <span className="modelo-marca">Em uso</span> : null}
              </div>
              <p className="fraco">{m.resumo}</p>
              <div className="acoes">
                <button className="botao pequeno" onClick={() => setVendo(m.valor)}>
                  Ver inteiro
                </button>
                {atual === m.valor ? null : (
                  <button className="botao pequeno principal" onClick={() => salvarConta({ ...conta, modeloCabecalho: m.valor })}>
                    Usar este
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
