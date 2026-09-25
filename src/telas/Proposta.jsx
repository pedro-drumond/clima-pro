import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../dados/supabase.js'
import { moeda, dataCurta, somarDias } from '../dados/armazenamento.js'
import { Aparelho } from '../componentes/aparelhos.jsx'

const ESTILOS = [
  { valor: 'cursivo', texto: 'Cursiva' },
  { valor: 'rubrica', texto: 'Rubrica' },
  { valor: 'selo', texto: 'Selo' },
]

function aparelhoDeQuemAbriu() {
  const ua = navigator.userAgent || ''
  if (/iPhone|iPad/.test(ua)) return 'Celular iPhone'
  if (/Android/.test(ua)) return 'Celular Android'
  if (/Mac/.test(ua)) return 'Computador Mac'
  if (/Windows/.test(ua)) return 'Computador Windows'
  return 'Navegador'
}

function Cabecalho({ empresa, orcamento, validade }) {
  const modelo = empresa.modeloCabecalho || 'simples'

  const identidade = (
    <>
      {empresa.logo ? <img className="logo" src={empresa.logo} alt="" /> : null}
      <div className="nome-empresa">{empresa.nomeFantasia}</div>
      <div className="fraco">
        {empresa.cnpj ? empresa.cnpj + ' · ' : ''}
        {empresa.telefone}
      </div>
      <div className="fraco">{empresa.endereco}</div>
    </>
  )

  const numeros = (
    <div className="fraco numeros-proposta">
      Orçamento nº {orcamento.numero}
      <br />
      {dataCurta(orcamento.enviadoEm || orcamento.criadoEm)}
      <br />
      Válido até {dataCurta(validade)}
    </div>
  )

  if (modelo === 'faixa') {
    return (
      <div className="cabecalho-proposta faixa">
        <div className="faixa-marca">
          <div className="faixa-esquerda">
            {empresa.icone ? <Aparelho tipo={empresa.icone} tamanho={52} /> : null}
            <div>
              <div className="nome-empresa">{empresa.nomeFantasia}</div>
              <div className="faixa-contato">
                {empresa.telefone}
                {empresa.endereco ? ' · ' + empresa.endereco : ''}
              </div>
            </div>
          </div>
          {empresa.logo ? <img className="logo" src={empresa.logo} alt="" /> : null}
        </div>
        <div className="faixa-abaixo">
          <span className="fraco">{empresa.cnpj}</span>
          {numeros}
        </div>
      </div>
    )
  }

  if (modelo === 'centralizado') {
    return (
      <div className="cabecalho-proposta centralizado">
        {empresa.icone ? <Aparelho tipo={empresa.icone} tamanho={64} /> : null}
        {identidade}
        <div className="linha-divisoria" />
        {numeros}
      </div>
    )
  }

  return (
    <div className="cabecalho-proposta simples">
      <div className="cabecalho-esquerda">
        {empresa.icone ? <Aparelho tipo={empresa.icone} tamanho={48} /> : null}
        <div>{identidade}</div>
      </div>
      {numeros}
    </div>
  )
}

export default function Proposta() {
  const { id: token } = useParams()
  const [dados, setDados] = useState(null)
  const [estado, setEstado] = useState('carregando')
  const [nome, setNome] = useState('')
  const [estilo, setEstilo] = useState('cursivo')
  const [erro, setErro] = useState('')

  async function buscar() {
    const { data, error } = await supabase.rpc('proposta_por_token', { p_token: token })
    if (error || !data) {
      setEstado('nao-encontrada')
      return
    }
    setDados(data)
    setEstado('pronta')
  }

  useEffect(() => {
    buscar()
  }, [token])

  if (estado === 'carregando') return <div className="proposta">Carregando...</div>
  if (estado === 'nao-encontrada') return <div className="proposta">Proposta não encontrada.</div>

  const { orcamento, empresa, cliente, itens } = dados
  const porMargem = (orcamento.modelo || 'margem') === 'margem'
  const preco = (i) =>
    porMargem
      ? Number(i.custoUnit) / (1 - (Number(orcamento.margemPct) + Number(orcamento.impostoPct)) / 100)
      : Number(i.precoUnit)
  const validade = somarDias(orcamento.enviadoEm || orcamento.criadoEm, orcamento.validadeDias)
  const somaItens = itens.reduce((s, i) => s + i.qtd * preco(i), 0)
  const premio = orcamento.seguro ? Number(orcamento.seguroPremio) || 0 : 0

  async function aprovar() {
    if (!nome.trim()) {
      setErro('Escreva seu nome para aprovar.')
      return
    }
    const { data } = await supabase.rpc('aceitar_proposta', {
      p_token: token,
      p_nome: nome.trim(),
      p_estilo: estilo,
      p_aparelho: aparelhoDeQuemAbriu(),
    })
    if (data?.ok) buscar()
    else setErro('Esta proposta não está mais disponível para aprovação.')
  }

  async function recusar() {
    const motivo = prompt('Quer dizer o motivo?') || ''
    const { data } = await supabase.rpc('recusar_proposta', { p_token: token, p_motivo: motivo })
    if (data?.ok) buscar()
    else setErro('Esta proposta não está mais disponível.')
  }

  return (
    <div className="proposta">
      <Cabecalho empresa={empresa} orcamento={orcamento} validade={validade} />

      {cliente.nome ? (
        <p className="para-quem">
          <strong>{cliente.nome}</strong>
          {cliente.documento ? <span className="fraco"> · {cliente.documento}</span> : null}
          <br />
          <span className="fraco">{cliente.endereco}</span>
        </p>
      ) : null}

      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th className="n">Qtd.</th>
            {orcamento.mostrarUnitario ? <th className="n">Valor un.</th> : null}
            <th className="n">Valor</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((i, n) => (
            <tr key={n}>
              <td>
                {i.nome}
                <div className="fraco">{i.unidade}</div>
              </td>
              <td className="n">{i.qtd}</td>
              {orcamento.mostrarUnitario ? <td className="n">{moeda(preco(i))}</td> : null}
              <td className="n">{moeda(i.qtd * preco(i))}</td>
            </tr>
          ))}
          {orcamento.seguro ? (
            <tr>
              <td>
                Seguro do equipamento
                <div className="fraco">cobertura de 1 ano</div>
              </td>
              <td className="n">1</td>
              {orcamento.mostrarUnitario ? <td className="n">{moeda(premio)}</td> : null}
              <td className="n">{moeda(premio)}</td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <div className="total-linha">
        <span>Total</span>
        <span className="numero-grande">{moeda(somaItens + premio)}</span>
      </div>

      {orcamento.condicoes ? (
        <p className="condicoes">
          <strong>Pagamento</strong>
          <br />
          {orcamento.condicoes}
        </p>
      ) : null}
      {orcamento.observacoes ? <p className="fraco">{orcamento.observacoes}</p> : null}

      {orcamento.aceite ? (
        <div className="assinatura-caixa">
          <div className={'assinado ' + orcamento.aceite.estilo}>{orcamento.aceite.nome}</div>
          <div className="fraco">
            Aprovado em {dataCurta(orcamento.aceite.em)}
            {orcamento.aceite.ip ? ' · ' + orcamento.aceite.ip : ''}
            {orcamento.aceite.aparelho ? ' · ' + orcamento.aceite.aparelho : ''}
          </div>
        </div>
      ) : orcamento.situacao === 'perdido' ? (
        <div className="assinatura-caixa">
          <strong>Orçamento recusado.</strong>
          <div className="fraco">{orcamento.motivoPerda}</div>
        </div>
      ) : (
        <div className="assinatura-caixa sem-impressao">
          <div className="campo">
            <label>Seu nome</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome de quem está aprovando" />
          </div>
          <div className="escolha-estilo">
            {ESTILOS.map((e) => (
              <button
                key={e.valor}
                className={estilo === e.valor ? 'ativo' : ''}
                onClick={() => setEstilo(e.valor)}
                type="button"
              >
                <span className={'assinado ' + e.valor} style={{ fontSize: e.valor === 'selo' ? 12 : 20 }}>
                  {nome || 'Seu nome'}
                </span>
              </button>
            ))}
          </div>
          {erro ? <p className="erro">{erro}</p> : null}
          <div className="acoes">
            <button className="botao principal" onClick={aprovar}>
              Aprovar orçamento
            </button>
            <button className="botao" onClick={recusar}>
              Recusar
            </button>
          </div>
        </div>
      )}

      {/* linha de assinatura, só no papel */}
      <div className="assinatura-papel">
        <div className="linha-assinatura" />
        <div>{empresa.nomeFantasia}</div>
      </div>

      <p className="fraco rodape-proposta">
        Aprovação registrada com data, hora e aparelho. Não substitui contrato.
      </p>

      <div className="barra-pdf sem-impressao">
        <button className="botao" onClick={() => window.print()}>
          Gerar PDF
        </button>
      </div>
    </div>
  )
}
