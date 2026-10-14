import React from 'react'

// desenhos simples de linha, do mesmo traço, para os cartões da ajuda
function Base({ children }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const Icone = {
  lapis: () => (
    <Base>
      <path d="M4.5 19.5h4l9.2-9.2-4-4-9.2 9.2z" />
      <path d="M14.6 5.1 16 3.7a1.6 1.6 0 0 1 2.3 0l2 2a1.6 1.6 0 0 1 0 2.3l-1.4 1.4" />
    </Base>
  ),
  fechar: () => (
    <Base>
      <path d="M6 6l12 12M18 6 6 18" />
    </Base>
  ),
  lixeira: () => (
    <Base>
      <path d="M4.5 6.5h15" />
      <path d="M9.5 6.5V4.8h5v1.7" />
      <path d="M6.5 6.5 7.4 20h9.2l.9-13.5" />
      <path d="M10.3 10v6M13.7 10v6" />
    </Base>
  ),
  inicio: () => (
    <Base>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 10v10h12V10" />
      <path d="M10 20v-6h4v6" />
    </Base>
  ),
  quadro: () => (
    <Base>
      <rect x="3" y="4" width="5.5" height="16" rx="1.4" />
      <rect x="9.6" y="4" width="5.5" height="11" rx="1.4" />
      <rect x="16.2" y="4" width="5.5" height="14" rx="1.4" />
    </Base>
  ),
  telefone: () => (
    <Base>
      <path d="M5 4h3.5l1.6 4-2.2 1.5a12 12 0 0 0 5.6 5.6L15 12.9l4 1.6V18a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 3 6.2 2 2 0 0 1 5 4Z" />
    </Base>
  ),
  documento: () => (
    <Base>
      <path d="M6 3h7l5 5v13H6z" />
      <path d="M13 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </Base>
  ),
  escudo: () => (
    <Base>
      <path d="M12 3 5 6v6c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6Z" />
      <path d="M9.2 12.2 11.3 14l3.6-3.8" />
    </Base>
  ),
  folha: () => (
    <Base>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M7.5 7h9" />
      <path d="M7.5 11h5" />
      <path d="M7.5 15h9M7.5 18h6" />
    </Base>
  ),
  pessoas: () => (
    <Base>
      <circle cx="9.5" cy="8" r="3.2" />
      <path d="M3.5 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <path d="M16.5 5.6a3.2 3.2 0 0 1 0 5.6M18 14.9c1.6.8 2.6 2.3 2.6 4.1" />
    </Base>
  ),
  caixa: () => (
    <Base>
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5Z" />
      <path d="m3 7.5 9 4.5 9-4.5M12 12v9" />
    </Base>
  ),
  grafico: () => (
    <Base>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M8 16v-4M12.5 16V8M17 16v-6" />
    </Base>
  ),
  empresa: () => (
    <Base>
      <path d="M4 20V7l7-3v16" />
      <path d="M11 10h9v10" />
      <path d="M7 9.5v.01M7 13v.01M7 16.5v.01M15 13v.01M15 16.5v.01" />
    </Base>
  ),
  calculo: () => (
    <Base>
      <rect x="4.5" y="3" width="15" height="18" rx="2" />
      <path d="M8 7.5h8" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01" />
    </Base>
  ),
}

// ----- os três desenhos de temperatura -----
//
// Cada um foi empurrado dentro da própria caixa até o CENTRO DE MASSA da tinta
// cair em 12, não o centro da caixa. A chama é bicuda em cima e gorda embaixo:
// centrando a caixa, mais da metade da tinta fica para baixo e o desenho
// parece afundado ao lado da palavra. Os números vieram de medição, não de
// tentativa — não mexa neles sem medir de novo.

export function Gelo({ tamanho = 13, traco = 2.2 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={traco} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4.5" y="4.5" width="15" height="15" rx="3" />
      <path d="M9 9.5h2M13 14.5h2" />
    </svg>
  )
}

export function Ondas({ tamanho = 13, traco = 2.4 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={traco} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <g transform="translate(0,.3)">
        <path d="M3.5 15.4q2.8-2.8 5.6 0t5.6 0 5.8 0" />
        <path d="M3.5 8.6q2.8-2.8 5.6 0t5.6 0 5.8 0" />
      </g>
    </svg>
  )
}

export function Fogo({ tamanho = 13 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <g transform="translate(0,-.85)">
        <path d="M12 2.6c3.6 4.2 6.6 6.6 6.6 10.6a6.6 6.6 0 0 1-13.2 0c0-2.4 1-4.4 2.5-6.2.4 1.3 1.1 2.1 2.1 2.1 1.6 0 2.2-2.3 2-6.5Z" />
      </g>
    </svg>
  )
}

export const DESENHO_TEMPERATURA = { frio: Gelo, morno: Ondas, quente: Fogo }

export function Temperatura({ valor, tamanho = 13, traco }) {
  const Desenho = DESENHO_TEMPERATURA[valor]
  if (!Desenho) return null
  return (
    <span className={'tinta-' + valor}>
      <Desenho tamanho={tamanho} traco={traco} />
    </span>
  )
}

// A seta entre duas ações. Era um caractere de texto e a fonte decidia a
// altura dela — no Mac caía num lugar, no Windows em outro. Virou desenho.
export function SetaAcao() {
  return (
    <svg className="seta-acao" width="17" height="13" viewBox="0 0 17 13" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1.6 6.5h13.2" />
      <path d="M10.6 2.4 14.8 6.5l-4.2 4.1" />
    </svg>
  )
}

export function Alerta({ tamanho = 12 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

export function Balao({ tamanho = 15 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.4-.7L3 21l1.9-5.1A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
    </svg>
  )
}
