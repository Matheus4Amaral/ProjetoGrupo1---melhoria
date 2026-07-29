import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import "./Vagas.css"

import { useEstacionamentoAtivo } from "../../context/EstacionamentoAtivoContext"
import pisoService from "../../services/pisoService"
import vagaService from "../../services/vagaService"

const FILTROS = [
    { valor: "todas", rotulo: "Todas as vagas" },
    { valor: "livre", rotulo: "Livres" },
    { valor: "ocupada", rotulo: "Ocupadas" },
    { valor: "reservada", rotulo: "Reservadas" },
    { valor: "manutencao", rotulo: "Em manutenção" },
]

const SITUACOES = {
    livre: "Livre",
    ocupada: "Ocupada",
    reservada: "Reservada",
    manutencao: "Manutenção",
}

function obterSituacao(vaga) {
    if (vaga.em_manutencao) return "manutencao"
    if (vaga.reserva_id && vaga.reserva_status === "ativa") return "reservada"
    if (vaga.ocupacao_id || vaga.is_ocupada) return "ocupada"
    return "livre"
}

function formatarData(data) {
    if (!data) return "Não informado"

    const valor = new Date(data)
    if (Number.isNaN(valor.getTime())) return "Não informado"

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(valor)
}

export default function Vagas() {
    const navigate = useNavigate()
    const { estacionamentoAtivoId } = useEstacionamentoAtivo()

    const [pisos, setPisos] = useState([])
    const [vagas, setVagas] = useState([])
    const [pisoAtivoId, setPisoAtivoId] = useState(null)
    const [filtro, setFiltro] = useState("todas")
    const [vagaSelecionada, setVagaSelecionada] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")
    const [tentativa, setTentativa] = useState(0)

    useEffect(() => {
        let ignorar = false

        async function carregarMapa() {
            if (!estacionamentoAtivoId) {
                if (!ignorar) {
                    setPisos([])
                    setVagas([])
                    setPisoAtivoId(null)
                    setCarregando(false)
                    setErro("")
                }
                return
            }

            setCarregando(true)
            setErro("")
            setVagaSelecionada(null)
            setFiltro("todas")

            try {
                const [pisosCarregados, vagasCarregadas] = await Promise.all([
                    pisoService.listarPorEstacionamento(estacionamentoAtivoId),
                    vagaService.buscarVagasPorEstacionamentoId(estacionamentoAtivoId),
                ])

                if (ignorar) return

                const pisosOrdenados = [...(pisosCarregados || [])].sort(
                    (a, b) => a.andar - b.andar || a.nome.localeCompare(b.nome, "pt-BR")
                )

                setPisos(pisosOrdenados)
                setVagas(vagasCarregadas || [])
                setPisoAtivoId((pisoAtual) => (
                    pisosOrdenados.some((piso) => piso.id === pisoAtual)
                        ? pisoAtual
                        : (pisosOrdenados[0]?.id ?? null)
                ))
            } catch (error) {
                if (!ignorar) {
                    setPisos([])
                    setVagas([])
                    setPisoAtivoId(null)
                    setErro(error.message)
                }
            } finally {
                if (!ignorar) setCarregando(false)
            }
        }

        carregarMapa()

        return () => {
            ignorar = true
        }
    }, [estacionamentoAtivoId, tentativa])

    useEffect(() => {
        if (!vagaSelecionada) return undefined

        function fecharComEscape(event) {
            if (event.key === "Escape") setVagaSelecionada(null)
        }

        document.addEventListener("keydown", fecharComEscape)
        return () => document.removeEventListener("keydown", fecharComEscape)
    }, [vagaSelecionada])

    const pisoAtivo = pisos.find((piso) => piso.id === pisoAtivoId) || null

    const vagasDoPiso = useMemo(
        () => vagas
            .filter((vaga) => vaga.piso_id === pisoAtivoId)
            .map((vaga) => ({ ...vaga, situacao: obterSituacao(vaga) })),
        [pisoAtivoId, vagas]
    )

    const vagasVisiveis = useMemo(
        () => filtro === "todas"
            ? vagasDoPiso
            : vagasDoPiso.filter((vaga) => vaga.situacao === filtro),
        [filtro, vagasDoPiso]
    )

    function selecionarPiso(id) {
        setPisoAtivoId(id)
        setVagaSelecionada(null)
    }

    function editarVaga() {
        if (!vagaSelecionada) return
        navigate(`/admin/vagas/${vagaSelecionada.id}/editar`)
    }

    function fecharDetalhes(event) {
        if (!event || event.target === event.currentTarget) {
            setVagaSelecionada(null)
        }
    }

    return (
        <section className="screen active vagas-mapa" id="screen-vagas">
            <div className="vagas-toolbar">
                <div>
                    <h2>Vagas</h2>
                    <p>Mapa das vagas por piso do estacionamento selecionado.</p>
                </div>

                <label className="vagas-filtro">
                    <span className="sr-only">Filtrar vagas por situação</span>
                    <select
                        value={filtro}
                        onChange={(event) => setFiltro(event.target.value)}
                        disabled={carregando || !pisoAtivo}
                    >
                        {FILTROS.map((opcao) => (
                            <option key={opcao.valor} value={opcao.valor}>
                                {opcao.rotulo}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {erro && (
                <div className="vagas-feedback vagas-feedback--erro" role="alert">
                    <div>
                        <strong>Não foi possível carregar o mapa.</strong>
                        <span>{erro}</span>
                    </div>
                    <button type="button" onClick={() => setTentativa((valor) => valor + 1)}>
                        Tentar novamente
                    </button>
                </div>
            )}

            {carregando && (
                <div className="vagas-feedback vagas-feedback--carregando" aria-live="polite">
                    <span className="vagas-spinner" aria-hidden="true" />
                    Carregando pisos e vagas...
                </div>
            )}

            {!carregando && !erro && pisos.length === 0 && (
                <div className="vagas-feedback">
                    <strong>Nenhum piso cadastrado</strong>
                    <span>Cadastre um piso para começar a visualizar o mapa de vagas.</span>
                </div>
            )}

            {!carregando && !erro && pisos.length > 0 && (
                <>
                    <div className="vagas-pisos" role="tablist" aria-label="Pisos do estacionamento">
                        {pisos.map((piso) => {
                            const ativo = piso.id === pisoAtivoId
                            return (
                                <button
                                    key={piso.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={ativo}
                                    className={`vagas-piso${ativo ? " ativo" : ""}`}
                                    onClick={() => selecionarPiso(piso.id)}
                                >
                                    {piso.nome}
                                </button>
                            )
                        })}
                    </div>

                    {vagasDoPiso.length === 0 && (
                        <div className="vagas-feedback">
                            <strong>Nenhuma vaga neste piso</strong>
                            <span>{pisoAtivo?.nome} ainda não possui vagas cadastradas.</span>
                        </div>
                    )}

                    {vagasDoPiso.length > 0 && vagasVisiveis.length === 0 && (
                        <div className="vagas-feedback">
                            <strong>Nenhuma vaga corresponde ao filtro</strong>
                            <span>Selecione outra situação para visualizar as vagas deste piso.</span>
                        </div>
                    )}

                    {vagasVisiveis.length > 0 && (
                        <div className="vagas-grid" role="tabpanel" aria-label={`Vagas de ${pisoAtivo?.nome}`}>
                            {vagasVisiveis.map((vaga) => (
                                <button
                                    key={vaga.id}
                                    type="button"
                                    className={`vaga-stub vaga-stub--${vaga.situacao}`}
                                    onClick={() => setVagaSelecionada(vaga)}
                                    aria-label={`${vaga.codigo}, ${SITUACOES[vaga.situacao]}`}
                                >
                                    <span className="vaga-stub__codigo">{vaga.codigo}</span>
                                    <span className="vaga-stub__situacao">{SITUACOES[vaga.situacao]}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="vagas-legenda" aria-label="Legenda das situações">
                        {Object.entries(SITUACOES).map(([situacao, rotulo]) => (
                            <span key={situacao}>
                                <span className={`vagas-legenda__cor vagas-legenda__cor--${situacao}`} />
                                {rotulo}
                            </span>
                        ))}
                    </div>
                </>
            )}

            {vagaSelecionada && (
                <div
                    className="vaga-modal-backdrop"
                    role="presentation"
                    onMouseDown={fecharDetalhes}
                >
                    <div
                        className="vaga-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="vaga-modal-titulo"
                        aria-describedby="vaga-modal-descricao"
                    >
                        <div className="vaga-modal__cabecalho">
                            <div>
                                <h3 id="vaga-modal-titulo">Vaga {vagaSelecionada.codigo}</h3>
                                <p id="vaga-modal-descricao">
                                    {vagaSelecionada.piso_nome} · {SITUACOES[vagaSelecionada.situacao]}
                                </p>
                            </div>
                            <button
                                type="button"
                                className="vaga-modal__fechar"
                                onClick={() => setVagaSelecionada(null)}
                                aria-label="Fechar detalhes da vaga"
                                autoFocus
                            >
                                ×
                            </button>
                        </div>

                        <div className="vaga-modal__conteudo">
                            {vagaSelecionada.situacao === "ocupada" && (
                                <>
                                    <div className="vaga-detalhe">
                                        <span>Placa</span>
                                        <strong className="vaga-detalhe__mono">
                                            {vagaSelecionada.veiculo_placa || "Não informada"}
                                        </strong>
                                    </div>
                                    <div className="vaga-detalhe">
                                        <span>Motorista</span>
                                        <strong>{vagaSelecionada.motorista_nome || "Não informado"}</strong>
                                    </div>
                                    <div className="vaga-detalhe">
                                        <span>Entrada</span>
                                        <strong>{formatarData(vagaSelecionada.estacionado_em)}</strong>
                                    </div>
                                </>
                            )}

                            {vagaSelecionada.situacao === "reservada" && (
                                <>
                                    <div className="vaga-detalhe">
                                        <span>Reservada para</span>
                                        <strong>{vagaSelecionada.reserva_pessoa_nome || "Não informado"}</strong>
                                    </div>
                                    <div className="vaga-detalhe">
                                        <span>Placa</span>
                                        <strong className="vaga-detalhe__mono">
                                            {vagaSelecionada.reserva_veiculo_placa || "Não informada"}
                                        </strong>
                                    </div>
                                    <div className="vaga-detalhe">
                                        <span>Reserva criada em</span>
                                        <strong>{formatarData(vagaSelecionada.reservado_em)}</strong>
                                    </div>
                                </>
                            )}

                            {vagaSelecionada.situacao === "livre" && (
                                <p className="vaga-modal__mensagem">
                                    Esta vaga está livre e disponível para uma nova entrada.
                                </p>
                            )}

                            {vagaSelecionada.situacao === "manutencao" && (
                                <p className="vaga-modal__mensagem">
                                    Esta vaga está fora de operação para manutenção.
                                </p>
                            )}
                        </div>

                        <div className="vaga-modal__acoes">
                            <button
                                type="button"
                                className="vaga-modal__botao vaga-modal__botao--secundario"
                                onClick={() => setVagaSelecionada(null)}
                            >
                                Fechar
                            </button>
                            <button
                                type="button"
                                className="vaga-modal__botao vaga-modal__botao--primario"
                                onClick={editarVaga}
                            >
                                Editar vaga
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
