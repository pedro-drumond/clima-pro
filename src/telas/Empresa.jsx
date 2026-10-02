import React from 'react'
import { useDados, Texto, Numero, Area, Escolha, Campo, Linha } from '../componentes/base.jsx'
import { APARELHOS, Aparelho } from '../componentes/aparelhos.jsx'
import { parametros } from '../dados/armazenamento.js'
import { salvarConta, salvarParametrosDaConta } from '../dados/acoes.js'
import { MODELOS_PROPOSTA } from '../componentes/proposta.jsx'

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
            {conta.logo ? (
              <div className="logo-atual">
                <img src={conta.logo} alt="" />
                <button className="botao perigo" onClick={() => mudar({ logo: '' })}>
                  Remover
                </button>
              </div>
            ) : null}
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
          </Campo>
        </div>
      </div>

      <div className="blocos-duplos">
        <div className="bloco">
          <h2>Acompanhamento dos orçamentos</h2>
          <div className="par">
            <Numero
              rotulo="1ª cobrança (dias)"
              valor={p.cobrancaDias[0]}
              aoMudar={(v) => mudarParam({ cobrancaDias: [v, p.cobrancaDias[1], p.cobrancaDias[2]] })}
            />
            <Numero
              rotulo="2ª (dias)"
              valor={p.cobrancaDias[1]}
              aoMudar={(v) => mudarParam({ cobrancaDias: [p.cobrancaDias[0], v, p.cobrancaDias[2]] })}
            />
            <Numero
              rotulo="3ª (dias)"
              valor={p.cobrancaDias[2]}
              aoMudar={(v) => mudarParam({ cobrancaDias: [p.cobrancaDias[0], p.cobrancaDias[1], v] })}
            />
            <Numero
              rotulo="Sugerir perda (dias)"
              valor={p.sugerirPerdaDias}
              aoMudar={(v) => mudarParam({ sugerirPerdaDias: v })}
            />
          </div>
        </div>

        <div className="bloco">
          <h2>Quando chamar para limpeza</h2>
          <div className="trio">
            <Numero
              rotulo="Residencial (meses)"
              valor={p.limpezaResidencialMeses}
              aoMudar={(v) => mudarParam({ limpezaResidencialMeses: v })}
            />
            <Numero
              rotulo="Comercial (meses)"
              valor={p.limpezaComercialMeses}
              aoMudar={(v) => mudarParam({ limpezaComercialMeses: v })}
            />
            <Numero
              rotulo="Cliente parado (meses)"
              valor={p.clienteParadoMeses}
              aoMudar={(v) => mudarParam({ clienteParadoMeses: v })}
            />
          </div>
        </div>
      </div>

      <div className="bloco estreito">
        <h2>Aparência da proposta</h2>
        <Linha>
          <Escolha
            rotulo="Modelo da proposta"
            tamanho="medio"
            valor={conta.modeloCabecalho || 'simples'}
            aoMudar={(v) => mudar({ modeloCabecalho: v })}
            opcoes={MODELOS_PROPOSTA.map((m) => ({ valor: m.valor, texto: m.titulo }))}
          />
          <Escolha
            rotulo="Desenho do aparelho"
            tamanho="medio"
            valor={conta.icone || ''}
            aoMudar={(v) => mudar({ icone: v })}
            opcoes={APARELHOS.map((a) => ({ valor: a.valor, texto: a.texto }))}
          />
          <Campo rotulo="Como fica">
            <span className="amostra-aparelho">
              <Aparelho tipo={conta.icone} tamanho={42} />
            </span>
          </Campo>
        </Linha>
        <p className="fraco">
          O cabeçalho e o desenho aparecem na proposta que o cliente abre e no PDF.
        </p>
      </div>

      <div className="bloco">
        <h2>Mensagens prontas do WhatsApp</h2>
        <div className="par">
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
        <p className="fraco">
          Entre chaves o sistema troca pelo valor: {'{pessoa}'}, {'{empresa}'}, {'{numero}'}, {'{total}'}, {'{link}'}.
        </p>
      </div>
    </>
  )
}
