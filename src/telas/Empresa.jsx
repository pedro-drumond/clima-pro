import React from 'react'
import { useDados, Texto, Numero, Area, Escolha, Campo, Linha } from '../componentes/base.jsx'
import { APARELHOS, Aparelho } from '../componentes/aparelhos.jsx'
import { parametros, moeda } from '../dados/armazenamento.js'
import { salvarConta, salvarParametrosDaConta } from '../dados/acoes.js'

export default function Empresa() {
  const { conta } = useDados()
  const p = parametros(conta)

  const mudar = (campos) => salvarConta({ ...conta, ...campos })
  const mudarParam = (campos) => salvarParametrosDaConta(conta.id, { ...p, ...campos })
  const mudarTexto = (chave, valor) => mudarParam({ textos: { ...p.textos, [chave]: valor } })

  const exemplo = 1000 / (1 - (Number(conta.margemPct) + Number(conta.impostoPct)) / 100)

  return (
    <>
      <div className="cabeca">
        <h1>Minha empresa</h1>
      </div>

      <div className="bloco">
        <h2>Dados que saem no orçamento</h2>
        <div className="par">
          <Texto rotulo="Nome que aparece" valor={conta.nomeFantasia} aoMudar={(v) => mudar({ nomeFantasia: v })} />
          <Texto rotulo="Razão social" valor={conta.razaoSocial} aoMudar={(v) => mudar({ razaoSocial: v })} />
        </div>
        <Linha>
          <Escolha
            rotulo="Tipo"
            tamanho="medio"
            valor={conta.tipoPessoa}
            aoMudar={(v) => mudar({ tipoPessoa: v })}
            opcoes={[
              { valor: 'pj', texto: 'Pessoa jurídica' },
              { valor: 'pf', texto: 'Pessoa física' },
            ]}
          />
          <Texto
            rotulo={conta.tipoPessoa === 'pj' ? 'CNPJ' : 'CPF'}
            tamanho="medio"
            valor={conta.cnpj}
            aoMudar={(v) => mudar({ cnpj: v })}
          />
          <Texto rotulo="Telefone" tamanho="medio" valor={conta.telefone} aoMudar={(v) => mudar({ telefone: v })} />
        </Linha>
        <div className="par">
          <Texto rotulo="E-mail" valor={conta.email} aoMudar={(v) => mudar({ email: v })} />
          <Texto rotulo="Endereço" valor={conta.endereco} aoMudar={(v) => mudar({ endereco: v })} />
        </div>

        <Campo rotulo="Logo">
          {conta.logo ? (
            <div style={{ marginBottom: 8 }}>
              <img src={conta.logo} alt="" style={{ maxHeight: 60 }} />
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

      <div className="blocos-triplos">
        <div className="bloco">
          <h2>Formação de preço</h2>
          <Linha>
            <Numero rotulo="Imposto (%)" valor={conta.impostoPct} aoMudar={(v) => mudar({ impostoPct: v })} />
            <Numero rotulo="Margem líquida (%)" valor={conta.margemPct} aoMudar={(v) => mudar({ margemPct: v })} />
          </Linha>
          <p className="fraco">Custo de R$ 1.000 sai por {moeda(exemplo)}.</p>
        </div>

        <div className="bloco">
          <h2>Acompanhamento dos orçamentos</h2>
          <Linha>
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
          </Linha>
        </div>

        <div className="bloco">
          <h2>Quando chamar para limpeza</h2>
          <Linha>
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
          </Linha>
        </div>
      </div>

      <div className="bloco">
        <h2>Padrão do orçamento</h2>
        <Numero rotulo="Validade (dias)" valor={conta.validadeDias} aoMudar={(v) => mudar({ validadeDias: v })} />
        <div className="par">
          <Area
            rotulo="Condições de pagamento"
            linhas={3}
            valor={conta.condicoesPadrao}
            aoMudar={(v) => mudar({ condicoesPadrao: v })}
          />
          <Area
            rotulo="Observações"
            linhas={3}
            valor={conta.observacoesPadrao}
            aoMudar={(v) => mudar({ observacoesPadrao: v })}
          />
        </div>
      </div>

      <div className="bloco">
        <h2>Aparência da proposta</h2>
        <Linha>
          <Escolha
            rotulo="Modelo de cabeçalho"
            tamanho="medio"
            valor={conta.modeloCabecalho || 'simples'}
            aoMudar={(v) => mudar({ modeloCabecalho: v })}
            opcoes={[
              { valor: 'simples', texto: 'Simples' },
              { valor: 'faixa', texto: 'Faixa colorida' },
              { valor: 'centralizado', texto: 'Centralizado' },
            ]}
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
              <Aparelho tipo={conta.icone} tamanho={56} />
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
