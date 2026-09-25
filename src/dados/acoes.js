// Tudo que grava passa por aqui. Cada função altera a cópia que está na tela
// e manda para o banco; se o banco recusar, recarrega para a tela não mentir.

import { supabase } from './supabase.js'
import {
  banco,
  alterarLocal,
  recarregar,
  contaAtual,
  hojeISO,
  somarDias,
  somarMeses,
  custoDoOrcamento,
  totalDoOrcamento,
  paraConta,
  paraPessoa,
  paraEquipamento,
  paraItem,
  paraOrcamento,
} from './armazenamento.js'
import { proximoPrazoDeCobranca } from './agenda.js'

function avisarErro(erro, onde) {
  if (!erro) return false
  console.error('[Clima Pro] falhou em ' + onde, erro)
  recarregar()
  return true
}

/* ----- gravação com espera -----
   As telas salvam a cada tecla digitada. A tela muda na hora (alterarLocal),
   mas o banco só recebe quando ele para de digitar por meio segundo. Sem isso
   seria uma chamada de rede por letra. */

const pendentes = new Map()

function agendar(chave, funcao, espera = 500) {
  const anterior = pendentes.get(chave)
  if (anterior) clearTimeout(anterior.tempo)
  const tempo = setTimeout(() => {
    pendentes.delete(chave)
    funcao()
  }, espera)
  pendentes.set(chave, { tempo, funcao })
}

function cancelar(chave) {
  const anterior = pendentes.get(chave)
  if (!anterior) return
  clearTimeout(anterior.tempo)
  pendentes.delete(chave)
}

// grava agora tudo o que estava esperando (ao sair da página, ao fazer logout)
export function gravarPendentes() {
  pendentes.forEach(({ tempo, funcao }) => {
    clearTimeout(tempo)
    funcao()
  })
  pendentes.clear()
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', gravarPendentes)
  window.addEventListener('pagehide', gravarPendentes)
}

/* ----- orçamentos ----- */

export async function novoOrcamento(conta, pessoaId = '', modelo = 'margem') {
  const { data, error } = await supabase
    .from('orcamentos')
    .insert({
      conta_id: conta.id,
      pessoa_id: pessoaId || null,
      modelo,
      situacao: 'contato',
      imposto_pct: conta.impostoPct,
      margem_pct: conta.margemPct,
      validade_dias: conta.validadeDias,
      condicoes: conta.condicoesPadrao,
      observacoes: conta.observacoesPadrao,
      mostrar_unitario: true,
    })
    .select('*')
    .single()
  if (error) {
    avisarErro(error, 'criar orçamento')
    return { erro: 'Não foi possível criar o orçamento.' }
  }
  await recarregar()
  return { id: data.id }
}

export async function salvarOrcamento(orcamento, jaAgora = false) {
  const custo = custoDoOrcamento(orcamento)
  const total = totalDoOrcamento(orcamento)
  const atualizado = { ...orcamento, custoTotal: custo, total }
  alterarLocal((b) => {
    const i = b.orcamentos.findIndex((o) => o.id === orcamento.id)
    if (i >= 0) b.orcamentos[i] = atualizado
  })
  const gravar = async () => {
    const { error } = await supabase
      .from('orcamentos')
      .update({ ...paraOrcamento(atualizado) })
      .eq('id', orcamento.id)
    avisarErro(error, 'salvar orçamento')
  }
  if (jaAgora) return gravar()
  agendar('orcamento:' + orcamento.id, gravar)
}

// os itens são regravados inteiros: é pouca linha e evita conta errada
export async function salvarItensDoOrcamento(orcamento, itens) {
  const atualizado = { ...orcamento, itens }
  // a gravação do cabeçalho vai junto no fim, então a que estava esperando não serve mais
  cancelar('orcamento:' + orcamento.id)
  alterarLocal((b) => {
    const i = b.orcamentos.findIndex((o) => o.id === orcamento.id)
    if (i >= 0)
      b.orcamentos[i] = {
        ...atualizado,
        custoTotal: custoDoOrcamento(atualizado),
        total: totalDoOrcamento(atualizado),
      }
  })

  const { error: erroApagar } = await supabase.from('orcamento_itens').delete().eq('orcamento_id', orcamento.id)
  if (avisarErro(erroApagar, 'limpar itens')) return

  if (itens.length) {
    const linhas = itens.map((i, n) => ({
      orcamento_id: orcamento.id,
      conta_id: orcamento.contaId,
      item_id: i.itemId || null,
      nome: i.nome,
      unidade: i.unidade || 'unidade',
      qtd: Number(i.qtd) || 0,
      custo_unit: Number(i.custoUnit) || 0,
      preco_unit: Number(i.precoUnit) || 0,
      ordem: n,
    }))
    const { error } = await supabase.from('orcamento_itens').insert(linhas)
    if (avisarErro(error, 'gravar itens')) return
  }

  await salvarOrcamento(atualizado, true)
}

export async function apagarOrcamento(orcamentoId) {
  alterarLocal((b) => {
    b.orcamentos = b.orcamentos.filter((o) => o.id !== orcamentoId)
  })
  const { error } = await supabase.from('orcamentos').delete().eq('id', orcamentoId)
  avisarErro(error, 'apagar orçamento')
}

async function mudarOrcamento(orcamentoId, camposApp, camposBanco) {
  alterarLocal((b) => {
    const o = b.orcamentos.find((x) => x.id === orcamentoId)
    if (o) Object.assign(o, camposApp)
  })
  const { error } = await supabase.from('orcamentos').update(camposBanco).eq('id', orcamentoId)
  avisarErro(error, 'atualizar orçamento')
}

export function marcarEnviado(orcamentoId, params) {
  const agora = hojeISO()
  const proximo = somarDias(agora, params.cobrancaDias[0])
  return mudarOrcamento(
    orcamentoId,
    { situacao: 'enviado', enviadoEm: agora, cobrancas: 0, proximoContato: proximo },
    { situacao: 'enviado', enviado_em: agora, cobrancas: 0, proximo_contato: proximo }
  )
}

export function registrarCobranca(orcamentoId, params) {
  const o = banco().orcamentos.find((x) => x.id === orcamentoId)
  if (!o) return
  const dias = proximoPrazoDeCobranca(o, params)
  const proximo = somarDias(hojeISO(), dias)
  const cobrancas = (o.cobrancas || 0) + 1
  return mudarOrcamento(orcamentoId, { cobrancas, proximoContato: proximo }, { cobrancas, proximo_contato: proximo })
}

export function adiarOrcamento(orcamentoId, dias) {
  const proximo = somarDias(hojeISO(), dias)
  return mudarOrcamento(orcamentoId, { proximoContato: proximo }, { proximo_contato: proximo })
}

export async function marcarFechado(orcamentoId) {
  const agora = hojeISO()
  await mudarOrcamento(
    orcamentoId,
    { situacao: 'fechado', decididoEm: agora, proximoContato: null },
    { situacao: 'fechado', decidido_em: agora, proximo_contato: null }
  )
  const o = banco().orcamentos.find((x) => x.id === orcamentoId)
  if (o?.pessoaId) await marcarComoCliente(o.pessoaId)
}

export function marcarPerdido(orcamentoId, motivo) {
  const agora = hojeISO()
  return mudarOrcamento(
    orcamentoId,
    { situacao: 'perdido', decididoEm: agora, motivoPerda: motivo || '', proximoContato: null },
    { situacao: 'perdido', decidido_em: agora, motivo_perda: motivo || '', proximo_contato: null }
  )
}

export function marcarInstalado(orcamentoId) {
  const agora = hojeISO()
  return mudarOrcamento(
    orcamentoId,
    { situacao: 'instalado', instaladoEm: agora, proximoContato: null },
    { situacao: 'instalado', instalado_em: agora, proximo_contato: null }
  )
}

async function marcarComoCliente(pessoaId) {
  alterarLocal((b) => {
    const p = b.pessoas.find((x) => x.id === pessoaId)
    if (p) p.ehCliente = true
  })
  await supabase.from('pessoas').update({ eh_cliente: true }).eq('id', pessoaId)
}

/* ----- pessoas ----- */

export async function salvarPessoa(pessoa, contaId) {
  const linha = paraPessoa({ ...pessoa, contaId })
  if (pessoa.id) {
    alterarLocal((b) => {
      const i = b.pessoas.findIndex((p) => p.id === pessoa.id)
      if (i >= 0) b.pessoas[i] = { ...b.pessoas[i], ...pessoa }
    })
    agendar('pessoa:' + pessoa.id, async () => {
      const { error } = await supabase.from('pessoas').update(linha).eq('id', pessoa.id)
      avisarErro(error, 'salvar cliente')
    })
    return pessoa.id
  }
  const { data, error } = await supabase.from('pessoas').insert(linha).select('*').single()
  if (error) {
    avisarErro(error, 'criar cliente')
    return null
  }
  await recarregar()
  return data.id
}

export async function apagarPessoa(pessoaId) {
  alterarLocal((b) => {
    b.pessoas = b.pessoas.filter((p) => p.id !== pessoaId)
    b.equipamentos = b.equipamentos.filter((e) => e.pessoaId !== pessoaId)
    b.orcamentos = b.orcamentos.filter((o) => o.pessoaId !== pessoaId)
  })
  const { error } = await supabase.from('pessoas').delete().eq('id', pessoaId)
  avisarErro(error, 'apagar cliente')
}

export function adiarPessoa(pessoaId, dias) {
  const proximo = somarDias(hojeISO(), dias)
  alterarLocal((b) => {
    const p = b.pessoas.find((x) => x.id === pessoaId)
    if (p) p.proximoContato = proximo
  })
  return supabase
    .from('pessoas')
    .update({ proximo_contato: proximo })
    .eq('id', pessoaId)
    .then(({ error }) => avisarErro(error, 'adiar cliente'))
}

/* ----- equipamentos ----- */

export async function salvarEquipamento(equipamento) {
  const conta = contaAtual()
  const linha = paraEquipamento({ ...equipamento, contaId: equipamento.contaId || conta?.id })
  if (equipamento.id) {
    alterarLocal((b) => {
      const i = b.equipamentos.findIndex((e) => e.id === equipamento.id)
      if (i >= 0) b.equipamentos[i] = { ...b.equipamentos[i], ...equipamento }
    })
    agendar('equipamento:' + equipamento.id, async () => {
      const { error } = await supabase.from('equipamentos').update(linha).eq('id', equipamento.id)
      avisarErro(error, 'salvar equipamento')
    })
    return equipamento.id
  }
  const { data, error } = await supabase.from('equipamentos').insert(linha).select('*').single()
  if (error) {
    avisarErro(error, 'criar equipamento')
    return null
  }
  await recarregar()
  return data.id
}

export async function apagarEquipamento(equipamentoId) {
  alterarLocal((b) => {
    b.equipamentos = b.equipamentos.filter((e) => e.id !== equipamentoId)
  })
  const { error } = await supabase.from('equipamentos').delete().eq('id', equipamentoId)
  avisarErro(error, 'apagar equipamento')
}

export function registrarLimpeza(equipamentoId) {
  const agora = hojeISO()
  alterarLocal((b) => {
    const e = b.equipamentos.find((x) => x.id === equipamentoId)
    if (e) e.ultimaLimpeza = agora
  })
  return supabase
    .from('equipamentos')
    .update({ ultima_limpeza: agora })
    .eq('id', equipamentoId)
    .then(({ error }) => avisarErro(error, 'registrar limpeza'))
}

export function adiarLimpeza(equipamentoId, meses) {
  const e = banco().equipamentos.find((x) => x.id === equipamentoId)
  if (!e) return
  const nova = somarMeses(e.ultimaLimpeza || e.instaladoEm || hojeISO(), meses)
  alterarLocal((b) => {
    const alvo = b.equipamentos.find((x) => x.id === equipamentoId)
    if (alvo) alvo.ultimaLimpeza = nova
  })
  return supabase
    .from('equipamentos')
    .update({ ultima_limpeza: nova })
    .eq('id', equipamentoId)
    .then(({ error }) => avisarErro(error, 'adiar limpeza'))
}

/* ----- biblioteca ----- */

export async function salvarItem(item, contaId) {
  const linha = paraItem({ ...item, contaId })
  if (item.id) {
    alterarLocal((b) => {
      const i = b.itens.findIndex((x) => x.id === item.id)
      if (i >= 0) b.itens[i] = { ...b.itens[i], ...item }
    })
    agendar('item:' + item.id, async () => {
      const { error } = await supabase.from('itens').update(linha).eq('id', item.id)
      avisarErro(error, 'salvar item')
    })
    return item.id
  }
  const { data, error } = await supabase.from('itens').insert(linha).select('*').single()
  if (error) {
    avisarErro(error, 'criar item')
    return null
  }
  await recarregar()
  return data.id
}

export async function apagarItem(itemId) {
  alterarLocal((b) => {
    b.itens = b.itens.filter((i) => i.id !== itemId)
  })
  const { error } = await supabase.from('itens').delete().eq('id', itemId)
  avisarErro(error, 'apagar item')
}

/* ----- conta e parâmetros ----- */

export async function salvarConta(conta) {
  alterarLocal((b) => {
    const i = b.contas.findIndex((c) => c.id === conta.id)
    if (i >= 0) b.contas[i] = conta
  })
  agendar('conta:' + conta.id, async () => {
    const { error } = await supabase.from('contas').update(paraConta(conta)).eq('id', conta.id)
    avisarErro(error, 'salvar empresa')
  })
}

export async function salvarParametrosDaConta(contaId, parametros) {
  alterarLocal((b) => {
    const c = b.contas.find((x) => x.id === contaId)
    if (c) c.parametros = parametros
  })
  agendar('parametros-conta:' + contaId, async () => {
    const { error } = await supabase.from('contas').update({ parametros }).eq('id', contaId)
    avisarErro(error, 'salvar configurações')
  })
}

export async function salvarParametrosGerais(parametros) {
  alterarLocal((b) => {
    b.parametrosGerais = parametros
  })
  agendar('parametros-gerais', async () => {
    const { error } = await supabase
      .from('parametros_gerais')
      .upsert({ id: true, valores: parametros, atualizado_em: hojeISO() })
    avisarErro(error, 'salvar parâmetros gerais')
  })
}

/* ----- master ----- */

export async function criarContaDeCliente({ nomeEmpresa, nomeUsuario, email, senha }) {
  const { data, error } = await supabase.functions.invoke('criar-conta', {
    body: { nomeEmpresa, nomeUsuario, email, senha },
  })
  if (error) {
    let detalhe = ''
    try {
      detalhe = (await error.context?.json())?.erro || ''
    } catch {
      detalhe = ''
    }
    return { erro: detalhe || 'Não foi possível criar a conta.' }
  }
  if (data?.erro) return { erro: data.erro }
  await recarregar()
  return { ok: true }
}

export async function apagarContaDeCliente(contaId) {
  const { error } = await supabase.from('contas').delete().eq('id', contaId)
  if (error) {
    avisarErro(error, 'apagar conta')
    return
  }
  await recarregar()
}

export async function trocarSenhaDeUsuario(usuarioId, senha) {
  const { data, error } = await supabase.functions.invoke('trocar-senha', {
    body: { usuarioId, senha },
  })
  if (error) return { erro: 'Não foi possível trocar a senha.' }
  if (data?.erro) return { erro: data.erro }
  return { ok: true }
}
