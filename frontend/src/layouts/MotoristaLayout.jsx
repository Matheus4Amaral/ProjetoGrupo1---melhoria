import { Link, NavLink } from "react-router-dom"

import "./MotoristaLayout.css"

import { useAuth } from "../context/AuthContext"

export default function MotoristaLayout({ children }) {
    const { usuario, logout } = useAuth()

    return (
        <div className="motorista-app">
            <header className="motorista-topo">
                <Link to="/motorista" className="motorista-marca">
                    <span className="motorista-marca-ponto" />
                    <span>HubParking</span>
                </Link>

                <nav className="motorista-nav">
                    <NavLink
                        to="/motorista"
                        end
                        className={({ isActive }) => `motorista-nav-link${isActive ? " motorista-nav-link--ativo" : ""}`}
                    >
                        Estacionamentos
                    </NavLink>
                    <NavLink
                        to="/motorista/veiculos"
                        className={({ isActive }) => `motorista-nav-link${isActive ? " motorista-nav-link--ativo" : ""}`}
                    >
                        Meus veículos
                    </NavLink>
                </nav>

                <div className="motorista-usuario">
                    <div className="motorista-avatar">
                        {usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : "M"}
                    </div>
                    <div className="motorista-usuario-dados">
                        <div className="motorista-usuario-nome">{usuario?.nome || "Motorista"}</div>
                        <div className="motorista-usuario-papel">Motorista</div>
                    </div>
                    <NavLink to="/motorista/configuracoes" className="motorista-config" title="Configurações da conta">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </NavLink>
                    <button className="motorista-sair" title="Sair" onClick={logout}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                </div>
            </header>

            <main className="motorista-conteudo">
                {children}
            </main>
        </div>
    )
}