import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"

import './styles.css'

import estacionamentoService from '@/services/estacionamentoService'
import vagaService from '@/services/vagaService'
import veiculoService from '@/services/veiculoService'
import reservaService from '@/services/reservaService'
import reservaAntecipadaService from '@/services/reservaAntecipadaService'
import { useAuth } from '@/context/AuthContext'

function situacaoDaVaga(vaga) {
    if (vaga.em_manutencao) {
        return { rotulo: "Manutenção", modificador: "manutencao" }
    }

    if (vaga.is_ocupada) {
        return { rotulo: "Ocupada", modificador: "ocupada" }
    }

    return { rotulo: "Livre", modificador: "livre" }
}

export default function EstacionamentoVagas() {
    const { id } = useParams()
    const { usuario } = useAuth()

    const [estacionamento, setEstacionamento] = useState(null)
    const [vagas, setVagas] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    const [meusVeiculos, setMeusVeiculos] = useState([])
    const [ocupacaoAtiva, setOcupacaoAtiva] = useState(null)

    const [vagaSelecionada, setVagaSelecionada] = useState(null)
    const [veiculoParaEstacionar, setVeiculoParaEstacionar] = useState("")
    const [carregandoAcao, setCarregandoAcao] = useState(false)
    const [erroAcao, setErroAcao] = useState("")
    const [sucessoAcao, setSucessoAcao] = useState("")

    useEffect(() => {
        carregar()
    }, [id])

    async function carregar() {
        setCarregando(true)
        setErro("")

        try {
            const [dadosEstacionamento, dadosVagas, dadosVeiculos] = await Promise.all([
                estacionamentoService.buscarPorId(id),
                vagaService.buscarVagasPorEstacionamentoId(id),
                veiculoService.listarTodosVeiculos(),
            ])

            setEstacionamento(dadosEstacionamento)
            setVagas(dadosVagas || [])

            const veiculosDoMotorista = (dadosVeiculos || []).filter(
                (veiculo) => veiculo.pessoa_id === usuario.id
            )
            setMeusVeiculos(veiculosDoMotorista)

            const ocupacoesAtivas = await Promise.all(
                veiculosDoMotorista.map((veiculo) =>
                    reservaService.buscarOcupacaoAtivaPorVeiculo(veiculo.id)
                )
            )
            const ativa = ocupacoesAtivas.find((ocupacao) => ocupacao !== null)
            setOcupacaoAtiva(ativa || null)
        } catch (error) {
            setErro(error.message)
        } finally {
            setCarregando(false)
        }
    }

    const vagasLivres = useMemo(
        () => vagas.filter((vaga) => !vaga.is_ocupada && !vaga.em_manutencao).length,
        [vagas]
    )

    const pisos = useMemo(() => {
        const agrupados = new Map()

        vagas.forEach((vaga) => {
            if (!agrupados.has(vaga.piso_id)) {
                agrupados.set(vaga.piso_id, {
                    id: vaga.piso_id,
                    nome: vaga.piso_nome,
                    andar: vaga.piso_andar,
                    vagas: [],
                })
            }

            agrupados.get(vaga.piso_id).vagas.push(vaga)
        })

        return Array.from(agrupados.values())
    }, [vagas])

    function abrirSelecaoDeVeiculo(vaga) {
        if (ocupacaoAtiva || meusVeiculos.length === 0) {
            return
        }

        setErroAcao("")
        setSucessoAcao("")
        setVagaSelecionada(vaga)
        setVeiculoParaEstacionar(meusVeiculos[0]?.id || "")
    }

    function cancelarSelecao() {
        setVagaSelecionada(null)
        setVeiculoParaEstacionar("")
        setErroAcao("")
    }

    async function confirmarEstacionar() {
        if (!veiculoParaEstacionar || !vagaSelecionada) {
            return
        }

        setCarregandoAcao(true)
        setErroAcao("")

        try {
            await reservaService.estacionarVeiculo(veiculoParaEstacionar, vagaSelecionada.id)
            setSucessoAcao(`Estacionado na vaga ${vagaSelecionada.nome}!`)
            setVagaSelecionada(null)
            setVeiculoParaEstacionar("")
            await carregar()
        } catch (error) {
            setErroAcao(error.message)
        } finally {
            setCarregandoAcao(false)
        }
    }

    async function confirmarReservar() {
        if (!veiculoParaEstacionar || !vagaSelecionada) {
            return
        }

        setCarregandoAcao(true)
        setErroAcao("")

        try {
            await reservaAntecipadaService.cadastrarReserva({
                pessoa_id: usuario.id,
                vaga_id: vagaSelecionada.id,
                veiculo_id: veiculoParaEstacionar,
            })
            setSucessoAcao(`Vaga ${vagaSelecionada.nome} reservada com sucesso!`)
            setVagaSelecionada(null)
            setVeiculoParaEstacionar("")
            await carregar()
        } catch (error) {
            setErroAcao(error.message)
        } finally {
            setCarregandoAcao(false)
        }
    }

    async function registrarSaida() {
        if (!ocupacaoAtiva) {
            return
        }

        setCarregandoAcao(true)
        setErroAcao("")

        try {
            await reservaService.registrarSaida(ocupacaoAtiva.id)
            setSucessoAcao("Saída registrada com sucesso!")
            await carregar()
        } catch (error) {
            setErroAcao(error.message)
        } finally {
            setCarregandoAcao(false)
        }
    }

    return (
        <section className="detalhe">

            <Link to="/motorista" className="detalhe-voltar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Voltar para os estacionamentos
            </Link>

            {erro && <div className="detalhe-aviso detalhe-aviso--erro">{erro}</div>}

            {carregando && <div className="detalhe-estado">Carregando vagas...</div>}

            {!carregando && estacionamento && (
                <>
                    <div className="detalhe-cabecalho">
                        <div>
                            <h1>{estacionamento.nome}</h1>
                            <p>
                                {estacionamento.logradouro}, {estacionamento.numero} · {estacionamento.bairro}
                                {" · "}
                                {estacionamento.cidade_nome} - {estacionamento.cidade_uf}
                            </p>
                        </div>

                        <div className={`detalhe-resumo ${vagasLivres === 0 ? "detalhe-resumo--lotado" : ""}`}>
                            <span className="detalhe-resumo-numero">{vagasLivres}</span>
                            <span className="detalhe-resumo-texto">
                                {vagasLivres === 1 ? "vaga livre" : "vagas livres"}
                                <br />
                                de {vagas.length}
                            </span>
                            </div>
                    </div>

                    {meusVeiculos.length === 0 && (
                        <div className="detalhe-aviso detalhe-aviso--erro">
                            Você não possui veículos cadastrados.{" "}
                            <Link to="/motorista/veiculos">Cadastre um veículo</Link> antes de estacionar.
                        </div>
                    )}

                    {ocupacaoAtiva && (
                        <div className="detalhe-ocupacao-ativa">
                            <span>
                                Você já tem um veículo estacionado desde{" "}
                                {new Date(ocupacaoAtiva.estacionado_em).toLocaleString("pt-BR")}.
                                Registre a saída antes de estacionar em outra vaga.
                            </span>
                            <button
                                type="button"
                                className="detalhe-botao-sair"
                                onClick={registrarSaida}
                                disabled={carregandoAcao}
                            >
                                {carregandoAcao ? "Registrando..." : "Registrar saída"}
                            </button>
                        </div>
                    )}

                    {sucessoAcao && <div className="detalhe-aviso detalhe-aviso--sucesso">{sucessoAcao}</div>}
                    {erroAcao && <div className="detalhe-aviso detalhe-aviso--erro">{erroAcao}</div>}

                    {vagaSelecionada && (
                        <div className="detalhe-confirmar">
                            <span>
                                Estacionar na vaga <strong>{vagaSelecionada.nome}</strong> com qual veículo?
                            </span>

                            <select
                                className="detalhe-confirmar-select"
                                value={veiculoParaEstacionar}
                                onChange={(e) => setVeiculoParaEstacionar(e.target.value)}
                            >
                                {meusVeiculos.map((veiculo) => (
                                    <option key={veiculo.id} value={veiculo.id}>
                                        {veiculo.placa} — {veiculo.marca} {veiculo.modelo}
                                    </option>
                                ))}
                            </select>

                            <div className="detalhe-confirmar-acoes">
                                <button
                                    type="button"
                                    className="detalhe-botao-confirmar"
                                    onClick={confirmarEstacionar}
                                    disabled={carregandoAcao}
                                >
                                    {carregandoAcao ? "Estacionando..." : "Estacionar agora"}
                                </button>
                                <button
                                    type="button"
                                    className="detalhe-botao-confirmar"
                                    onClick={confirmarReservar}
                                    disabled={carregandoAcao}
                                >
                                    {carregandoAcao ? "Reservando..." : "Reservar para depois"}
                                </button>
                                <button
                                    type="button"
                                    className="detalhe-botao-cancelar"
                                    onClick={cancelarSelecao}
                                    disabled={carregandoAcao}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="detalhe-legenda">
                        <span><i className="detalhe-ponto detalhe-ponto--livre" /> Livre</span>
                        <span><i className="detalhe-ponto detalhe-ponto--ocupada" /> Ocupada</span>
                        <span><i className="detalhe-ponto detalhe-ponto--manutencao" /> Manutenção</span>
                    </div>

                    {vagas.length === 0 && (
                        <div className="detalhe-estado">
                            Este estacionamento ainda não tem vagas cadastradas.
                        </div>
                    )}

                    {pisos.map((piso) => (
                        <div key={piso.id} className="detalhe-piso">
                            <div className="detalhe-piso-cabecalho">
                                <h2>{piso.nome}</h2>
                                <span className="detalhe-piso-andar">Andar {piso.andar}</span>
                                <span className="detalhe-piso-contagem">
                                    {piso.vagas.filter((vaga) => !vaga.is_ocupada && !vaga.em_manutencao).length} de {piso.vagas.length} livres
                                </span>
                            </div>

                            <ul className="detalhe-vagas">
                                {piso.vagas.map((vaga) => {
                                    const situacao = situacaoDaVaga(vaga)

                                    const clicavel = situacao.modificador === "livre" && !ocupacaoAtiva && meusVeiculos.length > 0

                                    return (
                                        <li key={vaga.id}>
                                            <button
                                                type="button"
                                                className={`detalhe-vaga detalhe-vaga--${situacao.modificador}${clicavel ? " detalhe-vaga--clicavel" : ""}`}
                                                onClick={() => clicavel && abrirSelecaoDeVeiculo(vaga)}
                                                disabled={!clicavel}
                                            >
                                                <span className="detalhe-vaga-nome">{vaga.nome}</span>
                                                <span className="detalhe-vaga-codigo">{vaga.codigo}</span>
                                                <span className="detalhe-vaga-situacao">{situacao.rotulo}</span>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ))}
                </>
            )}
        </section>
    )
}
