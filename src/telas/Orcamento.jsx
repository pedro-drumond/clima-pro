import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDados, Texto, Numero, Area, Escolha, Marcador, Campo , Linha } from '../componentes/base.jsx'
import {
  moeda,
  dataCurta,
  parametros,
  precoDoCusto,
  custoDoOrcamento,
  totalDoOrcamento,
  precoDoItem,
  ehPorMargem,
  linkWhatsapp,
} from '../dados/armazenamento.js'
import { aplicarTexto } from '../dados/parametros.js'
import { linkDaProposta, primeiroNome } from '../dados/agenda.js'
import {
  salvarOrcamento,
  salvarItensDoOrcamento,
  apagarOrcamento,
  marcarEnviado,
  marcarFechado,
  marcarPerdido,
  marcarInstalado,
  salvarPessoa,
  salvarItem,
} from '../dados/acoes.js'
import { MODELOS } from './NovoOrcamento.jsx'

export default function Orcamento() {
  const { id } = useParams()
  const { b, conta } = useDados()
  const navegar = useNavigate()
  const orcamento = b.orcamentos.find((o) => o.id === id)
  const [novoNome, setNovoNome] = useState('')
  const [novoZap, setNovoZap] = useState('')
  const [cadastrando, setCadastrando] = useState(false)
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
  // por margem só aparece item de custo; por preço de venda só item de venda;
  // em itens avulsos aparecem os dois
  const itens = b.itens
    .filter((i) => i.contaId === conta.id)
    .filter((i) => {
      if (orcamento.modelo === 'margem') return i.tipoPreco !== 'venda'
      if (orcamento.modelo === 'venda') return i.tipoPreco === 'venda'
      return true
    })
  const porMargem = ehPorMargem(orcamento)
  const comItens = { ...orcamento, itens: itensNaTela }
  const custo = custoDoOrcamento(comItens)
  const total = totalDoOrcamento(comItens)
  const editavel = orcamento.situacao === 'contato' || orcamento.situacao === 'enviado'
  const modelo = MODELOS.find((m) => m.valor === (orcamento.modelo || 'margem'))

  const mudar = (campos) => salvarOrcamento({ ...orcamento, itens: itensNaTela, ...campos })

  async function gravarItens(lista) {
    setRascunho(lista)
    await salvarItensDoOrcamento(orcamento, lista)
    setRascunho(null)
  }

  function adicionarDaBiblioteca(itemId) {
    const it = itens.find((i) => i.id === itemId)
    if (!it) return
    const ehVenda = it.tipoPreco === 'venda'
    gravarItens([
      ...itensNaTela,
      {
        itemId: it.id,
        nome: it.nome,
        unidade: it.unidade,
        qtd: 1,
        custoUnit: ehVenda ? 0 : it.custo,
        precoUnit: ehVenda ? it.custo : precoDoCusto(it.custo, conta.margemPct, conta.impostoPct),
      },
    ])
  }

  // item escrito na hora, em qualquer modelo. No orçamento por margem o valor
  // digitado é custo e o sistema calcula o preço; nos outros é o preço final.
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
        custoUnit: porMargem ? valor : 0,
        precoUnit: porMargem ? precoDoCusto(valor, orcamento.margemPct, orcamento.impostoPct) : valor,
      },
    ])

    if (avulso.salvar) {
      salvarItem(
        { tipo: 'servico', nome, unidade, custo: valor, tipoPreco: porMargem ? 'custo' : 'venda' },
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

  async function criarPessoaRapida() {
    if (!novoNome.trim()) return
    const novoId = await salvarPessoa(
      { nome: novoNome.trim(), whatsapp: novoZap, tipo: 'pf', documento: '', email: '', endereco: '' },
      conta.id
    )
    if (novoId) mudar({ pessoaId: novoId })
    setNovoNome('')
    setNovoZap('')
    setCadastrando(false)
  }

  const mensagemEnvio = aplicarTexto(params.textos.enviarOrcamento, {
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

      <div className="bloco">
        <div className="modelo-atual">
          <strong>{modelo?.titulo}</strong>
          <span>{modelo?.linha}</span>
        </div>
      </div>

      <div className="bloco">
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

      <div className="bloco">
        <h2>Itens</h2>
        {itensNaTela.length === 0 ? (
          <p className="fraco">Nenhum item ainda.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th className="n">Qtd.</th>
                {porMargem ? <th className="n">Custo un.</th> : null}
                <th className="n">{porMargem ? 'Preço un.' : 'Preço un. de venda'}</th>
                <th className="n">Total</th>
                <th className="n"></th>
              </tr>
            </thead>
            <tbody>
              {itensNaTela.map((i, n) => (
                <tr key={n}>
                  <td>
                    {i.nome}
                    <div className="fraco">{i.unidade}</div>
                  </td>
                  <td className="n">
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
                  {porMargem ? (
                    <td className="n">
                      <input
                        className="celula larga"
                        type="number"
                        min="0"
                        step="0.01"
                        value={i.custoUnit}
                        disabled={!editavel}
                        onChange={(e) => mudarItem(n, { custoUnit: Number(e.target.value) })}
                        onBlur={gravarRascunho}
                      />
                    </td>
                  ) : null}
                  <td className="n">
                    {porMargem ? (
                      moeda(precoDoItem(orcamento, i))
                    ) : (
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
                    )}
                  </td>
                  <td className="n">{moeda(i.qtd * precoDoItem(orcamento, i))}</td>
                  <td className="n">
                    {editavel ? (
                      <button className="botao perigo" onClick={() => removerItem(n)}>
                        Remover
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
            <Texto rotulo="Descrição" valor={avulso.nome} aoMudar={(v) => setAvulso({ ...avulso, nome: v })} />
            <Linha>
              <Escolha
                rotulo="Unidade"
                tamanho="medio"
                valor={avulso.unidade || 'unidade'}
                aoMudar={(v) => setAvulso({ ...avulso, unidade: v })}
                opcoes={['unidade', 'metro', 'hora', 'diária', 'peça'].map((u) => ({
                  valor: u,
                  texto: u[0].toUpperCase() + u.slice(1),
                }))}
              />
              <Numero rotulo="Quantidade" valor={avulso.qtd} aoMudar={(v) => setAvulso({ ...avulso, qtd: v })} />
              <Texto
                rotulo={porMargem ? 'Custo (R$)' : 'Preço de venda (R$)'}
                tamanho="curto"
                type="number"
                valor={avulso.preco}
                aoMudar={(v) => setAvulso({ ...avulso, preco: v })}
              />
            </Linha>
            <label className="marcacao">
              <input
                type="checkbox"
                checked={avulso.salvar}
                onChange={(e) => setAvulso({ ...avulso, salvar: e.target.checked })}
              />
              Salvar este item na biblioteca
            </label>
            <button className="botao" onClick={adicionarAvulso}>
              Adicionar item
            </button>
          </div>
        ) : null}
      </div>

      <div className="bloco">
        <h2>Preço</h2>
        {porMargem ? (
          <>
            <Linha>
              <Numero
                rotulo="Imposto (%)"
                valor={orcamento.impostoPct}
                aoMudar={(v) => mudar({ impostoPct: v })}
                disabled={!editavel}
              />
              <Numero
                rotulo="Margem líquida (%)"
                valor={orcamento.margemPct}
                aoMudar={(v) => mudar({ margemPct: v })}
                disabled={!editavel}
              />
            </Linha>
            <table>
              <tbody>
                <tr>
                  <td>Custo</td>
                  <td className="n">{moeda(custo)}</td>
                </tr>
                <tr>
                  <td>Imposto sobre a venda ({orcamento.impostoPct}%)</td>
                  <td className="n">{moeda(total * (orcamento.impostoPct / 100))}</td>
                </tr>
                <tr>
                  <td>Margem ({orcamento.margemPct}%)</td>
                  <td className="n">{moeda(total * (orcamento.margemPct / 100))}</td>
                </tr>
              </tbody>
            </table>
          </>
        ) : null}
        <div className="total-linha">
          <span>Preço ao cliente</span>
          <span className="numero-grande">{moeda(total)}</span>
        </div>
      </div>

      <div className="bloco">
        <h2>Condições</h2>
        <Numero
          rotulo="Validade (dias)"
          valor={orcamento.validadeDias}
          aoMudar={(v) => mudar({ validadeDias: v })}
          disabled={!editavel}
        />
        <Area rotulo="Pagamento" valor={orcamento.condicoes} aoMudar={(v) => mudar({ condicoes: v })} />
        <Area rotulo="Observações" valor={orcamento.observacoes} aoMudar={(v) => mudar({ observacoes: v })} />
        <label className="marcacao">
          <input
            type="checkbox"
            checked={orcamento.mostrarUnitario}
            onChange={(e) => mudar({ mostrarUnitario: e.target.checked })}
          />
          Mostrar valor item a item para o cliente
        </label>
      </div>

      <div className="bloco">
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

        <div className="acoes">
          <a className="botao zap" href={linkWhatsapp(pessoa?.whatsapp, mensagemEnvio)} target="_blank" rel="noreferrer">
            Enviar pelo WhatsApp
          </a>
          <Link className="botao" to={'/proposta/' + (orcamento.token || orcamento.id)} target="_blank">
            Abrir como o cliente vê
          </Link>
          {orcamento.situacao === 'contato' ? (
            <button className="botao principal" onClick={() => marcarEnviado(orcamento.id, params)}>
              Marcar como enviado
            </button>
          ) : null}
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
          {orcamento.situacao === 'fechado' ? (
            <button className="botao principal" onClick={() => marcarInstalado(orcamento.id)}>
              Instalação concluída
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

        {orcamento.proximoContato ? (
          <p className="fraco" style={{ marginTop: 12 }}>
            Próxima cobrança em {dataCurta(orcamento.proximoContato)}
            {orcamento.cobrancas ? ' · já cobrado ' + orcamento.cobrancas + 'x' : ''}
          </p>
        ) : null}
      </div>
    </>
  )
}
