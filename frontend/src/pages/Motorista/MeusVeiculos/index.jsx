import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import './styles.css'

import veiculoService from '@/services/veiculoService'
import { useAuth } from '@/context/AuthContext'

const FORMULARIO_INICIAL = {
    placa: "",
    marca: "",
    modelo: "",
    ano: "",
    cor: "",
    combustivel: "",
}

const COMBUSTIVEIS = ["Gasolina", "Etanol", "Flex", "Diesel", "GNV", "Elétrico", "Híbrido"]

export default function MeusVeiculos() {
    const { usuario } = useAuth()

    const [veiculos, setVeiculos] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    const [formulario, setFormulario] = useState(FORMULARIO_INICIAL)
    const [editandoId, setEditandoId] = useState(null)
    const [salvando, setSalvando] = useState(false)
    const [erroForm, setErroForm] = useState("")
    const [sucesso, setSucesso] = useState("")

    const editando = editandoId !== null

    useEffect(() => {
        carregar()
    }, [])

    async function carregar() {
        setCarregando(true)
        setErro("")

        try {
            const todos = await veiculoService.listarTodosVeiculos()
            const meus = (todos || []).filter((veiculo) => veiculo.pessoa_id === usuario.id)
            setVeiculos(meus)
        } catch (error) {
            setErro(error.message)
        } finally {
            setCarregando(false)
        }
    }

    function handleChange(campo) {
        return (e) => setFormulario((atual) => ({ ...atual, [campo]: e.target.value }))
    }

    function iniciarEdicao(veiculo) {
        setEditandoId(veiculo.id)
        setFormulario({
            placa: veiculo.placa || "",
            marca: veiculo.marca || "",
            modelo: veiculo.modelo || "",
            ano: veiculo.ano || "",
            cor: veiculo.cor || "",
            combustivel: veiculo.combustivel || "",
        })
        setErroForm("")
        setSucesso("")

        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    function cancelarEdicao() {
        setEditandoId(null)
        setFormulario(FORMULARIO_INICIAL)
        setErroForm("")
    }

    async function handleSalvar(e) {
        e.preventDefault()
        setErroForm("")
        setSucesso("")

        if (!formulario.placa.trim()) {
            setErroForm("Informe a placa do veículo.")
            return
        }

        const dados = {
            placa: formulario.placa.trim().toUpperCase(),
            marca: formulario.marca.trim() || null,
            modelo: formulario.modelo.trim() || null,
            ano: formulario.ano.trim() || null,
            cor: formulario.cor.trim() || null,
            combustivel: formulario.combustivel || null,
        }

        setSalvando(true)

        try {
            if (editando) {
                await veiculoService.editarVeiculo(editandoId, dados)
                setSucesso("Veículo atualizado com sucesso!")
                setEditandoId(null)
            } else {
                await veiculoService.cadastrarVeiculo({ ...dados, pessoa_id: usuario.id })
                setSucesso("Veículo cadastrado com sucesso!")
            }

            setFormulario(FORMULARIO_INICIAL)
            await carregar()
        } catch (error) {
            setErroForm(error.message)
        } finally {
            setSalvando(false)
        }
    }

    async function handleRemover(veiculo) {
        const confirmar = window.confirm(`Remover o veículo de placa ${veiculo.placa}?`)

        if (!confirmar) {
            return
        }

        setErro("")

        try {
            await veiculoService.deletarVeiculo(veiculo.id)
            setSucesso("Veículo removido.")

            if (editandoId === veiculo.id) {
                cancelarEdicao()
            }

            await carregar()
        } catch (error) {
            setErro(error.message)
        }
    }

    const temVeiculos = useMemo(() => veiculos.length > 0, [veiculos])

    return (
        <section className="veiculos">

            <Link to="/motorista" className="veiculos-voltar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Voltar para os estacionamentos
            </Link>

            <div className="veiculos-cabecalho">
                <h1>Meus veículos</h1>
                <p>Cadastre os veículos que você usa para estacionar.</p>
            </div>

            <form className="veiculos-form" onSubmit={handleSalvar}>
                <h2>{editando ? "Editar veículo" : "Cadastrar veículo"}</h2>

                <div className="veiculos-form-grade">
                    <div className="veiculos-campo">
                        <label htmlFor="placa">Placa *</label>
                        <input
                            id="placa"
                            className="veiculos-input"
                            placeholder="ABC1D23"
                            value={formulario.placa}
                            onChange={handleChange("placa")}
                            maxLength={8}
                            required
                        />
                    </div>

                    <div className="veiculos-campo">
                        <label htmlFor="marca">Marca</label>
                        <input
                            id="marca"
                            className="veiculos-input"
                            placeholder="Fiat, VW, Toyota..."
                            value={formulario.marca}
                            onChange={handleChange("marca")}
                        />
                    </div>

                    <div className="veiculos-campo">
                        <label htmlFor="modelo">Modelo</label>
                        <input
                            id="modelo"
                            className="veiculos-input"
                            placeholder="Argo, Gol, Corolla..."
                            value={formulario.modelo}
                            onChange={handleChange("modelo")}
                        />
                    </div>

                    <div className="veiculos-campo">
                        <label htmlFor="ano">Ano</label>
                        <input
                            id="ano"
                            className="veiculos-input"
                            placeholder="2022"
                            value={formulario.ano}
                            onChange={handleChange("ano")}
                            maxLength={4}
                        />
                    </div>

                    <div className="veiculos-campo">
                        <label htmlFor="cor">Cor</label>
                        <input
                            id="cor"
                            className="veiculos-input"
                            placeholder="Prata, Preto..."
                            value={formulario.cor}
                            onChange={handleChange("cor")}
                        />
                    </div>

                    <div className="veiculos-campo">
                        <label htmlFor="combustivel">Combustível</label>
                        <select
                            id="combustivel"
                            className="veiculos-input"
                            value={formulario.combustivel}
                            onChange={handleChange("combustivel")}
                        >
                            <option value="">Selecione...</option>
                            {COMBUSTIVEIS.map((opcao) => (
                                <option key={opcao} value={opcao}>{opcao}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {erroForm && <div className="veiculos-aviso veiculos-aviso--erro">{erroForm}</div>}
                {sucesso && <div className="veiculos-aviso veiculos-aviso--sucesso">{sucesso}</div>}

                <div className="veiculos-form-acoes">
                    <button type="submit" className="veiculos-botao" disabled={salvando}>
                        {salvando
                            ? (editando ? "Salvando..." : "Cadastrando...")
                            : (editando ? "Salvar alterações" : "Cadastrar veículo")}
                    </button>

                    {editando && (
                        <button
                            type="button"
                            className="veiculos-botao veiculos-botao--secundario"
                            onClick={cancelarEdicao}
                            disabled={salvando}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <div className="veiculos-lista-cabecalho">
                <h2>Cadastrados</h2>
                {temVeiculos && <span className="veiculos-contagem">{veiculos.length}</span>}
            </div>

            {erro && <div className="veiculos-aviso veiculos-aviso--erro">{erro}</div>}

            {carregando && <div className="veiculos-estado">Carregando veículos...</div>}

            {!carregando && !erro && !temVeiculos && (
                <div className="veiculos-estado">Você ainda não cadastrou nenhum veículo.</div>
            )}

            {temVeiculos && (
                <ul className="veiculos-lista">
                    {veiculos.map((veiculo) => (
                        <li
                            key={veiculo.id}
                            className={`veiculos-cartao${editandoId === veiculo.id ? " veiculos-cartao--editando" : ""}`}
                        >
                            <div className="veiculos-cartao-placa">{veiculo.placa}</div>

                            <div className="veiculos-cartao-info">
                                <span className="veiculos-cartao-modelo">
                                    {[veiculo.marca, veiculo.modelo].filter(Boolean).join(" ") || "Veículo"}
                                </span>
                                <span className="veiculos-cartao-detalhes">
                                    {[veiculo.ano, veiculo.cor, veiculo.combustivel].filter(Boolean).join(" · ") || "Sem detalhes"}
                                </span>
                            </div>

                            <div className="veiculos-cartao-acoes">
                                <button
                                    type="button"
                                    className="veiculos-cartao-editar"
                                    onClick={() => iniciarEdicao(veiculo)}
                                    aria-label={`Editar veículo ${veiculo.placa}`}
                                    title="Editar veículo"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17v3M13.5 6.5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </button>

                                <button
                                    type="button"
                                    className="veiculos-cartao-remover"
                                    onClick={() => handleRemover(veiculo)}
                                    aria-label={`Remover veículo ${veiculo.placa}`}
                                    title="Remover veículo"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
