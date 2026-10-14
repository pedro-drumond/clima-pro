import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDados, Texto, Numero, Area, Escolha, Marcador, Campo , Linha } from '../componentes/base.jsx'
import {
  moeda,
  dataCurta,
  parametros,
  totalDosItens,
  totalDoOrcamento,
  somaDoOrcamento,
  premioDoSeguro,
  precoDoItem,
  linkWhatsapp,
} from '../dados/armazenamento.js'
import { aplicarTexto, TEXTO_ENVIO } from '../dados/parametros.js'
import { linkDaProposta, primeiroNome } from '../dados/agenda.js'
import { resumoDaAcao } from '../dados/vocabulario.js'
import { Temperatura, Icone } from '../componentes/icones.jsx'
import {
  salvarOrcamento,
  salvarItensDoOrcamento,
  apagarOrcamento,
  marcarEnviadoSePreciso,
  reabrirOrcamento,
  marcarFechado,
  marcarPerdido,
  marcarInstalado,
  salvarPessoa,
  salvarItem,
  salvarConta,
} from '../dados/acoes.js'

export default function Orcamento() {
  const { id } = useParams()
  const { b, conta } = useDados()
  const navegar = useNavigate()
  const orcamento = b.orcamentos.find((o) => o.id === id)
  const [novoNome, setNovoNome] = useState('')
  const [novoZap, setNovoZap] = useState('')
  const [novoEmail, setNovoEmail] = useState('')
  const [cadastrando, setCadastrando] = useState(false)
  const [linkCopiado, setLinkCopiado] = useState(false)
  const [condicoesSalvas, setCondicoesSalvas] = useState(false)
  const [editandoPreco, setEditandoPreco] = useState(false)
  const [avulso, setAvulso] = useState({ nome: '', qtd: 1, preco: '', unidade: 'unidade', salvar: true })
  // os itens ficam numa cópia enquanto ele digita; só vão para o banco quando
  // ele sai do campo, para não regravar a lista inteira a cada tecla
  const [rascunho, setRascunho] = useState(null)

  const itensNaTela = rascunho ?? orcamento?.itens ?? []

  useEffect(() => {
    setRascunho(null)
  }, [id])

  if (!orcamento) return <p>Orçamento não encontrado.</p>

  const params = parametros(conta)
  const pessoas = b.pessoas.filter((p) => p.contaId === conta.id)
  const pessoa = pessoas.find((p) => p.id === orcamento.pessoaId)
  const itens = b.itens.filter((i) => i.contaId === conta.id)
  const comItens = { ...orcamento, itens: itensNaTela }
  const totalItens = totalDosItens(comItens)
  const premio = orcamento.seguro ? premioDoSeguro(orcamento.seguroValorEquip, params) : 0
  const soma = totalItens + premio
  const precoDigitado = orcamento.precoFinal !== null && orcamento.precoFinal !== undefined
  const total = precoDigitado ? Number(orcamento.precoFinal) : soma
  const editavel = orcamento.situacao === 'contato' || orcamento.situacao === 'enviado'

  const mudar = (campos) => salvarOrcamento({ ...orcamento, itens: itensNaTela, ...campos })

  async function gravarItens(lista) {
    setRascunho(lista)
    await salvarItensDoOrcamento(orcamento, lista)
    setRascunho(null)
  }

  function adicionarDaBiblioteca(itemId) {
    const it = itens.find((i) => i.id === itemId)
    if (!it) return
    gravarItens([
      ...itensNaTela,
      {
        itemId: it.id,
        nome: it.nome,
        unidade: it.unidade,
        qtd: 1,
        custoUnit: 0,
        precoUnit: it.custo,
      },
    ])
  }

  // item escrito na hora, com o preço que o cliente paga
  function adicionarAvulso() {
    if (!avulso.nome.trim()) return
    const valor = Number(avulso.preco) || 0
    const nome = avulso.nome.trim()
    const unidade = avulso.unidade || 'unidade'

    gravarItens([
      ...itensNaTela,
      {
        itemId: '',
        nome,
        unidade,
        qtd: Number(avulso.qtd) || 1,
        custoUnit: 0,
        precoUnit: valor,
      },
    ])

    if (avulso.salvar) {
      salvarItem(
        { tipo: 'servico', nome, unidade, custo: valor, tipoPreco: 'venda' },
        conta.id
      )
    }
    setAvulso({ nome: '', qtd: 1, preco: '', unidade: 'unidade', salvar: true })
  }

  // enquanto digita fica só na tela
  function mudarItem(indice, campos) {
    setRascunho(itensNaTela.map((i, n) => (n === indice ? { ...i, ...campos } : i)))
  }

  function gravarRascunho() {
    if (rascunho) gravarItens(rascunho)
  }

  function removerItem(indice) {
    gravarItens(itensNaTela.filter((_, n) => n !== indice))
  }

  const todosVisiveis = itensNaTela.every((i) => !i.oculto)
  const nenhumVisivel = itensNaTela.every((i) => i.oculto)

  function mostrarTodos(mostrar) {
    gravarItens(itensNaTela.map((i) => ({ ...i, oculto: !mostrar })))
  }

  function alternarOculto(indice) {
    gravarItens(itensNaTela.map((i, n) => (n === indice ? { ...i, oculto: !i.oculto } : i)))
  }

  function gravarPreco(texto) {
    setEditandoPreco(false)
    const valor = String(texto).replace(',', '.').trim()
    if (valor === '') return
    const numero = Math.round(Number(valor) * 100) / 100
    if (!(numero >= 0)) return
    // digitar a própria soma é o mesmo que não ter mexido
    mudar({ precoFinal: Math.abs(numero - soma) < 0.005 ? null : numero })
  }

  async function criarPessoaRapida() {
    if (!novoNome.trim()) return
    const novoId = await salvarPessoa(
      { nome: novoNome.trim(), whatsapp: novoZap, email: novoEmail, tipo: 'pf', documento: '', endereco: '' },
      conta.id
    )
    if (novoId) mudar({ pessoaId: novoId })
    setNovoNome('')
    setNovoZap('')
    setNovoEmail('')
    setCadastrando(false)
  }

  const mensagemEnvio = aplicarTexto(TEXTO_ENVIO, {
    pessoa: pessoa ? primeiroNome(pessoa.nome) : '',
    empresa: conta.nomeFantasia,
    numero: orcamento.numero,
    total: moeda(total),
    link: linkDaProposta(orcamento),
  })

  return (
    <>
      <div className="cabeca">
        <div>
          <Link to="/orcamentos" className="botao texto voltar">
            Voltar
          </Link>
          <h1>Orçamento nº {orcamento.numero}</h1>
        </div>
        <Marcador situacao={orcamento.situacao} />
      </div>

      <div className="ficha">
      <div className="coluna-lado">
      <div className="bloco bloco-cliente">
        <h2>Cliente</h2>
        <Linha>
          <Escolha
            rotulo="Cliente"
            tamanho="medio"
            valor={orcamento.pessoaId || ''}
            aoMudar={(v) => mudar({ pessoaId: v })}
            opcoes={[{ valor: '', texto: 'Escolher...' }].concat(
              pessoas.map((p) => ({ valor: p.id, texto: p.nome }))
            )}
          />
          {!orcamento.pessoaId ? (
            <Campo rotulo={"\u00a0"}>
              <button className="botao" onClick={() => setCadastrando(!cadastrando)}>
                {cadastrando ? 'Cancelar' : 'Novo cliente'}
              </button>
            </Campo>
          ) : null}
        </Linha>

        {!orcamento.pessoaId && cadastrando ? (
          <Linha>
            <Texto rotulo="Nome" tamanho="medio" valor={novoNome} aoMudar={setNovoNome} />
            <Texto rotulo="WhatsApp" tamanho="medio" valor={novoZap} aoMudar={setNovoZap} />
            <Texto rotulo="E-mail" tamanho="medio" valor={novoEmail} aoMudar={setNovoEmail} />
            <Campo rotulo={"\u00a0"}>
              <button className="botao principal" onClick={criarPessoaRapida}>
                Cadastrar
              </button>
            </Campo>
          </Linha>
        ) : null}

        {orcamento.pessoaId ? (
          <p className="fraco">
            {pessoa?.whatsapp} · {pessoa?.endereco || 'sem endereço'} ·{' '}
            <Link to={'/pessoas/' + pessoa?.id}>abrir ficha</Link>
          </p>
        ) : null}
      </div>

      <div className="bloco bloco-preco">
        <h2>Preço</h2>
        <div className="seguro">
          <label className="marcacao">
            <input
              type="checkbox"
              checked={!!orcamento.seguro}
              disabled={!editavel}
              onChange={(e) =>
                mudar({
                  seguro: e.target.checked,
                  seguroPremio: e.target.checked ? premioDoSeguro(orcamento.seguroValorEquip, params) : 0,
                })
              }
            />
            Incluir seguro do equipamento
          </label>
          {orcamento.seguro ? (
            <Linha>
              <Texto
                rotulo="Valor do aparelho (R$)"
                tamanho="curto"
                type="number"
                valor={orcamento.seguroValorEquip}
                disabled={!editavel}
                aoMudar={(v) =>
                  mudar({ seguroValorEquip: Number(v) || 0, seguroPremio: premioDoSeguro(v, params) })
                }
              />
              <Campo rotulo="Seguro por ano">
                <span className="valor-calculado">{moeda(premio)}</span>
              </Campo>
            </Linha>
          ) : null}
        </div>

        <table>
          <tbody>
            <tr>
              <td>Serviços e materiais</td>
              <td className="n">{moeda(totalItens)}</td>
            </tr>
            {orcamento.seguro ? (
              <tr>
                <td>Seguro do equipamento (1 ano)</td>
                <td className="n">{moeda(premio)}</td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <div className="total-linha">
          <span>Preço ao cliente</span>
          <span className="preco-final">
            {editandoPreco ? (
              <input
                className="celula larga preco-final-campo"
                type="number"
                min="0"
                step="0.01"
                autoFocus
                defaultValue={total.toFixed(2)}
                onBlur={(e) => gravarPreco(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') gravarPreco(e.target.value)
                  if (e.key === 'Escape') setEditandoPreco(false)
                }}
              />
            ) : (
              <span className="numero-grande">{moeda(total)}</span>
            )}
            {editavel && !editandoPreco ? (
              <button className="botao-icone" title="Editar o preço" onClick={() => setEditandoPreco(true)}>
                <Icone.lapis />
              </button>
            ) : null}
          </span>
        </div>
        {precoDigitado && editavel ? (
          <button className="botao-detalhes voltar-soma" onClick={() => mudar({ precoFinal: null })}>
            Voltar para a soma ({moeda(soma)})
          </button>
        ) : null}
      </div>

      <div className="bloco bloco-envio">
        <h2>Envio e situação</h2>
        {orcamento.aceite ? (
          <p>
            Aprovado por <strong>{orcamento.aceite.nome}</strong> em {dataCurta(orcamento.aceite.em)}
            <br />
            <span className="fraco">
              Registro: {orcamento.aceite.ip} · {orcamento.aceite.aparelho}
            </span>
          </p>
        ) : null}

        <div className="acoes acoes-envio">
          <a
            className="botao zap"
            href={linkWhatsapp(pessoa?.whatsapp, mensagemEnvio)}
            target="_blank"
            rel="noreferrer"
            onClick={() => marcarEnviadoSePreciso(orcamento, params)}
          >
            Enviar pelo WhatsApp
          </a>
          <button
            className="botao"
            onClick={() => {
              marcarEnviadoSePreciso(orcamento, params)
              const alvo = window.open('#/proposta/' + (orcamento.token || orcamento.id), '_blank')
              // dá tempo de a proposta carregar antes de abrir a impressão
              if (alvo) setTimeout(() => alvo.print(), 2500)
            }}
          >
            Gerar PDF
          </button>
          <button
            className="botao"
            onClick={() => {
              const endereco = window.location.origin + window.location.pathname + '#/proposta/' + (orcamento.token || orcamento.id)
              navigator.clipboard?.writeText(endereco)
              marcarEnviadoSePreciso(orcamento, params)
              setLinkCopiado(true)
              setTimeout(() => setLinkCopiado(false), 2500)
            }}
          >
            {linkCopiado ? 'Link copiado' : 'Copiar link'}
          </button>
          {orcamento.situacao === 'enviado' ? (
            <>
              <button className="botao" onClick={() => marcarFechado(orcamento.id)}>
                Fechou
              </button>
              <button
                className="botao"
                onClick={() => marcarPerdido(orcamento.id, prompt('Por que perdeu?') || '')}
              >
                Perdeu
              </button>
            </>
          ) : null}
          {orcamento.situacao === 'perdido' ? (
            <button className="botao principal" onClick={() => reabrirOrcamento(orcamento)}>
              Reabrir orçamento
            </button>
          ) : null}
          {orcamento.situacao === 'fechado' ? (
            <button className="botao principal" onClick={() => marcarInstalado(orcamento.id)}>
              Marcar como entregue
            </button>
          ) : null}
          <button
            className="botao perigo"
            onClick={() => {
              if (confirm('Apagar este orçamento?')) {
                apagarOrcamento(orcamento.id)
                navegar('/orcamentos')
              }
            }}
          >
            Apagar
          </button>
        </div>

        {(b.contatos || []).filter((c) => c.orcamentoId === orcamento.id).length > 0 ? (
          <div className="historico">
            <h3>O que já aconteceu</h3>
            {(b.contatos || [])
              .filter((c) => c.orcamentoId === orcamento.id)
              .sort((a, c) => new Date(c.criadoEm) - new Date(a.criadoEm))
              .map((c) => {
                const r = resumoDaAcao(c)
                return (
                  <div className="linha-historico" key={c.id}>
                    <span className="historico-data">{dataCurta(c.criadoEm)}</span>
                    <span className="historico-acao">
                      <Temperatura valor={r.temp} tamanho={13} />
                      {r.texto}
                    </span>
                    {c.proximoEm ? (
                      <span className="fraco">chamar em {dataCurta(c.proximoEm)}</span>
                    ) : null}
                  </div>
                )
              })}
          </div>
        ) : null}

        {orcamento.proximoContato ? (
          <p className="fraco" style={{ marginTop: 12 }}>
            Próxima cobrança em {dataCurta(orcamento.proximoContato)}
            {orcamento.cobrancas ? ' · já cobrado ' + orcamento.cobrancas + 'x' : ''}
          </p>
        ) : null}
      </div>

      </div>

      <div className="bloco bloco-itens">
        <h2>Itens</h2>
        {itensNaTela.length === 0 ? (
          <p className="fraco">Nenhum item ainda.</p>
        ) : (
          <table className="tabela-itens">
            <colgroup>
              <col />
              <col className="col-qtd" />
              <col className="col-preco" />
              <col className="col-total" />
              <col className="col-na-proposta" />
              <col className="col-lixeira" />
            </colgroup>
            <thead>
              <tr>
                <th>Item</th>
                <th className="c">Qtd.</th>
                <th className="c">Preço un.</th>
                <th className="n">Total</th>
                <th className="c coluna-na-proposta">
                  <label className="marcar-todos" title={todosVisiveis ? 'Tirar todos da proposta' : 'Mostrar todos na proposta'}>
                    <input
                      type="checkbox"
                      checked={todosVisiveis}
                      ref={(el) => {
                        if (el) el.indeterminate = !todosVisiveis && !nenhumVisivel
                      }}
                      disabled={!editavel}
                      onChange={() => mostrarTodos(!todosVisiveis)}
                    />
                    Na proposta
                  </label>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {itensNaTela.map((i, n) => (
                <tr key={n} className={i.oculto ? 'item-oculto' : ''}>
                  <td>
                    {i.nome}
                    <div className="fraco">{i.unidade}</div>
                  </td>
                  <td className="c">
                    <input
                      className="celula"
                      type="number"
                      min="0"
                      step="0.5"
                      value={i.qtd}
                      disabled={!editavel}
                      onChange={(e) => mudarItem(n, { qtd: Number(e.target.value) })}
                      onBlur={gravarRascunho}
                    />
                  </td>
                  <td className="c">
                    <input
                      className="celula larga"
                      type="number"
                      min="0"
                      step="0.01"
                      value={i.precoUnit}
                      disabled={!editavel}
                      onChange={(e) => mudarItem(n, { precoUnit: Number(e.target.value) })}
                      onBlur={gravarRascunho}
                    />
                  </td>
                  <td className="n">{moeda(i.qtd * precoDoItem(orcamento, i))}</td>
                  <td className="c coluna-na-proposta">
                    <input
                      type="checkbox"
                      className="na-proposta"
                      checked={!i.oculto}
                      disabled={!editavel}
                      title={i.oculto ? 'Não aparece na proposta' : 'Aparece na proposta'}
                      onChange={() => alternarOculto(n)}
                    />
                  </td>
                  <td className="acoes-item">
                    {editavel ? (
                      <button className="botao-icone perigo" title="Remover" onClick={() => removerItem(n)}>
                        <Icone.lixeira />
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {editavel ? (
          <Campo rotulo="Adicionar da biblioteca">
            <select
              value=""
              onChange={(e) => {
                adicionarDaBiblioteca(e.target.value)
                e.target.value = ''
              }}
            >
              <option value="">Escolher item...</option>
              {itens.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome} — {moeda(i.custo)} / {i.unidade}
                </option>
              ))}
            </select>
          </Campo>
        ) : null}

        {editavel ? (
          <div className="item-avulso">
            <h3>Ou escrever um item novo</h3>
            <Linha>
              <Texto
                rotulo="Descrição"
                tamanho="cresce"
                valor={avulso.nome}
                aoMudar={(v) => setAvulso({ ...avulso, nome: v })}
              />
              <Escolha
                rotulo="Unidade"
                tamanho="medio"
                valor={avulso.unidade || 'unidade'}
                aoMudar={(v) => setAvulso({ ...avulso, unidade: v })}
                opcoes={[
                  { valor: 'unidade', texto: 'Un.' },
                  { valor: 'metro', texto: 'Metro' },
                  { valor: 'hora', texto: 'Hora' },
                  { valor: 'diária', texto: 'Diária' },
                  { valor: 'peça', texto: 'Peça' },
                ]}
              />
              <Numero rotulo="Qtd." valor={avulso.qtd} aoMudar={(v) => setAvulso({ ...avulso, qtd: v })} />
              <Texto
                rotulo="Preço (R$)"
                tamanho="curto"
                type="number"
                valor={avulso.preco}
                aoMudar={(v) => setAvulso({ ...avulso, preco: v })}
              />
              <Campo rotulo={" "}>
                <button className="botao mais" onClick={adicionarAvulso} title="Adicionar item">
                  +
                </button>
              </Campo>
            </Linha>
            <label className="marcacao">
              <input
                type="checkbox"
                checked={avulso.salvar}
                onChange={(e) => setAvulso({ ...avulso, salvar: e.target.checked })}
              />
              Salvar este item na biblioteca
            </label>
          </div>
        ) : null}

        <div className="divisor-bloco" />

        <h2>Condições</h2>
        <Linha>
          <Numero
            rotulo="Validade (dias)"
            valor={orcamento.validadeDias}
            aoMudar={(v) => mudar({ validadeDias: v })}
            disabled={!editavel}
          />
          <Area
            rotulo="Pagamento"
            linhas={2}
            tamanho="cresce"
            valor={orcamento.condicoes}
            aoMudar={(v) => mudar({ condicoes: v })}
          />
          <Area
            rotulo="Observações"
            linhas={2}
            tamanho="cresce"
            valor={orcamento.observacoes}
            aoMudar={(v) => mudar({ observacoes: v })}
          />
        </Linha>
        <label className="marcacao">
          <input
            type="checkbox"
            checked={orcamento.mostrarUnitario}
            onChange={(e) => mudar({ mostrarUnitario: e.target.checked })}
          />
          Mostrar valor item a item para o cliente
        </label>

        {editavel ? (
          <div className="pe-condicoes">
            <p className="fraco">Valem só para este orçamento, a não ser que você salve como padrão.</p>
            <button
              className="botao"
              onClick={() => {
                salvarConta({
                  ...conta,
                  validadeDias: Number(orcamento.validadeDias) || 0,
                  condicoesPadrao: orcamento.condicoes || '',
                  observacoesPadrao: orcamento.observacoes || '',
                })
                setCondicoesSalvas(true)
                setTimeout(() => setCondicoesSalvas(false), 2500)
              }}
            >
              {condicoesSalvas ? 'Salvo como padrão' : 'Salvar como padrão da empresa'}
            </button>
          </div>
        ) : null}
      </div>

      </div>
    </>
  )
}
