import { useCallback, useEffect, useMemo, useState } from 'react';
import './Dashboard.css';

import vagaService from '../../services/vagaService';
import reservaService from '../../services/reservaService';
import { useEstacionamentoAtivo } from '../../context/EstacionamentoAtivoContext';

const CORES = {
  livres: '#3EC1F4',
  ocupadas: '#17313E',
  manutencao: '#C3CDD2',
};

function formatarHorario(valor) {
  if (!valor) {
    return '—';
  }

  return new Date(valor).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Dashboard() {
  const { estacionamentoAtivoId, estacionamentoAtivo } = useEstacionamentoAtivo();

  const [vagas, setVagas] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    if (!estacionamentoAtivoId) {
      setVagas([]);
      setMovimentacoes([]);
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const [dadosVagas, dadosMovimentacoes] = await Promise.all([
        vagaService.buscarVagasPorEstacionamentoId(estacionamentoAtivoId),
        reservaService.listarMovimentacoesPorEstacionamento(estacionamentoAtivoId),
      ]);

      setVagas(dadosVagas || []);
      setMovimentacoes(dadosMovimentacoes || []);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, [estacionamentoAtivoId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const resumo = useMemo(() => {
    const total = vagas.length;
    const ocupadas = vagas.filter((v) => v.is_ocupada).length;
    const manutencao = vagas.filter((v) => v.em_manutencao && !v.is_ocupada).length;
    const livres = vagas.filter((v) => !v.is_ocupada && !v.em_manutencao).length;
    const pisos = new Set(vagas.map((v) => v.piso_id)).size;
    const ocupaveis = total - manutencao;
    const pctOcupacao = ocupaveis > 0 ? Math.round((ocupadas / ocupaveis) * 100) : 0;

    return { total, ocupadas, manutencao, livres, pisos, pctOcupacao };
  }, [vagas]);

  // Segmentos do donut (livres / ocupadas / manutenção) com dasharray proporcional.
  const segmentos = useMemo(() => {
    const { total, livres, ocupadas, manutencao } = resumo;
    if (total === 0) {
      return [];
    }

    const base = [
      { chave: 'livres', valor: livres, cor: CORES.livres },
      { chave: 'ocupadas', valor: ocupadas, cor: CORES.ocupadas },
      { chave: 'manutencao', valor: manutencao, cor: CORES.manutencao },
    ].filter((s) => s.valor > 0);

    let acumulado = 0;
    return base.map((s) => {
      const pct = (s.valor / total) * 100;
      const segmento = {
        ...s,
        dasharray: `${pct.toFixed(2)} ${(100 - pct).toFixed(2)}`,
        offset: (25 - acumulado).toFixed(2),
      };
      acumulado += pct;
      return segmento;
    });
  }, [resumo]);

  const semEstacionamento = !estacionamentoAtivoId;

  return (
    <section className="screen active" id="screen-dashboard">
      {semEstacionamento && (
        <div className="dash-vazio">
          Selecione um estacionamento ativo no topo para ver o painel.
        </div>
      )}

      {!semEstacionamento && (
        <>
          {erro && <div className="dash-vazio dash-vazio--erro">{erro}</div>}

          <div className="kpi-grid">
            <div className="card kpi-card">
              <div className="kpi-ico">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="7" height="16" rx="1.4" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="4" width="7" height="16" rx="1.4" stroke="currentColor" strokeWidth="1.8"/></svg>
              </div>
              <div className="label">Vagas livres</div>
              <div className="value">{carregando ? '—' : resumo.livres}</div>
              <div className="delta flat">de {resumo.total} vagas</div>
            </div>
            <div className="card kpi-card">
              <div className="kpi-ico">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 16V11l2-5h12l2 5v5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M2 16h20v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
              </div>
              <div className="label">Vagas ocupadas</div>
              <div className="value">{carregando ? '—' : resumo.ocupadas}</div>
              <div className="delta flat">{resumo.pctOcupacao}% de ocupação</div>
            </div>
            <div className="card kpi-card">
              <div className="kpi-ico">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6 2 2 6-6a4 4 0 0 0 5.4-5.4l-2.3 2.3-1.7-.3-.3-1.7 2.3-2.3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
              </div>
              <div className="label">Em manutenção</div>
              <div className="value">{carregando ? '—' : resumo.manutencao}</div>
              <div className="delta flat">vagas indisponíveis</div>
            </div>
            <div className="card kpi-card">
              <div className="kpi-ico">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 21V7l8-4 8 4v14M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
              </div>
              <div className="label">Total de vagas</div>
              <div className="value">{carregando ? '—' : resumo.total}</div>
              <div className="delta flat">em {resumo.pisos} {resumo.pisos === 1 ? 'piso' : 'pisos'}</div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card card-pad">
              <div className="card-head">
                <div>
                  <h3>Movimentações recentes</h3>
                  <div className="hint">Entradas e saídas de {estacionamentoAtivo?.nome || 'estacionamento'}</div>
                </div>
              </div>
              <table>
                <thead><tr><th>Placa</th><th>Vaga</th><th>Movimento</th><th>Horário</th><th>Status</th></tr></thead>
                <tbody id="dash-activity-body">
                  {!carregando && movimentacoes.map((m) => (
                    <tr key={m.id}>
                      <td className="dash-mono">{m.placa}</td>
                      <td>{m.vaga_nome} · {m.piso_nome}</td>
                      <td>{m.desocupado_em ? 'Saída' : 'Entrada'}</td>
                      <td>{formatarHorario(m.desocupado_em || m.estacionado_em)}</td>
                      <td>
                        <span className={`dash-selo ${m.desocupado_em ? 'dash-selo--encerrada' : 'dash-selo--ativa'}`}>
                          {m.desocupado_em ? 'Encerrada' : 'No pátio'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!carregando && movimentacoes.length === 0 && (
                <div className="dash-tabela-vazia">Nenhuma movimentação registrada ainda.</div>
              )}
            </div>

            <div className="card card-pad">
              <div className="card-head"><div><h3>Distribuição das vagas</h3><div className="hint">Situação atual</div></div></div>
              <div className="donut-wrap">
                <svg width="128" height="128" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#F3F3F3" strokeWidth="6"></circle>
                  {segmentos.map((s) => (
                    <circle
                      key={s.chave}
                      cx="21" cy="21" r="15.9"
                      fill="transparent"
                      stroke={s.cor}
                      strokeWidth="6"
                      strokeDasharray={s.dasharray}
                      strokeDashoffset={s.offset}
                    ></circle>
                  ))}
                  <text x="21" y="19" textAnchor="middle" fontFamily="Space Grotesk" fontSize="6" fill="#17313E" fontWeight="700">{resumo.total}</text>
                  <text x="21" y="25.5" textAnchor="middle" fontFamily="Inter" fontSize="3.4" fill="#84959c">vagas</text>
                </svg>
                <div className="donut-legend">
                  <div><span className="sw" style={{background:CORES.livres}}></span> Livres <b>{resumo.livres}</b></div>
                  <div><span className="sw" style={{background:CORES.ocupadas}}></span> Ocupadas <b>{resumo.ocupadas}</b></div>
                  <div><span className="sw" style={{background:CORES.manutencao}}></span> Manutenção <b>{resumo.manutencao}</b></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
