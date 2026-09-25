import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDados, Vazio } from '../componentes/base.jsx'
import { parametros, dataCurta, linkWhatsapp } from '../dados/armazenamento.js'
import { tarefasDoDia } from '../dados/agenda.js'
import {
  registrarCobranca,
  adiarOrcamento,
  adiarPessoa,
  marcarFechado,
  marcarPerdido,
  registrarLimpeza,
  adiarLimpeza,
} from '../dados/acoes.js'

export default function ChamarHoje() {
  const { b, conta } = useDados()
  const params = parametros(conta)
  const tarefas = tarefasDoDia(b, conta, params)
  const [filtro, setFiltro] = useState('todas')

  const lista = tarefas.filter((t) => filtro === 'todas' || t.tipo === filtro)

  return (
    <>
      <div className="cabeca">
        <h1>Quem chamar hoje</h1>
      </div>

      <div className="filtros">
        {[
          ['todas', 'Todas'],
          ['cobranca', 'Orçamento sem resposta'],
          ['perda', 'Passou do prazo'],
          ['limpeza', 'Limpeza vencida'],
          ['parado', 'Cliente parado'],
        ].map(([valor, texto]) => (
          <button
            key={valor}
            className={'botao pequeno' + (filtro === valor ? ' principal' : '')}
            onClick={() => setFiltro(valor)}
          >
            {texto}
          </button>
        ))}
      </div>

      {lista.length === 0 ? (
        <div className="bloco">
          <Vazio texto="Nada vencido por aqui." />
        </div>
      ) : (
        lista.map((t) => (
          <div className="bloco" key={t.chave}>
            <div className="cabeca" style={{ marginBottom: 16 }}>
              <div>
                <Link to={'/pessoas/' + t.pessoa.id} style={{ fontWeight: 700, fontSize: 16 }}>
                  {t.pessoa.nome}
                </Link>
                <div className="fraco">
                  {t.titulo} · {t.detalhe || ''}
                </div>
              </div>
              <span className="fraco">venceu em {dataCurta(t.vencimento)}</span>
            </div>

            <div className="acoes">
              <a
                className="botao zap"
                href={linkWhatsapp(t.pessoa.whatsapp, t.mensagem)}
                target="_blank"
                rel="noreferrer"
              >
                Abrir no WhatsApp
              </a>

              {t.orcamento ? (
                <>
                  <button
                    className="botao"
                    onClick={() => registrarCobranca(t.orcamento.id, params)}
                  >
                    Já chamei
                  </button>
                  <button className="botao" onClick={() => adiarOrcamento(t.orcamento.id, 3)}>
                    Adiar 3 dias
                  </button>
                  <button className="botao" onClick={() => marcarFechado(t.orcamento.id)}>
                    Fechou
                  </button>
                  <button
                    className="botao"
                    onClick={() => {
                      const motivo = prompt('Por que perdeu?') || ''
                      marcarPerdido(t.orcamento.id, motivo)
                    }}
                  >
                    Perdeu
                  </button>
                </>
              ) : null}

              {t.equipamento ? (
                <>
                  <button className="botao" onClick={() => registrarLimpeza(t.equipamento.id)}>
                    Limpeza feita hoje
                  </button>
                  <button className="botao" onClick={() => adiarLimpeza(t.equipamento.id, 1)}>
                    Adiar 1 mês
                  </button>
                </>
              ) : null}

              {t.tipo === 'parado' ? (
                <button className="botao" onClick={() => adiarPessoa(t.pessoa.id, 30)}>
                  Já chamei
                </button>
              ) : null}
            </div>
          </div>
        ))
      )}

      <p className="fraco">
        Os prazos usados aqui estão em Configurações e valem para toda a conta.
      </p>
    </>
  )
}
