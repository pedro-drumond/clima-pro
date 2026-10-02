import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../dados/supabase.js'
import { dataCurta, somarDias } from '../dados/armazenamento.js'
import { FolhaProposta } from '../componentes/proposta.jsx'

function aparelhoDeQuemAbriu() {
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
  const passouDaValidade = new Date(validade).setHours(23, 59, 59) < Date.now()

  async function aprovar() {
    if (!nome.trim()) {
      setErro('Escreva seu nome para aprovar.')
      return
    }
    const { data } = await supabase.rpc('aceitar_proposta', {
      p_token: token,
      p_nome: nome.trim(),
      p_estilo: 'cursivo',
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
    <FolhaProposta
      empresa={empresa}
      orcamento={orcamento}
      cliente={cliente}
      itens={itens}
      validade={validade}
      preco={preco}
      premio={premio}
    >
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
      ) : passouDaValidade ? (
        <div className="assinatura-caixa sem-impressao">
          <strong>Este orçamento perdeu a validade em {dataCurta(validade)}.</strong>
          <p className="fraco">
            Fale com a {empresa.nomeFantasia} pelo telefone {empresa.telefone} para receber um orçamento
            atualizado.
          </p>
        </div>
      ) : (
        <div className="assinatura-caixa sem-impressao">
          <div className="campo">
            <label>Seu nome</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome de quem está aprovando" />
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

      <div className="barra-pdf sem-impressao">
        <button className="botao" onClick={() => window.print()}>
          Gerar PDF
        </button>
      </div>
    </FolhaProposta>
  )
}
