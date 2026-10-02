// Quem chamar hoje. Toda regra de prazo vem dos parâmetros, nunca escrita aqui dentro.

import { venceu, somarMeses, somarDias, diasDesde, totalDoOrcamento, moeda, dataCurta } from './armazenamento.js'
import { aplicarTexto } from './parametros.js'

export function proximaLimpeza(equipamento, params) {
  const base = equipamento.ultimaLimpeza || equipamento.instaladoEm
  if (!base) return null
  const meses =
    equipamento.uso === 'comercial' ? params.limpezaComercialMeses : params.limpezaResidencialMeses
  return somarMeses(base, meses)
}

export function tarefasDoDia(b, conta, params) {
  if (!conta) return []
  const pessoas = b.pessoas.filter((p) => p.contaId === conta.id)
  const pessoaPor = (id) => pessoas.find((p) => p.id === id)
  const tarefas = []

  b.orcamentos
    .filter((o) => o.contaId === conta.id && o.situacao === 'enviado')
    .forEach((o) => {
      const pessoa = pessoaPor(o.pessoaId)
      if (!pessoa) return
      const dias = diasDesde(o.enviadoEm)
      const passouDoPrazo = dias !== null && dias >= params.sugerirPerdaDias
      if (passouDoPrazo) {
        tarefas.push({
          chave: 'perda-' + o.id,
          tipo: 'perda',
          titulo: 'Sem resposta há ' + dias + ' dias',
          detalhe: 'Orçamento nº ' + o.numero + ' · ' + moeda(totalDoOrcamento(o)),
          pessoa,
          orcamento: o,
          vencimento: o.proximoContato || o.enviadoEm,
          mensagem: aplicarTexto(params.textos.cobrarOrcamento, {
            pessoa: primeiroNome(pessoa.nome),
            empresa: conta.nomeFantasia,
            numero: o.numero,
            total: moeda(totalDoOrcamento(o)),
            link: linkDaProposta(o),
          }),
        })
        return
      }
      if (venceu(o.proximoContato)) {
        tarefas.push({
          chave: 'cobranca-' + o.id,
          tipo: 'cobranca',
          titulo: 'Cobrar orçamento nº ' + o.numero,
          detalhe:
            moeda(totalDoOrcamento(o)) +
            ' · enviado em ' +
            dataCurta(o.enviadoEm) +
            (o.cobrancas ? ' · já cobrado ' + o.cobrancas + 'x' : ''),
          pessoa,
          orcamento: o,
          vencimento: o.proximoContato,
          mensagem: aplicarTexto(params.textos.cobrarOrcamento, {
            pessoa: primeiroNome(pessoa.nome),
            empresa: conta.nomeFantasia,
            numero: o.numero,
            total: moeda(totalDoOrcamento(o)),
            link: linkDaProposta(o),
          }),
        })
      }
    })

  b.equipamentos.forEach((e) => {
    const pessoa = pessoaPor(e.pessoaId)
    if (!pessoa) return
    const quando = proximaLimpeza(e, params)
    if (!venceu(quando)) return
    tarefas.push({
      chave: 'limpeza-' + e.id,
      tipo: 'limpeza',
      titulo: 'Limpeza vencida · ' + e.ambiente + ' ' + e.btu.toLocaleString('pt-BR') + ' BTU',
      detalhe: 'Última em ' + dataCurta(e.ultimaLimpeza || e.instaladoEm),
      pessoa,
      equipamento: e,
      vencimento: quando,
      mensagem: aplicarTexto(params.textos.limpeza, {
        pessoa: primeiroNome(pessoa.nome),
        empresa: conta.nomeFantasia,
      }),
    })
  })

  pessoas.forEach((p) => {
    const ultimo = b.orcamentos
      .filter((o) => o.pessoaId === p.id)
      .map((o) => o.criadoEm)
      .sort()
      .pop()
    const base = ultimo || p.criadoEm
    const limite = somarMeses(base, params.clienteParadoMeses)
    if (!venceu(limite)) return
    if (p.proximoContato && !venceu(p.proximoContato)) return
    if (tarefas.some((t) => t.pessoa.id === p.id)) return
    tarefas.push({
      chave: 'parado-' + p.id,
      tipo: 'parado',
      titulo: 'Sem contato há mais de ' + params.clienteParadoMeses + ' meses',
      detalhe: 'Último movimento em ' + dataCurta(base),
      pessoa: p,
      vencimento: limite,
      mensagem: aplicarTexto(params.textos.clienteParado, {
        pessoa: primeiroNome(p.nome),
        empresa: conta.nomeFantasia,
      }),
    })
  })

  return tarefas.sort((a, b2) => new Date(a.vencimento) - new Date(b2.vencimento))
}

export function proximoPrazoDeCobranca(orcamento, params) {
  const lista = params.cobrancaDias
  const indice = Math.min(orcamento.cobrancas || 0, lista.length - 1)
  return lista[indice]
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

// Tudo que o cartão precisa mostrar, num lugar só. São dois relógios
// diferentes: a validade do orçamento (vermelho) e o passo que você marcou
// e não cumpriu (laranja).
export function estadoDoCartao(orcamento, contatos, RESULTADOS) {
  const meus = (contatos || [])
    .filter((c) => c.orcamentoId === orcamento.id)
    .sort((a, b2) => new Date(b2.criadoEm) - new Date(a.criadoEm))
  const tentativas = meus.length
  const ultimo = meus[0]
  const saida = ultimo ? RESULTADOS.find((r) => r.valor === ultimo.resultado) : null

  let temperatura = null
  if (orcamento.situacao === 'enviado') {
    temperatura = saida ? saida.temp : 'morno'
    if (tentativas >= 3 && temperatura !== 'quente') temperatura = 'frio'
  }

  const sufixo = tentativas > 0 ? ' · ' + tentativas + 'ª tentativa' : ''

  if (orcamento.situacao !== 'enviado') {
    const quando = orcamento.enviadoEm || orcamento.criadoEm
    const verbo = orcamento.enviadoEm ? 'enviado' : 'criado'
    return { temperatura: null, tarja: null, linha: verbo + ' ' + emDias(diasDesde(quando)), tentativas }
  }

  const fim = validadeDoOrcamento(orcamento)
  if (venceu(fim)) {
    return { temperatura, tarja: 'vencido', linha: 'venceu em ' + dataCurta(fim), tentativas }
  }

  if (venceu(orcamento.proximoContato)) {
    const atraso = diasDesde(orcamento.proximoContato)
    return { temperatura, tarja: 'atrasado', linha: 'atrasado ' + emDias(atraso) + sufixo, tentativas }
  }

  if (saida && orcamento.proximoContato) {
    const faltam = -diasDesde(orcamento.proximoContato)
    return {
      temperatura,
      tarja: null,
      linha: saida.texto.toLowerCase() + ' · retornar em ' + emDias(faltam),
      tentativas,
    }
  }

  return { temperatura, tarja: null, linha: 'enviado ' + emDias(diasDesde(orcamento.enviadoEm)), tentativas }
}

export function validadeDoOrcamento(orcamento) {
  if (orcamento.validadeAte) return orcamento.validadeAte
  const inicio = orcamento.enviadoEm || orcamento.criadoEm
  if (!inicio) return null
  return somarDias(inicio, orcamento.validadeDias || 7)
}
