import React from 'react'

// Desenhos próprios, em vetor: imprimem nítidos em qualquer tamanho e não
// pesam no arquivo. São genéricos de propósito, sem marca nenhuma.

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function SplitParede(props) {
  return (
    <svg viewBox="0 0 64 40" width="100%" height="100%" {...props}>
      <g {...traco}>
        <rect x="6" y="8" width="52" height="15" rx="4" />
        <path d="M6 18h52" />
        <path d="M14 27c2.5 0 2.5 4 5 4M26 27c2.5 0 2.5 4 5 4M38 27c2.5 0 2.5 4 5 4" />
      </g>
    </svg>
  )
}

function CasseteTeto(props) {
  return (
    <svg viewBox="0 0 64 40" width="100%" height="100%" {...props}>
      <g {...traco}>
        <path d="M4 7h56" />
        <rect x="16" y="7" width="32" height="10" rx="2" />
        <rect x="22" y="17" width="20" height="4" rx="1.5" />
        <path d="M18 25c-2 2-2 4-4 5M32 25v6M46 25c2 2 2 4 4 5" />
      </g>
    </svg>
  )
}

function PisoTeto(props) {
  return (
    <svg viewBox="0 0 64 40" width="100%" height="100%" {...props}>
      <g {...traco}>
        <rect x="18" y="4" width="28" height="32" rx="4" />
        <path d="M18 13h28M18 19h28" />
        <path d="M24 26h16M24 30h16" />
      </g>
    </svg>
  )
}

export const APARELHOS = [
  { valor: '', texto: 'Nenhum', Desenho: null },
  { valor: 'split', texto: 'Split de parede', Desenho: SplitParede },
  { valor: 'cassete', texto: 'Cassete de teto', Desenho: CasseteTeto },
  { valor: 'piso-teto', texto: 'Piso-teto', Desenho: PisoTeto },
]

export function Aparelho({ tipo, tamanho = 44 }) {
  const achado = APARELHOS.find((a) => a.valor === tipo)
  if (!achado || !achado.Desenho) return null
  const { Desenho } = achado
  return (
    <span className="desenho-aparelho" style={{ width: tamanho, height: (tamanho * 40) / 64 }}>
      <Desenho />
    </span>
  )
}
