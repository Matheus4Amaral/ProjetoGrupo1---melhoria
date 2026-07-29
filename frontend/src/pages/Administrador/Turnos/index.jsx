import { useCallback, useEffect, useState } from 'react'

import './styles.css'

import Button from '@/components/Button'
import Input from '@/components/Input'
import ConfirmacaoModal from '@/components/ConfirmacaoModal'
import useMensagemTemporaria from '@/hooks/useMensagemTemporaria'

import turnoService from '@/services/turnoService'

const FORMULARIO_INICIAL = {
  descricao: '',
  inicio_em: '',
  termino_em: '',
}


function horaParaInput(valor) {
  if (!valor || typeof valor !== 'string') return ''
  const partes = valor.split(':')
  if (partes.length < 2) return ''
  return `${partes[0].padStart(2, '0')}:${partes[1].padStart(2, '0')}`
}

function horaParaApi(valor) {
  if (!valor) return ''
  const partes = valor.split(':')
  if (partes.length === 2) return `${partes[0]}:${partes[1]}:00`
  if (partes.length >= 3) return `${partes[0]}:${partes[1]}:${partes[2].slice(0, 2)}`
  return valor
}

function formatarHora(valor) {
  const h = horaParaInput(valor)
  return h || '—'
}

export default function Turnos() {
  const [modo, setModo] = useState('lista') 
  const [turnoEditandoId, setTurnoEditandoId] = useState(null)

  const [turnos, setTurnos] = useState([])
  const [carregandoLista, setCarregandoLista] = useState(true)
  const [erroLista, setErroLista] = useState('')

  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useMensagemTemporaria()
  const [salvando, setSalvando] = useState(false)

  const [turnoParaExcluir, setTurnoParaExcluir] = useState(null)
  const [excluindo, setExcluindo] = useState(false)

  const carregarTurnos = useCallback(async () => {
    setCarregandoLista(true)
    setErroLista('')

    try {
      const resultado = await turnoService.listarTodosTurnos()
      setTurnos(resultado || [])
    } catch (error) {
      setErroLista(error.message || 'Não foi possível carregar os turnos.')
    } finally {
      setCarregandoLista(false)
    }
  }, [])

  useEffect(() => {
    carregarTurnos()
  }, [carregarTurnos])

  function handleChange(campo) {
    return (e) => setFormulario((atual) => ({ ...atual, [campo]: e.target.value }))
  }

  function handleLimpar() {
    setFormulario(FORMULARIO_INICIAL)
    setErro('')
  }

  function handleNovoTurno() {
    setFormulario(FORMULARIO_INICIAL)
    setErro('')
    setSucesso('')
    setTurnoEditandoId(null)
    setModo('cadastro')
  }

  function handleEditarTurno(turno) {
    setFormulario({
      descricao: turno.descricao || '',
      inicio_em: horaParaInput(turno.inicio_em),
      termino_em: horaParaInput(turno.termino_em),
    })
    setErro('')
    setSucesso('')
    setTurnoEditandoId(turno.id)
    setModo('edicao')
  }

  function handleVoltarParaLista() {
    setModo('lista')
    setTurnoEditandoId(null)
    setFormulario(FORMULARIO_INICIAL)
    setErro('')
    carregarTurnos()
  }

  function validarFormulario() {
    const descricao = formulario.descricao.trim()
    if (!descricao) {
      setErro('Informe a descrição do turno.')
      return null
    }
    if (!formulario.inicio_em) {
      setErro('Informe o horário de início.')
      return null
    }
    if (!formulario.termino_em) {
      setErro('Informe o horário de término.')
      return null
    }

    return {
      descricao,
      inicio_em: horaParaApi(formulario.inicio_em),
      termino_em: horaParaApi(formulario.termino_em),
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    const dados = validarFormulario()
    if (!dados) return

    setSalvando(true)

    try {
      if (modo === 'edicao' && turnoEditandoId) {
        const turno = await turnoService.editarTurno(turnoEditandoId, dados)
        setSucesso(`Turno atualizado: ${turno.descricao}.`)
        setModo('lista')
        setTurnoEditandoId(null)
        setFormulario(FORMULARIO_INICIAL)
        await carregarTurnos()
      } else {
        const turno = await turnoService.cadastrarTurno(dados)
        setSucesso(`Turno cadastrado: ${turno.descricao}.`)
        setFormulario(FORMULARIO_INICIAL)
        setModo('lista')
        await carregarTurnos()
      }
    } catch (error) {
      setErro(error.message || 'Não foi possível salvar o turno.')
    } finally {
      setSalvando(false)
    }
  }

  function handlePedirExclusao(turno) {
    setTurnoParaExcluir(turno)
  }

  async function handleConfirmarExclusao() {
    if (!turnoParaExcluir) return

    setExcluindo(true)
    setErroLista('')

    try {
      await turnoService.excluirTurno(turnoParaExcluir.id)
      setSucesso(`Turno "${turnoParaExcluir.descricao}" excluído.`)
      setTurnoParaExcluir(null)
      await carregarTurnos()
    } catch (error) {
      setErroLista(error.message || 'Não foi possível excluir o turno.')
      setTurnoParaExcluir(null)
    } finally {
      setExcluindo(false)
    }
  }

  if (modo === 'cadastro' || modo === 'edicao') {
    const titulo = modo === 'edicao' ? 'Editar turno' : 'Cadastrar turno'
    const hint =
      modo === 'edicao'
        ? 'Altere a descrição e os horários do turno de trabalho.'
        : 'Informe a descrição e os horários de início e término do turno.'
    const textoBotao = salvando
      ? modo === 'edicao'
        ? 'Salvando...'
        : 'Cadastrando...'
      : modo === 'edicao'
        ? 'Salvar alterações'
        : 'Cadastrar turno'

    return (
      <section className="screen active" id="screen-turnos">
        <div className="turno-card">
          <div className="turno-card-head">
            <div>
              <h3>{titulo}</h3>
              <div className="hint">{hint}</div>
            </div>
            <button
              type="button"
              className="turno-botao-secundario"
              onClick={handleVoltarParaLista}
              disabled={salvando}
            >
              Voltar à lista
            </button>
          </div>

          <form className="turno-form" onSubmit={handleSubmit}>
            <div className="turno-campo">
              <label htmlFor="descricao">Descrição</label>
              <Input
                id="descricao"
                type="text"
                placeholder="Ex.: Manhã, Tarde, Noite"
                value={formulario.descricao}
                onChange={handleChange('descricao')}
                required
                maxLength={100}
              />
            </div>

            <div className="turno-linha">
              <div className="turno-campo">
                <label htmlFor="inicio_em">Início</label>
                <Input
                  id="inicio_em"
                  type="time"
                  value={formulario.inicio_em}
                  onChange={handleChange('inicio_em')}
                  required
                />
              </div>

              <div className="turno-campo">
                <label htmlFor="termino_em">Término</label>
                <Input
                  id="termino_em"
                  type="time"
                  value={formulario.termino_em}
                  onChange={handleChange('termino_em')}
                  required
                />
              </div>
            </div>

            {erro && <div className="turno-aviso turno-aviso--erro">{erro}</div>}
            {sucesso && <div className="turno-aviso turno-aviso--sucesso">{sucesso}</div>}

            <div className="turno-acoes">
              <button
                type="button"
                className="turno-botao-secundario"
                onClick={handleLimpar}
                disabled={salvando}
              >
                Limpar
              </button>
              <Button type="submit" disabled={salvando}>
                {textoBotao}
              </Button>
            </div>
          </form>
        </div>
      </section>
    )
  }

  return (
    <section className="screen active" id="screen-turnos">
      <div className="turno-card turno-card--lista">
        <div className="turno-card-head">
          <div>
            <h3>Turnos cadastrados</h3>
            <div className="hint">Lista de todos os turnos de trabalho</div>
          </div>
          <Button type="button" onClick={handleNovoTurno}>
            + Novo turno
          </Button>
        </div>

        {sucesso && <div className="turno-aviso turno-aviso--sucesso">{sucesso}</div>}
        {erroLista && <div className="turno-aviso turno-aviso--erro">{erroLista}</div>}

        {carregandoLista && (
          <div className="turno-estado-vazio">Carregando turnos...</div>
        )}

        {!carregandoLista && !erroLista && turnos.length === 0 && (
          <div className="turno-estado-vazio">
            Nenhum turno cadastrado ainda. Clique em &quot;+ Novo turno&quot; para começar.
          </div>
        )}

        {!carregandoLista && turnos.length > 0 && (
          <>
            <div className="turno-tabela-wrap">
              <table className="turno-tabela">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Início</th>
                    <th>Término</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {turnos.map((t) => (
                    <tr key={t.id}>
                      <td>{t.descricao}</td>
                      <td className="turno-tabela-mono">{formatarHora(t.inicio_em)}</td>
                      <td className="turno-tabela-mono">{formatarHora(t.termino_em)}</td>
                      <td>
                        <div className="turno-acoes-linha">
                          <button
                            type="button"
                            className="turno-botao-icone"
                            onClick={() => handleEditarTurno(t)}
                            title="Editar turno"
                            aria-label={`Editar turno ${t.descricao}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="turno-botao-icone turno-botao-icone--perigo"
                            onClick={() => handlePedirExclusao(t)}
                            title="Excluir turno"
                            aria-label={`Excluir turno ${t.descricao}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="turno-lista-mobile">
              {turnos.map((t) => (
                <li key={t.id} className="turno-item-mobile">
                  <div className="turno-item-mobile-topo">
                    <span className="turno-item-mobile-nome">{t.descricao}</span>
                    <div className="turno-item-mobile-topo-direita">
                      <button
                        type="button"
                        className="turno-botao-icone"
                        onClick={() => handleEditarTurno(t)}
                        title="Editar turno"
                        aria-label={`Editar turno ${t.descricao}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="turno-botao-icone turno-botao-icone--perigo"
                        onClick={() => handlePedirExclusao(t)}
                        title="Excluir turno"
                        aria-label={`Excluir turno ${t.descricao}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="turno-item-mobile-detalhes">
                    <span>Início {formatarHora(t.inicio_em)}</span>
                    <span>Término {formatarHora(t.termino_em)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <ConfirmacaoModal
        isOpen={!!turnoParaExcluir}
        titulo="Excluir turno"
        mensagem={
          turnoParaExcluir
            ? `Tem certeza que deseja excluir o turno "${turnoParaExcluir.descricao}"? Esta ação não pode ser desfeita.`
            : ''
        }
        textoConfirmar={excluindo ? 'Excluindo...' : 'Excluir'}
        textoCancelar="Cancelar"
        variante="perigo"
        onConfirm={handleConfirmarExclusao}
        onClose={() => !excluindo && setTurnoParaExcluir(null)}
      />
    </section>
  )
}