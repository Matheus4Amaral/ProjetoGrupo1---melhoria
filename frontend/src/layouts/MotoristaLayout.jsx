import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

import "./MotoristaLayout.css";

import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";

export default function MotoristaLayout({ children }) {
  const { usuario, logout } = useAuth();
  const [modalSairAberto, setModalSairAberto] = useState(false);

  function confirmarSaida() {
    setModalSairAberto(false);
    logout();
  }

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
            className={({ isActive }) =>
              `motorista-nav-link${isActive ? " motorista-nav-link--ativo" : ""}`
            }
          >
            Estacionamentos
          </NavLink>
          <NavLink
            to="/motorista/veiculos"
            className={({ isActive }) =>
              `motorista-nav-link${isActive ? " motorista-nav-link--ativo" : ""}`
            }
          >
            Meus veículos
          </NavLink>
        </nav>

        <div className="motorista-usuario">
          <div className="motorista-avatar">
            {usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : "M"}
          </div>
          <div className="motorista-usuario-dados">
            <div className="motorista-usuario-nome">
              {usuario?.nome || "Motorista"}
            </div>
            <div className="motorista-usuario-papel">Motorista</div>
          </div>
          <button
            className="motorista-sair"
            title="Sair"
            onClick={() => setModalSairAberto(true)}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="motorista-conteudo">{children}</main>

      <ConfirmModal
        aberto={modalSairAberto}
        titulo="Sair da conta"
        mensagem="Tem certeza que deseja sair?"
        textoConfirmar="Sair"
        textoCancelar="Cancelar"
        onConfirmar={confirmarSaida}
        onCancelar={() => setModalSairAberto(false)}
      />
    </div>
  );
}
