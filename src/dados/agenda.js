// A agenda do cliente: quando ele volta para a lista de limpeza, e tudo que o
// cartão do quadro precisa saber sobre o orçamento.

import { venceu, somarMeses, somarDias, diasDesde, dataCurta } from './armazenamento.js'
import { resumoDaAcao, diaMes, DIAS_SEM_ACAO } from './vocabulario.js'

// A limpeza é contada a partir da ENTREGA do serviço, não do aparelho
// cadastrado. Antes dependia do equipamento ter sido cadastrado com data da
// última limpeza, e isso ninguém preenche — a lista vivia vazia. Contando pela
// entrega funciona sozinho, e cada serviço novo entregue reinicia o relógio.
export function ultimaEntrega(pessoaId, b) {
  const datas = b.orcamentos
    .filter((o) => o.pessoaId === pessoaId && o.situacao === 'instalado' && o.instaladoEm)
    .map((o) => o.instaladoEm)
    .sort()
  return datas.length ? datas[datas.length - 1] : null
}

export function limpezaVencida(pessoaId, b, params) {
  const entrega = ultimaEntrega(pessoaId, b)
  if (!entrega) return null
  const quando = somarMeses(entrega, params.limpezaMeses)
  if (!venceu(quando)) return null
  return { desde: entrega, venceuEm: quando }
}

// Quem está na hora de chamar para limpeza. É informação, não automação:
// nenhuma mensagem é montada, quem fala com o cliente é o instalador.
export function tarefasDoDia(b, conta, params) {
  if (!conta) return []
  return b.pessoas
    .filter((p) => p.contaId === conta.id)
    .map((p) => {
      const v = limpezaVencida(p.id, b, params)
      if (!v) return null
      return {
        chave: 'limpeza-' + p.id,
        tipo: 'limpeza',
        titulo: 'Entregue em ' + dataCurta(v.desde),
        pessoa: p,
        vencimento: v.venceuEm,
      }
    })
    .filter(Boolean)
    .sort((a, b2) => new Date(a.vencimento) - new Date(b2.vencimento))
}

export function primeiroNome(nome) {
  return String(nome || '').split(' ')[0]
}

export function linkDaProposta(orcamento) {
  const base = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''
  return base.replace(/\/$/, '') + '#/proposta/' + (orcamento.token || orcamento.id)
}

export function adiar(orcamentoOuPessoa, dias) {
  return somarDias(new Date().toISOString(), dias)
}

// "hoje", "2D", "15D"
function emDias(n) {
  if (n === null || n === undefined) return ''
  if (n <= 0) return 'hoje'
  return n + 'D'
}

// Tudo que o cartão do quadro precisa mostrar, num lugar só.
//
// São dois relógios diferentes e eles nunca se misturam: a validade do
// orçamento, que quando passa tira do cliente o direito de aprovar pelo link
// (vermelho), e o próximo passo, que é você que está atrasado para ligar
// (laranja).
//
// O terceiro caso é o orçamento que saiu e ninguém registrou nada: depois de
// uma semana ele acende sozinho, senão some do radar sem nunca ter sido
// cobrado.
export function estadoDoCartao(orcamento, contatos) {
  const meus = (contatos || [])
    .filter((c) => c.orcamentoId === orcamento.id)
    .sort((a, b2) => new Date(a.criadoEm) - new Date(b2.criadoEm))

  const tudo = meus.map((c) => ({ ...resumoDaAcao(c), em: c.criadoEm, proximoEm: c.proximoEm }))
  const ultimas = tudo.slice(-2)
  const ultima = tudo[tudo.length - 1] || null

  // fora de Enviados não existe temperatura nem relógio: é só a idade
  if (orcamento.situacao !== 'enviado') {
    const quando = orcamento.enviadoEm || orcamento.criadoEm
    const verbo = orcamento.enviadoEm ? 'enviado' : 'criado'
    return {
      temperatura: null,
      tarja: null,
      prazo: null,
      ultimas: [],
      tudo,
      vazio: verbo + ' ' + emDias(diasDesde(quando)),
    }
  }

  const temperatura = ultima ? ultima.temp : null
  const fim = validadeDoOrcamento(orcamento)
  const expirou = venceu(fim)

  // o canto de cima responde sempre a mesma pergunta: quando eu ajo de novo.
  // Quem define é a ação registrada; sem nenhuma ação, a regra dos sete dias.
  const semAcao = tudo.length === 0
  const alvo = semAcao ? somarDias(orcamento.enviadoEm, DIAS_SEM_ACAO) : orcamento.proximoContato
  const atrasado = venceu(alvo)

  // a validade vencida fica na tarja vermelha da borda. Ela só toma o canto
  // quando não há nada melhor para mostrar ali — ou seja, enquanto você não
  // registrou nenhuma ação.
  const prazo =
    expirou && semAcao
      ? { texto: diaMes(fim), estado: 'vencido' }
      : alvo
        ? { texto: diaMes(alvo), estado: atrasado ? 'atrasado' : 'ok' }
        : null

  return {
    temperatura,
    tarja: expirou ? 'vencido' : atrasado ? 'atrasado' : null,
    prazo,
    ultimas,
    tudo,
    vazio: semAcao ? 'enviado ' + emDias(diasDesde(orcamento.enviadoEm)) : null,
  }
}

export function validadeDoOrcamento(orcamento) {
  if (orcamento.validadeAte) return orcamento.validadeAte
  const inicio = orcamento.enviadoEm || orcamento.criadoEm
  if (!inicio) return null
  return somarDias(inicio, orcamento.validadeDias || 7)
}
