// Camada de dados. É o único arquivo que conversa com o banco.
// As telas leem de `banco()` e chamam as funções de `acoes.js`.

import { supabase } from './supabase.js'
import { PARAMETROS_PADRAO } from './parametros.js'

function vazio() {
  return {
    contas: [],
    usuarios: [],
    pessoas: [],
    equipamentos: [],
    itens: [],
    orcamentos: [],
    parametrosGerais: PARAMETROS_PADRAO,
  }
}

let cache = vazio()
let perfil = null
let carregando = false
const ouvintes = new Set()

export function banco() {
  return cache
}

export function estaCarregando() {
  return carregando
}

export function avisar() {
  ouvintes.forEach((f) => f())
}

export function observar(funcao) {
  ouvintes.add(funcao)
  return () => ouvintes.delete(funcao)
}

export function usuarioAtual() {
  return perfil
}

export function contaAtual() {
  if (!perfil || !perfil.contaId) return null
  return cache.contas.find((c) => c.id === perfil.contaId) || null
}

/* ----- tradução entre o banco (nomes com _) e o app ----- */

const daConta = (r) => ({
  id: r.id,
  razaoSocial: r.razao_social,
  nomeFantasia: r.nome_fantasia,
  tipoPessoa: r.tipo_pessoa,
  cnpj: r.cnpj,
  telefone: r.telefone,
  email: r.email,
  endereco: r.endereco,
  logo: r.logo,
  impostoPct: Number(r.imposto_pct),
  margemPct: Number(r.margem_pct),
  validadeDias: r.validade_dias,
  condicoesPadrao: r.condicoes_padrao,
  observacoesPadrao: r.observacoes_padrao,
  parametros: r.parametros,
  criadaEm: r.criada_em,
})

export const paraConta = (c) => ({
  razao_social: c.razaoSocial,
  nome_fantasia: c.nomeFantasia,
  tipo_pessoa: c.tipoPessoa,
  cnpj: c.cnpj,
  telefone: c.telefone,
  email: c.email,
  endereco: c.endereco,
  logo: c.logo,
  imposto_pct: c.impostoPct,
  margem_pct: c.margemPct,
  validade_dias: c.validadeDias,
  condicoes_padrao: c.condicoesPadrao,
  observacoes_padrao: c.observacoesPadrao,
  parametros: c.parametros ?? null,
})

const doPerfil = (r) => ({
  id: r.id,
  contaId: r.conta_id,
  nome: r.nome,
  email: r.email,
  papel: r.papel,
})

const daPessoa = (r) => ({
  id: r.id,
  contaId: r.conta_id,
  tipo: r.tipo,
  nome: r.nome,
  documento: r.documento,
  whatsapp: r.whatsapp,
  email: r.email,
  endereco: r.endereco,
  observacoes: r.observacoes,
  ehCliente: r.eh_cliente,
  proximoContato: r.proximo_contato,
  criadoEm: r.criado_em,
})

export const paraPessoa = (p) => ({
  conta_id: p.contaId,
  tipo: p.tipo || 'pf',
  nome: p.nome,
  documento: p.documento || '',
  whatsapp: p.whatsapp || '',
  email: p.email || '',
  endereco: p.endereco || '',
  observacoes: p.observacoes || '',
  eh_cliente: !!p.ehCliente,
  proximo_contato: p.proximoContato || null,
})

const doEquipamento = (r) => ({
  id: r.id,
  pessoaId: r.pessoa_id,
  contaId: r.conta_id,
  ambiente: r.ambiente,
  btu: r.btu,
  marca: r.marca,
  uso: r.uso,
  instaladoEm: r.instalado_em,
  ultimaLimpeza: r.ultima_limpeza,
})

export const paraEquipamento = (e) => ({
  pessoa_id: e.pessoaId,
  conta_id: e.contaId,
  ambiente: e.ambiente || '',
  btu: Number(e.btu) || 0,
  marca: e.marca || '',
  uso: e.uso || 'residencial',
  instalado_em: e.instaladoEm || null,
  ultima_limpeza: e.ultimaLimpeza || null,
})

const doItem = (r) => ({
  id: r.id,
  contaId: r.conta_id,
  tipo: r.tipo,
  tipoOutro: r.tipo_outro || '',
  tipoPreco: r.tipo_preco || 'custo',
  nome: r.nome,
  unidade: r.unidade,
  custo: Number(r.custo),
})

export const paraItem = (i) => ({
  conta_id: i.contaId,
  tipo: i.tipo || 'servico',
  tipo_outro: i.tipoOutro || '',
  tipo_preco: i.tipoPreco === 'venda' ? 'venda' : 'custo',
  nome: i.nome,
  unidade: i.unidade || 'unidade',
  custo: Number(i.custo) || 0,
})

const doOrcamento = (r) => ({
  id: r.id,
  contaId: r.conta_id,
  pessoaId: r.pessoa_id,
  numero: r.numero,
  modelo: r.modelo,
  situacao: r.situacao,
  impostoPct: Number(r.imposto_pct),
  margemPct: Number(r.margem_pct),
  custoTotal: Number(r.custo_total),
  total: Number(r.total),
  validadeDias: r.validade_dias,
  condicoes: r.condicoes,
  observacoes: r.observacoes,
  mostrarUnitario: r.mostrar_unitario,
  motivoPerda: r.motivo_perda,
  cobrancas: r.cobrancas,
  aceite: r.aceite,
  token: r.token,
  proximoContato: r.proximo_contato,
  criadoEm: r.criado_em,
  enviadoEm: r.enviado_em,
  decididoEm: r.decidido_em,
  instaladoEm: r.instalado_em,
  itens: (r.orcamento_itens || [])
    .slice()
    .sort((a, b) => a.ordem - b.ordem)
    .map((i) => ({
      id: i.id,
      itemId: i.item_id,
      nome: i.nome,
      unidade: i.unidade,
      qtd: Number(i.qtd),
      custoUnit: Number(i.custo_unit),
      precoUnit: Number(i.preco_unit),
    })),
})

export const paraOrcamento = (o) => ({
  conta_id: o.contaId,
  pessoa_id: o.pessoaId || null,
  modelo: o.modelo || 'margem',
  situacao: o.situacao,
  imposto_pct: o.impostoPct,
  margem_pct: o.margemPct,
  custo_total: o.custoTotal,
  total: o.total,
  validade_dias: o.validadeDias,
  condicoes: o.condicoes,
  observacoes: o.observacoes,
  mostrar_unitario: !!o.mostrarUnitario,
  motivo_perda: o.motivoPerda || '',
  cobrancas: o.cobrancas || 0,
  aceite: o.aceite ?? null,
  proximo_contato: o.proximoContato || null,
  enviado_em: o.enviadoEm || null,
  decidido_em: o.decididoEm || null,
  instalado_em: o.instaladoEm || null,
})

/* ----- sessão ----- */

export async function entrar(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: String(email).trim(),
    password: senha,
  })
  if (error) return { erro: traduzirErro(error.message) }
  await carregarTudo()
  return { usuario: perfil }
}

export async function recuperarSenha(email) {
  const destino = window.location.origin + window.location.pathname + '#/nova-senha'
  const { error } = await supabase.auth.resetPasswordForEmail(String(email).trim(), {
    redirectTo: destino,
  })
  return error ? { erro: error.message } : { ok: true }
}

export async function trocarMinhaSenha(nova) {
  const { error } = await supabase.auth.updateUser({ password: nova })
  return error ? { erro: error.message } : { ok: true }
}

export async function sair() {
  await supabase.auth.signOut()
  perfil = null
  cache = vazio()
  avisar()
}

function traduzirErro(mensagem) {
  const m = String(mensagem || '').toLowerCase()
  if (m.includes('invalid login')) return 'E-mail ou senha não conferem.'
  if (m.includes('email not confirmed')) return 'Este e-mail ainda não foi confirmado.'
  return mensagem
}

/* ----- carregamento ----- */

let iniciado = false

export async function iniciar() {
  if (iniciado) return
  iniciado = true
  carregando = true
  avisar()

  // o link de recuperação de senha chega com a sessão na URL; quando ela
  // entrar, carregamos os dados sem precisar recarregar a página
  supabase.auth.onAuthStateChange(async (evento, sessao) => {
    if (evento === 'SIGNED_IN' && sessao && !perfil) await carregarTudo()
    if (evento === 'SIGNED_OUT') {
      perfil = null
      cache = vazio()
      avisar()
    }
  })

  const { data } = await supabase.auth.getSession()
  if (data?.session) await carregarTudo()
  carregando = false
  avisar()
}

export async function carregarTudo() {
  const { data: sessao } = await supabase.auth.getSession()
  const usuario = sessao?.session?.user
  if (!usuario) {
    perfil = null
    cache = vazio()
    avisar()
    return
  }

  const { data: perfilBruto } = await supabase.from('perfis').select('*').eq('id', usuario.id).maybeSingle()
  if (!perfilBruto) {
    perfil = null
    cache = vazio()
    avisar()
    return
  }
  perfil = doPerfil(perfilBruto)

  const novo = vazio()

  const { data: parametros } = await supabase.from('parametros_gerais').select('valores').maybeSingle()
  if (parametros?.valores) novo.parametrosGerais = parametros.valores

  if (perfil.papel === 'master') {
    const [{ data: contas }, { data: perfis }] = await Promise.all([
      supabase.from('contas').select('*').order('criada_em'),
      supabase.from('perfis').select('*'),
    ])
    novo.contas = (contas || []).map(daConta)
    novo.usuarios = (perfis || []).map(doPerfil)
    // o master também vê quantos orçamentos cada conta tem
    const { data: orcamentos } = await supabase.from('orcamentos').select('id, conta_id, criado_em')
    novo.orcamentos = (orcamentos || []).map((o) => ({
      id: o.id,
      contaId: o.conta_id,
      criadoEm: o.criado_em,
      itens: [],
    }))
  } else {
    const [conta, pessoas, equipamentos, itens, orcamentos] = await Promise.all([
      supabase.from('contas').select('*').eq('id', perfil.contaId).maybeSingle(),
      supabase.from('pessoas').select('*').order('nome'),
      supabase.from('equipamentos').select('*'),
      supabase.from('itens').select('*').order('nome'),
      supabase.from('orcamentos').select('*, orcamento_itens(*)').order('criado_em', { ascending: false }),
    ])
    if (conta.data) novo.contas = [daConta(conta.data)]
    novo.pessoas = (pessoas.data || []).map(daPessoa)
    novo.equipamentos = (equipamentos.data || []).map(doEquipamento)
    novo.itens = (itens.data || []).map(doItem)
    novo.orcamentos = (orcamentos.data || []).map(doOrcamento)
    novo.usuarios = perfil ? [perfil] : []
  }

  cache = novo
  avisar()
}

// altera a cópia que está na tela, sem esperar o banco responder
export function alterarLocal(funcao) {
  const copia = JSON.parse(JSON.stringify(cache))
  funcao(copia)
  cache = copia
  avisar()
}

export async function recarregar() {
  await carregarTudo()
}

/* ----- parâmetros: padrão do master, com ajuste da conta por cima ----- */

export function parametros(conta) {
  const geral = cache.parametrosGerais || PARAMETROS_PADRAO
  if (!conta || !conta.parametros) return geral
  return {
    ...geral,
    ...conta.parametros,
    textos: { ...geral.textos, ...(conta.parametros.textos || {}) },
  }
}

/* ----- preço ----- */

export function precoDoCusto(custo, margemPct, impostoPct) {
  const divisor = 1 - (Number(margemPct) + Number(impostoPct)) / 100
  if (!(divisor > 0.01)) return custo
  return custo / divisor
}

export function custoDoOrcamento(orcamento) {
  return (orcamento.itens || []).reduce((s, i) => s + Number(i.qtd) * Number(i.custoUnit || 0), 0)
}

// 'margem' — custo unitário com imposto e margem líquida.
// 'venda'  — preço final de cada item, puxado da biblioteca.
// 'avulso' — itens digitados na hora com preço final.
export function ehPorMargem(orcamento) {
  return (orcamento.modelo || 'margem') === 'margem'
}

export function precoDoItem(orcamento, item) {
  if (ehPorMargem(orcamento)) {
    return precoDoCusto(Number(item.custoUnit || 0), orcamento.margemPct, orcamento.impostoPct)
  }
  return Number(item.precoUnit || 0)
}

export function totalDoOrcamento(orcamento) {
  if (ehPorMargem(orcamento)) {
    return precoDoCusto(custoDoOrcamento(orcamento), orcamento.margemPct, orcamento.impostoPct)
  }
  return (orcamento.itens || []).reduce((s, i) => s + Number(i.qtd) * Number(i.precoUnit || 0), 0)
}

/* ----- formatos ----- */

export function moeda(n) {
  return Number(n || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

export function dataCurta(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}

export function hojeISO() {
  return new Date().toISOString()
}

export function somarDias(iso, dias) {
  const d = new Date(iso)
  d.setDate(d.getDate() + Number(dias))
  return d.toISOString()
}

export function somarMeses(iso, meses) {
  const d = new Date(iso)
  d.setMonth(d.getMonth() + Number(meses))
  return d.toISOString()
}

export function diasDesde(iso) {
  if (!iso) return null
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

export function venceu(iso) {
  if (!iso) return false
  return new Date(iso).getTime() <= Date.now()
}

export function soDigitos(t) {
  return String(t || '').replace(/\D/g, '')
}

export function linkWhatsapp(telefone, texto) {
  const numero = soDigitos(telefone)
  const completo = numero.length <= 11 ? '55' + numero : numero
  return 'https://wa.me/' + completo + '?text=' + encodeURIComponent(texto)
}
