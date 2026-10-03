import React from 'react'
import { useDados, Texto, Numero, Escolha, Campo } from '../componentes/base.jsx'
import { parametros } from '../dados/armazenamento.js'
import { salvarConta, salvarParametrosDaConta } from '../dados/acoes.js'

export default function Empresa() {
  const { conta } = useDados()
  const p = parametros(conta)

  const mudar = (campos) => salvarConta({ ...conta, ...campos })
  const mudarParam = (campos) => salvarParametrosDaConta(conta.id, { ...p, ...campos })


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

      <div className="bloco">
        <h2>Lembrete de limpeza</h2>
        <div className="trio">
          <Numero
            rotulo="Meses depois da entrega"
            valor={p.limpezaMeses}
            aoMudar={(v) => mudarParam({ limpezaMeses: v })}
          />
        </div>
      </div>
    </>
  )
}
