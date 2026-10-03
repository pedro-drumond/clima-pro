import React from 'react'
import { useDados, Texto, Numero, Area, Escolha, Campo } from '../componentes/base.jsx'
import { parametros } from '../dados/armazenamento.js'
import { salvarConta, salvarParametrosDaConta } from '../dados/acoes.js'

export default function Empresa() {
  const { conta } = useDados()
  const p = parametros(conta)

  const mudar = (campos) => salvarConta({ ...conta, ...campos })
  const mudarParam = (campos) => salvarParametrosDaConta(conta.id, { ...p, ...campos })
  const mudarTexto = (chave, valor) => mudarParam({ textos: { ...p.textos, [chave]: valor } })


  return (
    <>
      <div className="cabeca">
        <h1>Minha empresa</h1>
      </div>

      <div className="bloco">
        <h2>Dados que saem no orçamento</h2>
        <div className="trio">
          <Texto rotulo="Nome fantasia" valor={conta.nomeFantasia} aoMudar={(v) => mudar({ nomeFantasia: v })} />
          <Texto rotulo="Razão social" valor={conta.razaoSocial} aoMudar={(v) => mudar({ razaoSocial: v })} />
          <Escolha
            rotulo="Tipo"
            valor={conta.tipoPessoa}
            aoMudar={(v) => mudar({ tipoPessoa: v })}
            opcoes={[
              { valor: 'pj', texto: 'Pessoa jurídica' },
              { valor: 'pf', texto: 'Pessoa física' },
            ]}
          />
        </div>

        <div className="trio">
          <Texto
            rotulo={conta.tipoPessoa === 'pj' ? 'CNPJ' : 'CPF'}
            valor={conta.cnpj}
            aoMudar={(v) => mudar({ cnpj: v })}
          />
          <Texto rotulo="Telefone" valor={conta.telefone} aoMudar={(v) => mudar({ telefone: v })} />
          <Texto rotulo="E-mail" valor={conta.email} aoMudar={(v) => mudar({ email: v })} />
        </div>

        <div className="par">
          <Texto rotulo="Endereço" valor={conta.endereco} aoMudar={(v) => mudar({ endereco: v })} />
          <Campo rotulo="Logo">
            <div className="campo-logo">
              {conta.logo ? <img src={conta.logo} alt="" /> : null}
              <label className="botao arquivo">
                {conta.logo ? 'Trocar' : 'Escolher arquivo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files && e.target.files[0]
                    if (!f) return
                    const leitor = new FileReader()
                    leitor.onload = () => mudar({ logo: String(leitor.result) })
                    leitor.readAsDataURL(f)
                  }}
                />
              </label>
              {conta.logo ? (
                <button className="botao perigo" onClick={() => mudar({ logo: '' })}>
                  Remover
                </button>
              ) : null}
            </div>
          </Campo>
        </div>
      </div>

      <div className="blocos-duplos">
        <div className="bloco centrado">
          <h2>Quando chamar para limpeza</h2>
          <p className="unidade-do-bloco">em meses</p>
          <div className="grade-numeros de-tres">
            <Numero
              rotulo="Residencial"
              valor={p.limpezaResidencialMeses}
              aoMudar={(v) => mudarParam({ limpezaResidencialMeses: v })}
            />
            <Numero
              rotulo="Comercial"
              valor={p.limpezaComercialMeses}
              aoMudar={(v) => mudarParam({ limpezaComercialMeses: v })}
            />
            <Numero
              rotulo="Cliente parado"
              valor={p.clienteParadoMeses}
              aoMudar={(v) => mudarParam({ clienteParadoMeses: v })}
            />
          </div>
        </div>
      </div>

      <div className="bloco">
        <h2>
          <span className="com-dica">
            Mensagens prontas do WhatsApp
            <span className="dica">
              O que está entre chaves o sistema troca pelo valor de verdade na hora de enviar: {'{pessoa}'},{' '}
              {'{empresa}'}, {'{numero}'}, {'{total}'} e {'{link}'}.
            </span>
          </span>
        </h2>
        <div className="par mensagens">
          <Area
            rotulo="Enviar orçamento"
            linhas={3}
            valor={p.textos.enviarOrcamento}
            aoMudar={(v) => mudarTexto('enviarOrcamento', v)}
          />
          <Area
            rotulo="Cobrar orçamento"
            linhas={3}
            valor={p.textos.cobrarOrcamento}
            aoMudar={(v) => mudarTexto('cobrarOrcamento', v)}
          />
          <Area
            rotulo="Chamar para limpeza"
            linhas={3}
            valor={p.textos.limpeza}
            aoMudar={(v) => mudarTexto('limpeza', v)}
          />
          <Area
            rotulo="Cliente parado"
            linhas={3}
            valor={p.textos.clienteParado}
            aoMudar={(v) => mudarTexto('clienteParado', v)}
          />
        </div>
      </div>
    </>
  )
}
