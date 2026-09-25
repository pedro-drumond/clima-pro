import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../dados/supabase.js'
import { moeda, dataCurta, somarDias } from '../dados/armazenamento.js'

const ESTILOS = [
  { valor: 'cursivo', texto: 'Cursiva' },
  { valor: 'rubrica', texto: 'Rubrica' },
  { valor: 'selo', texto: 'Selo' },
]

function aparelho() {
  const ua = navigator.userAgent || ''
  if (/iPhone|iPad/.test(ua)) return 'Celular iPhone'
  if (/Android/.test(ua)) return 'Celular Android'
  if (/Mac/.test(ua)) return 'Computador Mac'
  if (/Windows/.test(ua)) return 'Computador Windows'
  return 'Navegador'
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

  async function aprovar() {
    if (!nome.trim()) {
      setErro('Escreva seu nome para aprovar.')
      return
    }
    const { data } = await supabase.rpc('aceitar_proposta', {
      p_token: token,
      p_nome: nome.trim(),
      p_estilo: estilo,
      p_aparelho: aparelho(),
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
      <div className="proposta-topo">
        <div>
          {empresa.logo ? <img src={empresa.logo} alt="" style={{ maxHeight: 44, marginBottom: 6 }} /> : null}
          <div style={{ fontWeight: 700, fontSize: 16 }}>{empresa.nomeFantasia}</div>
          <div className="fraco">
            {empresa.cnpj ? empresa.cnpj + ' · ' : ''}
            {empresa.telefone}
          </div>
          <div className="fraco">{empresa.endereco}</div>
        </div>
        <div className="fraco" style={{ textAlign: 'right' }}>
          Orçamento nº {orcamento.numero}
          <br />
          {dataCurta(orcamento.enviadoEm || orcamento.criadoEm)}
          <br />
          Válido até {dataCurta(validade)}
        </div>
      </div>

      {cliente.nome ? (
        <p style={{ marginTop: 0 }}>
          <strong>{cliente.nome}</strong>
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
        </tbody>
      </table>

      <div className="total-linha">
        <span>Total</span>
        <span className="numero-grande">{moeda(orcamento.total)}</span>
      </div>

      {orcamento.condicoes ? (
        <p style={{ marginTop: 22 }}>
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
        <div className="assinatura-caixa">
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

      <p className="fraco" style={{ marginTop: 20 }}>
        Aprovação registrada com data, hora e aparelho. Não substitui contrato.
      </p>
    </div>
  )
}
