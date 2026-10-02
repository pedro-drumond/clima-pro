import React from 'react'
import { moeda, dataCurta } from '../dados/armazenamento.js'
import { Aparelho } from './aparelhos.jsx'

// os quatro jeitos de a proposta sair. O instalador escolhe um em Orçamentos,
// no botão Modelos, e vale para todas as propostas da empresa.
export const MODELOS_PROPOSTA = [
  {
    valor: 'centralizado',
    titulo: 'Vertical',
    resumo: 'Logo e dados da empresa centralizados no alto, tudo empilhado abaixo.',
  },
  {
    valor: 'faixa',
    titulo: 'Horizontal',
    resumo: 'Cabeçalho em faixa: empresa de um lado, logo do outro, na mesma linha.',
  },
  {
    valor: 'lateral',
    titulo: 'Dividido',
    resumo: 'Uma coluna escura à esquerda com a empresa, e a proposta à direita.',
  },
  {
    valor: 'simples',
    titulo: 'Enxuto',
    resumo: 'Sem faixa nem cor: a empresa no canto e o orçamento logo abaixo.',
  },
]

function Identidade({ empresa }) {
  return (
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
}

function Numeros({ orcamento, validade }) {
  return (
    <div className="fraco numeros-proposta">
      Orçamento nº {orcamento.numero}
      <br />
      {dataCurta(orcamento.enviadoEm || orcamento.criadoEm)}
      <br />
      Válido até {dataCurta(validade)}
    </div>
  )
}

function Cabecalho({ empresa, orcamento, validade, modelo }) {
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
          <Numeros orcamento={orcamento} validade={validade} />
        </div>
      </div>
    )
  }

  if (modelo === 'centralizado') {
    return (
      <div className="cabecalho-proposta centralizado">
        {empresa.icone ? <Aparelho tipo={empresa.icone} tamanho={64} /> : null}
        <Identidade empresa={empresa} />
        <div className="linha-divisoria" />
        <Numeros orcamento={orcamento} validade={validade} />
      </div>
    )
  }

  return (
    <div className="cabecalho-proposta simples">
      <div className="cabecalho-esquerda">
        {empresa.icone ? <Aparelho tipo={empresa.icone} tamanho={48} /> : null}
        <div>
          <Identidade empresa={empresa} />
        </div>
      </div>
      <Numeros orcamento={orcamento} validade={validade} />
    </div>
  )
}

// a folha inteira. O que vem depois do preço — aprovar, recusar, aviso de
// validade — entra como filho, porque muda entre a proposta de verdade e o
// exemplo mostrado na tela de modelos.
export function FolhaProposta({ empresa, orcamento, cliente, itens, validade, preco, premio = 0, modelo, children }) {
  const qual = modelo || empresa.modeloCabecalho || 'simples'
  const somaItens = itens.reduce((s, i) => s + i.qtd * preco(i), 0)

  const corpo = (
    <>
      {cliente?.nome ? (
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

      {children}

      {/* linha de assinatura, só no papel */}
      <div className="assinatura-papel">
        <div className="linha-assinatura" />
        <div>{empresa.nomeFantasia}</div>
      </div>
    </>
  )

  if (qual === 'lateral') {
    return (
      <div className="proposta dividida">
        <aside className="proposta-lado">
          {empresa.logo ? <img className="logo" src={empresa.logo} alt="" /> : null}
          {empresa.icone ? <Aparelho tipo={empresa.icone} tamanho={56} /> : null}
          <div className="nome-empresa">{empresa.nomeFantasia}</div>
          <div className="lado-contato">{empresa.cnpj}</div>
          <div className="lado-contato">{empresa.telefone}</div>
          <div className="lado-contato">{empresa.endereco}</div>
          <div className="lado-numeros">
            Orçamento nº {orcamento.numero}
            <br />
            {dataCurta(orcamento.enviadoEm || orcamento.criadoEm)}
            <br />
            Válido até {dataCurta(validade)}
          </div>
        </aside>
        <div className="proposta-corpo">{corpo}</div>
      </div>
    )
  }

  return (
    <div className="proposta">
      <Cabecalho empresa={empresa} orcamento={orcamento} validade={validade} modelo={qual} />
      {corpo}
    </div>
  )
}
