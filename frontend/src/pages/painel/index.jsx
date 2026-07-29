import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import veiculoVagaService from '@/services/veiculoVagaService'
import reservaAntecipadaService from '@/services/reservaAntecipadaService'
import './styles.css'

function formatarTempo(milisegundos) {
    if (milisegundos < 0) return "00:00:00"
    const segundosTotais = Math.floor(milisegundos / 1000)
    const h = Math.floor(segundosTotais / 3600)
    const m = Math.floor((segundosTotais % 3600) / 60)
    const s = segundosTotais % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function formatarHoraExtenso(dataIso) {
    if (!dataIso) return ""
    return new Date(dataIso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export default function Painel() {
    const { usuario } = useAuth()
    const navigate = useNavigate()

    const [dataAtual, setDataAtual] = useState("")
    const [ocupacao, setOcupacao] = useState(null)
    const [reserva, setReserva] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [tempoDecorrido, setTempoDecorrido] = useState("00:00:00")
    
    const [modalAberto, setModalAberto] = useState(false)
    const [tipoModal, setTipoModal] = useState("saida")
    const [carregandoSaida, setCarregandoSaida] = useState(false)

    const carregarOcupacao = async () => {
        try {
            setCarregando(true)
            const [ativa, reservaAtiva] = await Promise.all([
                veiculoVagaService.buscarOcupacaoAtiva(),
                reservaAntecipadaService.buscarReservaAtiva()
            ])
            setOcupacao(ativa)
            setReserva(reservaAtiva)
        } catch (error) {
            console.error("Erro ao buscar dados", error)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        const opcoes = { day: 'numeric', month: 'long', year: 'numeric' }
        setDataAtual(new Date().toLocaleDateString('pt-BR', opcoes))

        carregarOcupacao()
    }, [])

    useEffect(() => {
        if (!ocupacao) return

        const dataEntrada = new Date(ocupacao.estacionado_em).getTime()

        const atualizarTempo = () => {
            const agora = Date.now()
            setTempoDecorrido(formatarTempo(agora - dataEntrada))
        }

        atualizarTempo()
        const intervalo = setInterval(atualizarTempo, 1000)

        return () => clearInterval(intervalo)
    }, [ocupacao])

    const handleAbrirModal = (tipo) => {
        setTipoModal(tipo)
        setModalAberto(true)
    }

    const handleFecharModal = () => {
        setModalAberto(false)
    }

    const handleConfirmarAcao = async () => {
        try {
            setCarregandoSaida(true)
            if (tipoModal === "saida" && ocupacao) {
                await veiculoVagaService.registrarSaida(ocupacao.id)
                setOcupacao(null)
                alert("Saída registrada com sucesso!")
            } else if (tipoModal === "cancelar_reserva" && reserva) {
                await reservaAntecipadaService.cancelarReserva(reserva.id)
                setReserva(null)
                alert("Reserva cancelada com sucesso!")
            }
            setModalAberto(false)
        } catch (error) {
            alert(error.response?.data?.erro || error.message || "Erro ao executar ação")
        } finally {
            setCarregandoSaida(false)
        }
    }

    const handleProximaVaga = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }

    return (
        <section className="dashboard-cliente">
            <header className="dashboard-header">
                <span className="dashboard-overline">MINHA CONTA</span>
                <h1 className="dashboard-title">
                    Olá, {usuario?.nome ? usuario.nome.split(" ")[0] : "Motorista"}!
                </h1>
                <p className="dashboard-subtitle">
                    Aqui está o resumo da sua conta no HubParking hoje, {dataAtual}.
                </p>
            </header>

            {carregando ? (
                <div className="hero-card hero-empty">
                    <p style={{ color: '#fff', textAlign: 'center', width: '100%', padding: '40px' }}>Carregando dados da conta...</p>
                </div>
            ) : ocupacao ? (
                <div className="hero-card">
                    <div className="hero-left">
                        <div className="status-badge">
                            <span className="dot dot-blue"></span>
                            <span className="status-text">VEÍCULO NO PÁTIO</span>
                        </div>

                        <h2 className="vehicle-title">{ocupacao.marca} {ocupacao.modelo} está estacionado...</h2>

                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">VAGA</span>
                                <span className="info-value">{ocupacao.vaga_nome} &bull; {ocupacao.piso_nome}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">ENTRADA</span>
                                <span className="info-value">{formatarHoraExtenso(ocupacao.estacionado_em)}</span>
                            </div>
                        </div>

                        <div className="hero-actions">
                            <button className="btn-outline-white" onClick={handleProximaVaga}>Reservar próxima vaga</button>
                        </div>
                    </div>

                    <div className="hero-right">
                        <div className="timer-box">
                            <span className="timer-label">TEMPO DECORRIDO</span>
                            <div className="timer-value">{tempoDecorrido}</div>
                            <button className="btn-primary-blue mt-auto" onClick={() => handleAbrirModal("saida")}>Solicitar saída</button>
                        </div>
                    </div>
                </div>
            ) : reserva ? (
                <div className="hero-card" style={{ background: "linear-gradient(135deg, #1f2937, #111827)" }}>
                    <div className="hero-left">
                        <div className="status-badge">
                            <span className="dot" style={{ backgroundColor: "#fbbf24", boxShadow: "0 0 8px #fbbf24" }}></span>
                            <span className="status-text" style={{ color: "#fbbf24" }}>VAGA RESERVADA</span>
                        </div>

                        <h2 className="vehicle-title">{reserva.marca} {reserva.modelo} tem uma reserva</h2>

                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">VAGA</span>
                                <span className="info-value">{reserva.vaga_nome} &bull; {reserva.piso_nome}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">CRIADA EM</span>
                                <span className="info-value">{formatarHoraExtenso(reserva.criado_em)}</span>
                            </div>
                        </div>

                        <div className="hero-actions">
                            <button className="btn-outline-white" onClick={() => handleAbrirModal("cancelar_reserva")} style={{ borderColor: "#fbbf24", color: "#fbbf24" }}>Cancelar reserva</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="hero-card hero-empty">
                    <div className="hero-left" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <div className="status-badge">
                            <span className="dot dot-neutral" style={{ backgroundColor: '#A0AEC0' }}></span>
                            <span className="status-text">NENHUM VEÍCULO NO PÁTIO</span>
                        </div>
                        <h2 className="vehicle-title" style={{ marginTop: '16px', marginBottom: '32px' }}>Você não possui veículos estacionados ou reservados</h2>
                        <button className="btn-primary-blue" onClick={handleProximaVaga}>Procurar uma vaga</button>
                    </div>
                </div>
            )}

            {modalAberto && (
                <div className="modal-backdrop">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>{tipoModal === "saida" ? "Confirmar Saída" : "Cancelar Reserva"}</h3>
                            <button type="button" className="modal-close" onClick={handleFecharModal} disabled={carregandoSaida}>&times;</button>
                        </div>
                        <div className="modal-body">
                            {tipoModal === "saida" ? (
                                <p style={{ marginTop: 0 }}>Deseja realmente solicitar a saída do veículo <strong>{ocupacao?.marca} {ocupacao?.modelo}</strong> da vaga <strong>{ocupacao?.vaga_nome}</strong>?</p>
                            ) : (
                                <p style={{ marginTop: 0 }}>Deseja realmente cancelar a reserva do veículo <strong>{reserva?.marca} {reserva?.modelo}</strong> para a vaga <strong>{reserva?.vaga_nome}</strong>?</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="modal-btn-cancelar" 
                                onClick={handleFecharModal}
                                disabled={carregandoSaida}
                            >
                                Voltar
                            </button>
                            <button 
                                type="button" 
                                className="btn-primary-blue"
                                onClick={handleConfirmarAcao}
                                disabled={carregandoSaida}
                                style={{ padding: '0 24px', height: '42px', fontSize: '14px', backgroundColor: tipoModal === "cancelar_reserva" ? "#ef4444" : undefined }}
                            >
                                {carregandoSaida ? (tipoModal === "saida" ? 'Registrando...' : 'Cancelando...') : (tipoModal === "saida" ? 'Confirmar Saída' : 'Confirmar Cancelamento')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
