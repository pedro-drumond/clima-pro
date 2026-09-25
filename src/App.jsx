import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Moldura, useDados } from './componentes/base.jsx'
import Entrar from './telas/Entrar.jsx'
import NovaSenha from './telas/NovaSenha.jsx'
import Inicio from './telas/Inicio.jsx'
import ChamarHoje from './telas/ChamarHoje.jsx'
import Orcamentos from './telas/Orcamentos.jsx'
import NovoOrcamento from './telas/NovoOrcamento.jsx'
import Orcamento from './telas/Orcamento.jsx'
import Pessoas from './telas/Pessoas.jsx'
import Pessoa from './telas/Pessoa.jsx'
import Biblioteca from './telas/Biblioteca.jsx'
import Numeros from './telas/Numeros.jsx'
import Empresa from './telas/Empresa.jsx'
import Master from './telas/Master.jsx'
import MasterParametros from './telas/MasterParametros.jsx'
import Proposta from './telas/Proposta.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/entrar" element={<Entrar />} />
      <Route path="/nova-senha" element={<NovaSenha />} />
      <Route path="/proposta/:id" element={<Proposta />} />
      <Route path="/*" element={<Interno />} />
    </Routes>
  )
}

function Interno() {
  const { usuario, carregando } = useDados()
  const local = useLocation()

  if (carregando) return <div className="entrar"><div className="entrar-marca">Clima Pro</div></div>
  if (!usuario) return <Navigate to="/entrar" replace state={{ de: local.pathname }} />
  const master = usuario.papel === 'master'

  return (
    <Moldura>
      <Routes>
        {master ? (
          <>
            <Route path="/master" element={<Master />} />
            <Route path="/master/parametros" element={<MasterParametros />} />
            <Route path="*" element={<Navigate to="/master" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Inicio />} />
            <Route path="/chamar" element={<ChamarHoje />} />
            <Route path="/orcamentos" element={<Orcamentos />} />
            <Route path="/orcamentos/novo" element={<NovoOrcamento />} />
            <Route path="/orcamentos/:id" element={<Orcamento />} />
            <Route path="/pessoas" element={<Pessoas />} />
            <Route path="/pessoas/:id" element={<Pessoa />} />
            <Route path="/biblioteca" element={<Biblioteca />} />
            <Route path="/numeros" element={<Numeros />} />
            <Route path="/empresa" element={<Empresa />} />
            <Route path="/configuracoes" element={<Navigate to="/empresa" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Moldura>
  )
}
