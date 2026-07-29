import { NavLink, useLocation } from 'react-router-dom';
import './styles.css';
import { useAuth } from '@/context/AuthContext';
import { EstacionamentoAtivoProvider, useEstacionamentoAtivo } from '@/context/EstacionamentoAtivoContext';

function SeletorEstacionamento() {
  const { estacionamentos, estacionamentoAtivoId, selecionar, carregando } = useEstacionamentoAtivo();

  if (carregando) {
    return <div className="estac-seletor estac-seletor--vazio">Carregando estacionamentos...</div>;
  }

  if (estacionamentos.length === 0) {
    return <div className="estac-seletor estac-seletor--vazio">Nenhum estacionamento — cadastre um</div>;
  }

  return (
    <label className="estac-seletor">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 21V7l8-4 8 4v14M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
      <select
        value={estacionamentoAtivoId || ''}
        onChange={(e) => selecionar(e.target.value)}
        aria-label="Estacionamento ativo"
      >
        {estacionamentos.map((estacionamento) => (
          <option key={estacionamento.id} value={estacionamento.id}>
            {estacionamento.nome}
          </option>
        ))}
      </select>
    </label>
  );
}

const TITULOS = {
  '/admin/dashboard': { eyebrow: 'Visão geral', titulo: 'Dashboard' },
  '/admin/estacionamento': { eyebrow: 'Cadastros', titulo: 'Estacionamento' },
  '/admin/pisos': { eyebrow: 'Cadastros', titulo: 'Pisos' }, '/admin/turnos': { eyebrow: 'Operação', titulo: 'Turnos' },
  '/admin/pisos': { eyebrow: 'Cadastros', titulo: 'Pisos' },
  '/admin/vagas': { eyebrow: 'Operação', titulo: 'Vagas' },
};

const TITULO_PADRAO = { eyebrow: 'Visão geral', titulo: 'Dashboard' };

function obterTitulo(pathname) {
  if (/^\/admin\/vagas\/.+\/editar$/.test(pathname)) {
    return { eyebrow: 'Operação', titulo: 'Editar vaga' };
  }

  if (/^\/admin\/pisos\/.+\/editar$/.test(pathname)) {
    return { eyebrow: 'Cadastros', titulo: 'Editar piso' };
  }

  if (/^\/admin\/estacionamento\/.+\/editar$/.test(pathname)) {
    return { eyebrow: 'Cadastros', titulo: 'Editar estacionamento' };
  }

  return TITULOS[pathname] || TITULO_PADRAO;
}

export default function AdminLayout({ children }) {
  const { usuario, logout } = useAuth();
  const { pathname } = useLocation();

  const { eyebrow, titulo } = obterTitulo(pathname);

  return (
    <EstacionamentoAtivoProvider>
    <div className="app">
      <aside className="sidebar">
        <div className="brand-mark"><span className="dot"></span> <span>HubParking</span></div>

        <div className="nav-group-label">Visão geral</div>
        <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 13h8V3H3v10Zm10 8h8V11h-8v10ZM3 21h8v-6H3v6ZM13 3v6h8V3h-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
          <span>Dashboard</span>
        </NavLink>

        <div className="nav-group-label">Cadastros</div>
        <NavLink
          to="/admin/estacionamento"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 21V7l8-4 8 4v14M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
          <span>Estacionamento</span>
        </NavLink>

        <button className="nav-item" data-screen="pessoas">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" /><path d="M3.5 20c.6-3.4 3-5.4 5.5-5.4s4.9 2 5.5 5.4M15.5 8.3a3 3 0 1 1 3.6 2.95M20.5 20c-.4-2.3-1.6-4-3.4-4.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          <span>Pessoas</span>
        </button>

        <NavLink
          to="/admin/pisos"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 8h18M3 14h18M6 4h12v16H6V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
          <span>Pisos</span>
        </NavLink>

        <div className="nav-group-label">Operação</div>
        <NavLink
          to="/admin/turnos"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          <span>Turnos</span>
        </NavLink>

          <NavLink
            to="/admin/vagas"
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="7" height="16" rx="1.4" stroke="currentColor" strokeWidth="1.8" /><rect x="14" y="4" width="7" height="16" rx="1.4" stroke="currentColor" strokeWidth="1.8" /></svg>
            <span>Vagas</span>
        </NavLink>
        <NavLink to="/admin/veiculos" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 16V11l2-5h12l2 5v5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M2 16h20v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="7" cy="16" r="1.4" fill="currentColor" /><circle cx="17" cy="16" r="1.4" fill="currentColor" /></svg>
          <span>Veículos</span>          
        </NavLink>


        <div className="sidebar-foot">
          <div className="avatar">{usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : 'U'}</div>
          <div>
            <div className="who">{usuario?.nome || 'Usuário'}</div>
            <div className="role">{usuario?.is_admin ? 'Administrador' : 'Operador'}</div>
          </div>
          <button className="logout-btn" title="Sair" onClick={logout}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div className="title-block">
            <div className="eyebrow" id="topbar-eyebrow">{eyebrow}</div>
            <h1 id="topbar-title">{titulo}</h1>
          </div>
          <div className="topbar-actions">
            <SeletorEstacionamento />
            <div className="search-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              <input placeholder="Buscar placa, vaga, pessoa..." />
            </div>
            <button className="icon-btn" title="Notificações">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              <span className="badge-dot"></span>
            </button>
          </div>
        </div>

        <div className="content">
          {children}
        </div>
      </div>
    </div>
    </EstacionamentoAtivoProvider>
  );
}
