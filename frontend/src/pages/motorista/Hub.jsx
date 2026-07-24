import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import "./Hub.css"

import estacionamentoService from "../../services/estacionamentoService"
import { useAuth } from "../../context/AuthContext"

function normalizar(texto) {
    return texto
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim()
}

function primeiroNome(nomeCompleto) {
    return nomeCompleto ? nomeCompleto.trim().split(" ")[0] : "motorista"
}

export default function Hub() {
    const navigate = useNavigate()
    const { usuario } = useAuth()

    const [estacionamentos, setEstacionamentos] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")
    const [busca, setBusca] = useState("")

    useEffect(() => {
        async function carregarEstacionamentos() {
            try {
                const resultado = await estacionamentoService.listarComDisponibilidade()
                setEstacionamentos(resultado || [])
            } catch (error) {
                setErro(error.message)
            } finally {
                setCarregando(false)
            }
        }

        carregarEstacionamentos()
    }, [])

    const encontrados = useMemo(() => {
        const termo = normalizar(busca)

        if (!termo) {
            return estacionamentos
        }

        return estacionamentos.filter((estacionamento) =>
            normalizar(estacionamento.nome).includes(termo)
        )
    }, [estacionamentos, busca])

    const totalLivres = useMemo(
        () => estacionamentos.reduce((soma, item) => soma + item.vagas_livres, 0),
        [estacionamentos]
    )

    return (
        <section className="hub">

            <div className="hub-saudacao">
                <h1>Olá, {primeiroNome(usuario?.nome)}! Onde vamos estacionar?</h1>
                <p>
                    {carregando
                        ? "Buscando vagas perto de você..."
                        : `${totalLivres} ${totalLivres === 1 ? "vaga livre" : "vagas livres"} em ${estacionamentos.length} ${estacionamentos.length === 1 ? "estacionamento" : "estacionamentos"} agora.`}
                </p>
            </div>

            <div className="hub-busca">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                <input
                    type="search"
                    placeholder="Buscar estacionamento pelo nome..."
                    aria-label="Buscar estacionamento pelo nome"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
                {busca && (
                    <button
                        type="button"
                        className="hub-busca-limpar"
                        onClick={() => setBusca("")}
                        aria-label="Limpar busca"
                    >
                        ✕
                    </button>
                )}
            </div>

            {erro && <div className="hub-aviso hub-aviso--erro">{erro}</div>}

            {carregando && <div className="hub-estado">Carregando estacionamentos...</div>}

            {!carregando && !erro && estacionamentos.length === 0 && (
                <div className="hub-estado">Nenhum estacionamento disponível no momento.</div>
            )}

            {!carregando && estacionamentos.length > 0 && encontrados.length === 0 && (
                <div className="hub-estado">
                    Nenhum estacionamento encontrado para <strong>{busca}</strong>.
                </div>
            )}

            {encontrados.length > 0 && (
                <ul className="hub-lista">
                    {encontrados.map((estacionamento) => {
                        const semVagasCadastradas = estacionamento.total_vagas === 0
                        const lotado = !semVagasCadastradas && estacionamento.vagas_livres === 0

                        return (
                            <li key={estacionamento.id}>
                                <button
                                    type="button"
                                    className="hub-card"
                                    onClick={() => navigate(`/motorista/estacionamentos/${estacionamento.id}`)}
                                >
                                    <span className="hub-card-icone">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 21V7l8-4 8 4v14M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
                                    </span>

                                    <span className="hub-card-info">
                                        <span className="hub-card-nome">{estacionamento.nome}</span>
                                        <span className="hub-card-endereco">
                                            {estacionamento.logradouro}, {estacionamento.numero} · {estacionamento.bairro}
                                        </span>
                                        <span className="hub-card-cidade">
                                            {estacionamento.cidade_nome} - {estacionamento.cidade_uf}
                                        </span>

                                        <span className="hub-card-selos">
                                            {semVagasCadastradas && (
                                                <span className="hub-selo hub-selo--neutro">Sem vagas cadastradas</span>
                                            )}
                                            {lotado && <span className="hub-selo hub-selo--lotado">Lotado</span>}
                                            {!semVagasCadastradas && !lotado && (
                                                <span className="hub-selo hub-selo--livre">
                                                    {estacionamento.vagas_livres} {estacionamento.vagas_livres === 1 ? "vaga livre" : "vagas livres"}
                                                </span>
                                            )}
                                            {!semVagasCadastradas && (
                                                <span className="hub-card-total">de {estacionamento.total_vagas}</span>
                                            )}
                                        </span>
                                    </span>

                                    <span className="hub-card-seta">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </section>
    )
}
