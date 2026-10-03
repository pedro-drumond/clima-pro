// O vocabulário do acompanhamento. Fica sozinho aqui, sem importar nada, para
// que as ações, a agenda e as telas possam usar sem dar volta.
//
// A regra que organiza tudo: toda frase é uma coisa que o CLIENTE fez. Nada
// aqui é palpite de quem registra. A temperatura é escolhida primeiro e a
// frase é o detalhe — é por isso que a lista pode crescer sem atrapalhar o
// cartão, onde quem informa é o desenho.

export const TEMPERATURAS = [
  { valor: 'frio', texto: 'Frio' },
  { valor: 'morno', texto: 'Morno' },
  { valor: 'quente', texto: 'Quente' },
]

// `curto` é o que cabe no cartão. É escrito à mão, nunca cortado no automático:
// "Está cotando com outro" cortado em seis letras viraria "cotand".
export const RESULTADOS = [
  { valor: 'sem-resposta', temp: 'frio', texto: 'Sem resposta', curto: 'sem resp.', dias: 2 },
  { valor: 'achou-caro', temp: 'frio', texto: 'Achou caro', curto: 'caro', dias: 7 },
  { valor: 'sem-pressa', temp: 'frio', texto: 'Sem pressa', curto: 'sem pressa', dias: 15 },
  { valor: 'ele-avisa', temp: 'frio', texto: 'Ele que avisa', curto: 'avisa', dias: 30 },

  { valor: 'desconto', temp: 'morno', texto: 'Pediu desconto', curto: 'desconto', dias: 2 },
  { valor: 'revisao', temp: 'morno', texto: 'Pediu revisão', curto: 'revisão', dias: 2 },
  { valor: 'cotando', temp: 'morno', texto: 'Cotando com outro', curto: 'cotando', dias: 3 },
  { valor: 'vai-pensar', temp: 'morno', texto: 'Vai pensar', curto: 'pensando', dias: 7 },
  { valor: 'terceiro', temp: 'morno', texto: 'Depende de outro', curto: 'terceiro', dias: 7 },

  { valor: 'gostou', temp: 'quente', texto: 'Gostou', curto: 'gostou', dias: 3 },
  { valor: 'pediu-data', temp: 'quente', texto: 'Pediu data da instalação', curto: 'data', dias: 2 },
  { valor: 'pagamento', temp: 'quente', texto: 'Pediu forma de pagar', curto: 'pagamento', dias: 2 },
  { valor: 'aceitou', temp: 'quente', texto: 'Aceitou, falta assinar', curto: 'aceitou', dias: 2 },
]

// O texto livre guarda a temperatura no próprio resultado, para o cartão saber
// qual desenho mostrar. Nas contas do Financeiro os três contam como "Outro".
export const OUTRO = { frio: 'outro-frio', morno: 'outro-morno', quente: 'outro-quente' }
const OUTROS = Object.values(OUTRO)

// Dias que o Outro sugere, por temperatura. Quente se cobra de perto.
export const DIAS_DO_OUTRO = { frio: 7, morno: 3, quente: 2 }

export const ehOutro = (valor) => OUTROS.includes(valor)

export function resultadoPor(valor) {
  return RESULTADOS.find((r) => r.valor === valor) || null
}

export function resultadosDa(temperatura) {
  return RESULTADOS.filter((r) => r.temp === temperatura)
}

// No cartão cabe pouco: o texto livre entra cortado. O inteiro fica guardado e
// aparece na ficha do orçamento.
export function encurtar(texto, limite = 11) {
  const t = String(texto || '').trim()
  if (!t) return 'outro'
  if (t.length <= limite) return t.toLowerCase()
  return t.slice(0, limite).trim().toLowerCase() + '…'
}

// Traduz uma linha de contato no que o cartão mostra.
export function resumoDaAcao(contato) {
  if (ehOutro(contato.resultado)) {
    const temp = contato.resultado.replace('outro-', '')
    return { temp, curto: encurtar(contato.anotacao), texto: contato.anotacao || 'Outro', livre: true }
  }
  const r = resultadoPor(contato.resultado)
  if (!r) return { temp: 'morno', curto: contato.resultado || '—', texto: contato.resultado || '—', livre: false }
  return { temp: r.temp, curto: r.curto, texto: r.texto, livre: false }
}

// Dia e mês em três letras: 3/out. Ano nunca, para não gastar espaço com uma
// informação que quase sempre é óbvia.
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export function diaMes(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.getDate() + '/' + MESES[d.getMonth()]
}

// Orçamento enviado que nunca recebeu nenhuma ação registrada acende sozinho
// depois de uma semana. Prazo fixo: não depende do que estiver em Minha empresa.
export const DIAS_SEM_ACAO = 7
