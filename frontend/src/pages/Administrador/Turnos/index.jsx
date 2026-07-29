import { useEffect, useState } from 'react'
import turnoService from '@/services/turnoService'
import '../Dashboard/styles.css'

export default function Turnos() {
  const [turnos, setTurnos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    turnoService.listarTodosTurnos()
      .then(dados => setTurnos(dados))
      .catch(() => setErro('Não foi possível carregar os turnos.'))
      .finally(() => setCarregando(false))
  }, [])

  return (
    <section className="screen active">
      <div className="card card-pad">
        <div className="card-head">
          <div>
            <h3>Turnos cadastrados</h3>
            <div className="hint">Lista de todos os turnos de trabalho</div>
          </div>
        </div>

        {carregando && <p>Carregando...</p>}
        {erro && <p style={{ color: '#c0392b' }}>{erro}</p>}

        {!carregando && !erro && (
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Início</th>
                <th>Término</th>
              </tr>
            </thead>
            <tbody>
              {turnos.length === 0 && (
                <tr><td colSpan="3" className="cell-sub">Nenhum turno cadastrado ainda.</td></tr>
              )}
              {turnos.map(t => (
                <tr key={t.id}>
                  <td>{t.descricao}</td>
                  <td className="cell-mono">{t.inicio_em}</td>
                  <td className="cell-mono">{t.termino_em}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}