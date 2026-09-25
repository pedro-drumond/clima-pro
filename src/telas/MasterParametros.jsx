import React from 'react'
import { useDados, Numero, Area } from '../componentes/base.jsx'
import { salvarParametrosGerais } from '../dados/acoes.js'
import { PARAMETROS_PADRAO } from '../dados/parametros.js'

export default function MasterParametros() {
  const { b } = useDados()
  const p = b.parametrosGerais || PARAMETROS_PADRAO
  const mudar = (campos) => salvarParametrosGerais({ ...p, ...campos })
  const mudarTexto = (chave, valor) => mudar({ textos: { ...p.textos, [chave]: valor } })

  return (
    <>
      <div className="cabeca">
        <h1>Parâmetros gerais</h1>
      </div>

      <div className="aviso">
        Vale para todas as contas que não mudaram o próprio ajuste. Quem mexeu nas configurações continua com o valor
        dele.
      </div>

      <div className="bloco">
        <h2>Prazos</h2>
        <div className="par">
          <Numero
            rotulo="1ª cobrança (dias)"
            valor={p.cobrancaDias[0]}
            aoMudar={(v) => mudar({ cobrancaDias: [v, p.cobrancaDias[1], p.cobrancaDias[2]] })}
          />
          <Numero
            rotulo="2ª cobrança (dias)"
            valor={p.cobrancaDias[1]}
            aoMudar={(v) => mudar({ cobrancaDias: [p.cobrancaDias[0], v, p.cobrancaDias[2]] })}
          />
        </div>
        <div className="par">
          <Numero
            rotulo="3ª cobrança (dias)"
            valor={p.cobrancaDias[2]}
            aoMudar={(v) => mudar({ cobrancaDias: [p.cobrancaDias[0], p.cobrancaDias[1], v] })}
          />
          <Numero
            rotulo="Sugerir perda depois de (dias)"
            valor={p.sugerirPerdaDias}
            aoMudar={(v) => mudar({ sugerirPerdaDias: v })}
          />
        </div>
        <div className="par">
          <Numero
            rotulo="Limpeza residencial (meses)"
            valor={p.limpezaResidencialMeses}
            aoMudar={(v) => mudar({ limpezaResidencialMeses: v })}
          />
          <Numero
            rotulo="Limpeza comercial (meses)"
            valor={p.limpezaComercialMeses}
            aoMudar={(v) => mudar({ limpezaComercialMeses: v })}
          />
        </div>
        <Numero
          rotulo="Cliente parado depois de (meses)"
          valor={p.clienteParadoMeses}
          aoMudar={(v) => mudar({ clienteParadoMeses: v })}
        />
      </div>

      <div className="bloco">
        <h2>Mensagens padrão</h2>
        <Area rotulo="Enviar orçamento" valor={p.textos.enviarOrcamento} aoMudar={(v) => mudarTexto('enviarOrcamento', v)} />
        <Area rotulo="Cobrar orçamento" valor={p.textos.cobrarOrcamento} aoMudar={(v) => mudarTexto('cobrarOrcamento', v)} />
        <Area rotulo="Chamar para limpeza" valor={p.textos.limpeza} aoMudar={(v) => mudarTexto('limpeza', v)} />
        <Area rotulo="Cliente parado" valor={p.textos.clienteParado} aoMudar={(v) => mudarTexto('clienteParado', v)} />
      </div>
    </>
  )
}
