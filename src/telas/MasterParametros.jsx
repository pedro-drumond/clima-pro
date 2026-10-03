import React from 'react'
import { useDados, Numero } from '../componentes/base.jsx'
import { salvarParametrosGerais } from '../dados/acoes.js'
import { PARAMETROS_PADRAO } from '../dados/parametros.js'

export default function MasterParametros() {
  const { b } = useDados()
  const p = b.parametrosGerais || PARAMETROS_PADRAO
  const mudar = (campos) => salvarParametrosGerais({ ...p, ...campos })

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
        <h2>Lembrete de limpeza</h2>
        <div className="trio">
          <Numero
            rotulo="Meses depois da entrega"
            valor={p.limpezaMeses}
            aoMudar={(v) => mudar({ limpezaMeses: v })}
          />
        </div>
      </div>
    </>
  )
}
