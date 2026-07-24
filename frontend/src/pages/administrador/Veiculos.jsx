import { useEffect, useState } from 'react'
import veiculoService from '../../services/veiculoService'
import '../administrador/Dashboard.css'

export default function Veiculos() {
  const [veiculos, setVeiculos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    veiculoService.listarTodosVeiculos()
      .then(dados => setVeiculos(dados))
      .catch(() => setErro('Não foi possível carregar os veículos.'))
      .finally(() => setCarregando(false))
  }, [])

  return (
    <section className="screen active">
      <div className="card card-pad">
        <div className="card-head">
          <div>
            <h3>Veículos cadastrados</h3>
            <div className="hint">Lista de todos os veículos no sistema</div>
          </div>
        </div>

        {carregando && <p>Carregando...</p>}
        {erro && <p style={{ color: '#c0392b' }}>{erro}</p>}

        {!carregando && !erro && (
          <table>
            <thead>
              <tr>
                <th>Placa</th>
                <th>Modelo</th>
                <th>Marca</th>
                <th>Cor</th>
                <th>Ano</th>
              </tr>
            </thead>
            <tbody>
              {veiculos.length === 0 && (
                <tr><td colSpan="5" className="cell-sub">Nenhum veículo cadastrado ainda.</td></tr>
              )}
              {veiculos.map(v => (
                <tr key={v.id}>
                  <td className="cell-mono">{v.placa}</td>
                  <td>{v.modelo}</td>
                  <td>{v.marca}</td>
                  <td>{v.cor}</td>
                  <td>{v.ano}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}