import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDados, Texto, Area, Escolha, Marcador, Vazio , Linha } from '../componentes/base.jsx'
import { moeda, dataCurta, totalDoOrcamento, parametros } from '../dados/armazenamento.js'
import { proximaLimpeza } from '../dados/agenda.js'
import {
  salvarPessoa,
  apagarPessoa,
  salvarEquipamento,
  apagarEquipamento,
  registrarLimpeza,
} from '../dados/acoes.js'

export default function Pessoa() {
  const { id } = useParams()
  const { b, conta } = useDados()
  const navegar = useNavigate()
  const pessoa = b.pessoas.find((p) => p.id === id)

  if (!pessoa) return <p>Pessoa não encontrada.</p>

  const params = parametros(conta)
  const equipamentos = b.equipamentos.filter((e) => e.pessoaId === pessoa.id)
  const orcamentos = b.orcamentos.filter((o) => o.pessoaId === pessoa.id)
  const mudar = (campos) => salvarPessoa({ ...pessoa, ...campos }, conta.id)

  return (
    <>
      <div className="cabeca">
        <div>
          <Link to="/pessoas" className="botao texto voltar">
            Voltar
          </Link>
          <h1>{pessoa.nome}</h1>
        </div>
        <button className="botao principal" onClick={() => navegar('/orcamentos/novo?cliente=' + pessoa.id)}>
          Novo orçamento
        </button>
      </div>

      <div className="bloco">
        <h2>Cadastro</h2>
        <Texto rotulo="Nome" valor={pessoa.nome} aoMudar={(v) => mudar({ nome: v })} />
        <Linha>
          <Escolha
            rotulo="Tipo"
            tamanho="medio"
            valor={pessoa.tipo}
            aoMudar={(v) => mudar({ tipo: v })}
            opcoes={[
              { valor: 'pf', texto: 'Pessoa física' },
              { valor: 'pj', texto: 'Pessoa jurídica' },
            ]}
          />
          <Texto
            rotulo={pessoa.tipo === 'pj' ? 'CNPJ' : 'CPF'}
            tamanho="medio"
            valor={pessoa.documento}
            aoMudar={(v) => mudar({ documento: v })}
          />
          <Texto rotulo="WhatsApp" tamanho="medio" valor={pessoa.whatsapp} aoMudar={(v) => mudar({ whatsapp: v })} />
        </Linha>
        <div className="par">
          <Texto rotulo="E-mail" valor={pessoa.email} aoMudar={(v) => mudar({ email: v })} />
          <Texto rotulo="Endereço" valor={pessoa.endereco} aoMudar={(v) => mudar({ endereco: v })} />
        </div>
        <Area rotulo="Observações" valor={pessoa.observacoes} aoMudar={(v) => mudar({ observacoes: v })} />
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
          <input type="checkbox" checked={!!pessoa.ehCliente} onChange={(e) => mudar({ ehCliente: e.target.checked })} />
          Já é cliente
        </label>
      </div>

      <div className="bloco">
        <div className="cabeca" style={{ marginBottom: 6 }}>
          <h2 style={{ margin: 0 }}>Equipamentos</h2>
          <button
            className="botao pequeno"
            onClick={() =>
              salvarEquipamento({
                pessoaId: pessoa.id,
                ambiente: 'Novo ambiente',
                btu: 12000,
                marca: '',
                uso: pessoa.tipo === 'pj' ? 'comercial' : 'residencial',
                instaladoEm: new Date().toISOString(),
                ultimaLimpeza: new Date().toISOString(),
              })
            }
          >
            Adicionar
          </button>
        </div>
        {equipamentos.length === 0 ? (
          <Vazio texto="Nenhum equipamento cadastrado." />
        ) : (
          equipamentos.map((e) => (
            <div key={e.id} style={{ borderTop: '1px solid #e2e6ea', paddingTop: 12, marginTop: 12 }}>
              <div className="par">
                <Texto rotulo="Ambiente" valor={e.ambiente} aoMudar={(v) => salvarEquipamento({ ...e, ambiente: v })} />
                <Texto rotulo="Marca" valor={e.marca} aoMudar={(v) => salvarEquipamento({ ...e, marca: v })} />
              </div>
              <Linha>
                <Texto
                  rotulo="BTU"
                  tamanho="curto"
                  valor={e.btu}
                  aoMudar={(v) => salvarEquipamento({ ...e, btu: Number(v) || 0 })}
                />
                <Escolha
                  rotulo="Uso"
                  tamanho="medio"
                  valor={e.uso}
                  aoMudar={(v) => salvarEquipamento({ ...e, uso: v })}
                  opcoes={[
                    { valor: 'residencial', texto: 'Residencial' },
                    { valor: 'comercial', texto: 'Comercial' },
                  ]}
                />
              </Linha>
              <p className="fraco">
                Última limpeza em {dataCurta(e.ultimaLimpeza || e.instaladoEm)} · próxima em{' '}
                {dataCurta(proximaLimpeza(e, params))}
              </p>
              <div className="acoes">
                <button className="botao pequeno" onClick={() => registrarLimpeza(e.id)}>
                  Limpeza feita hoje
                </button>
                <button className="botao perigo" onClick={() => apagarEquipamento(e.id)}>
                  Remover
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bloco">
        <h2>Orçamentos</h2>
        {orcamentos.length === 0 ? (
          <Vazio texto="Nenhum orçamento para esta pessoa." />
        ) : (
          orcamentos.map((o) => (
            <div className="linha-item" key={o.id}>
              <div>
                <Link to={'/orcamentos/' + o.id}>nº {o.numero}</Link>
                <div className="fraco">{dataCurta(o.enviadoEm || o.criadoEm)}</div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span className="valor">{moeda(totalDoOrcamento(o))}</span>
                <Marcador situacao={o.situacao} />
              </div>
            </div>
          ))
        )}
      </div>

      <button
        className="botao perigo"
        onClick={() => {
          if (confirm('Apagar esta pessoa e o que está ligado a ela?')) {
            apagarPessoa(pessoa.id)
            navegar('/pessoas')
          }
        }}
      >
        Apagar pessoa
      </button>
    </>
  )
}
