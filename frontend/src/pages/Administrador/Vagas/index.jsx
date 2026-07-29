import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import './styles.css'

import Button from '@/components/Button'
import Input from '@/components/Input'

import vagaService from '@/services/vagaService'
import pisoService from '@/services/pisoService'
import { useEstacionamentoAtivo } from '@/context/EstacionamentoAtivoContext'
import ConfirmacaoSenhaModal from '@/components/ConfirmacaoSenhaModal'

const FORMULARIO_INICIAL = {
    codigo: "",
    nome: "",
    piso_id: "",
    is_ocupada: false,
    em_manutencao: false,
}

export default function Vagas() {
    const navigate = useNavigate()
    const { estacionamentoAtivoId } = useEstacionamentoAtivo()

    const [modo, setModo] = useState("lista")

    const [filtroPiso, setFiltroPiso] = useState("")
    const [filtroOcupacao, setFiltroOcupacao] = useState("")

    const [vagas, setVagas] = useState([])
    const [carregandoVagas, setCarregandoVagas] = useState(true)
    const [erroLista, setErroLista] = useState("")

    const [formulario, setFormulario] = useState(FORMULARIO_INICIAL)
    const [pisos, setPisos] = useState([])
    const [carregandoPisos, setCarregandoPisos] = useState(true)
    const [erro, setErro] = useState("")
    const [sucesso, setSucesso] = useState("")
    const [salvando, setSalvando] = useState(false)
    const [modalAberto, setModalAberto] = useState(false)

    const carregarVagas = useCallback(async () => {
        if (!estacionamentoAtivoId) {
            setVagas([])
            setCarregandoVagas(false)
            return
        }

        setCarregandoVagas(true)
        setErroLista("")

        try {
            const resultado = await vagaService.buscarVagasPorEstacionamentoId(estacionamentoAtivoId)
            setVagas(resultado || [])
        } catch (error) {
            setErroLista(error.message)
        } finally {
            setCarregandoVagas(false)
        }
    }, [estacionamentoAtivoId])

    useEffect(() => {
        carregarVagas()
    }, [carregarVagas])

    useEffect(() => {
        async function carregarPisos() {
            if (!estacionamentoAtivoId) {
                setPisos([])
                setCarregandoPisos(false)
                return
            }

            setCarregandoPisos(true)

            try {
                const resultado = await pisoService.listarPorEstacionamento(estacionamentoAtivoId)
                setPisos(resultado || [])
            } catch (error) {
                setErro(error.message)
            } finally {
                setCarregandoPisos(false)
            }
        }

        carregarPisos()
    }, [estacionamentoAtivoId])

    function handleChange(campo) {
        return (e) => {
            const valor = campo === "is_ocupada" || campo === "em_manutencao"
                ? e.target.checked
                : e.target.value
            setFormulario((atual) => ({ ...atual, [campo]: valor }))
        }
    }

    function handleLimpar() {
        setFormulario(FORMULARIO_INICIAL)
        setErro("")
        setSucesso("")
    }

    function handleNovaVaga() {
        handleLimpar()
        setModo("cadastro")
    }

    function handleEditarVaga(id) {
        navigate(`/admin/vagas/${id}/editar`)
    }

    function handleVoltarParaLista() {
        setModo("lista")
        carregarVagas()
    }

    async function handleCadastro(e) {
        e.preventDefault()
        setErro("")
        setSucesso("")

        if (!formulario.piso_id) {
            setErro("Selecione o piso ao qual a vaga pertence.")
            return
        }

        setModalAberto(true)
    }

    async function handleConfirmarCadastro() {
        setSalvando(true)

        try {
            const vaga = await vagaService.cadastrarVaga({
                codigo: formulario.codigo.trim(),
                nome: formulario.nome.trim(),
                is_ocupada: formulario.is_ocupada,
                em_manutencao: formulario.em_manutencao,
                piso_id: formulario.piso_id,
            })

            setFormulario(FORMULARIO_INICIAL)
            setSucesso(`Vaga cadastrada com sucesso: ${vaga.nome} (${vaga.codigo}).`)
            carregarVagas()
            setModalAberto(false)
        } catch (error) {
            setErro(error.message)
        } finally {
            setSalvando(false)
        }
    }

    const vagasFiltradas = vagas.filter((vaga) => {
        const passaPiso = filtroPiso === "" || vaga.piso_id === filtroPiso;
        const passaOcupacao = 
            filtroOcupacao === "" ||
            (filtroOcupacao === "ocupadas" && vaga.is_ocupada) ||
            (filtroOcupacao === "livres" && !vaga.is_ocupada);

        return passaPiso && passaOcupacao;
    });

    if (modo === "cadastro") {
        return (
            <section className="screen active" id="screen-vagas">
                <div className="vaga-card">

                    <div className="vaga-card-head">
                        <div>
                            <h3>Cadastrar vaga</h3>
                            <div className="hint">
                                Informe os dados da nova vaga e o piso ao qual ela pertence.
                            </div>
                        </div>
                        <button
                            type="button"
                            className="vaga-botao-limpar"
                            onClick={handleVoltarParaLista}
                        >
                            Voltar para a lista
                        </button>
                    </div>

                    <form className="vaga-form" onSubmit={handleCadastro}>

                        <div className="vaga-linha">
                            <div className="vaga-campo">
                                <label htmlFor="codigo">Código</label>
                                <Input
                                    id="codigo"
                                    placeholder="Ex.: V-01"
                                    value={formulario.codigo}
                                    onChange={handleChange("codigo")}
                                    required
                                />
                                <span className="ajuda">Precisa ser único entre as vagas.</span>
                            </div>

                            <div className="vaga-campo">
                                <label htmlFor="nome">Nome</label>
                                <Input
                                    id="nome"
                                    placeholder="Ex.: Vaga 01"
                                    value={formulario.nome}
                                    onChange={handleChange("nome")}
                                    required
                                />
                            </div>
                        </div>

                        <div className="vaga-campo">
                            <label htmlFor="piso_id">Piso</label>
                            <select
                                id="piso_id"
                                className="vaga-select"
                                value={formulario.piso_id}
                                onChange={handleChange("piso_id")}
                                disabled={carregandoPisos}
                                required
                            >
                                <option value="">
                                    {carregandoPisos
                                        ? "Carregando pisos..."
                                        : "Selecione um piso"}
                                </option>

                                {pisos.map((piso) => (
                                    <option key={piso.id} value={piso.id}>
                                        {piso.nome} ({piso.codigo})
                                    </option>
                                ))}
                            </select>

                            {!carregandoPisos && pisos.length === 0 && (
                                <span className="ajuda">
                                    Nenhum piso cadastrado. Cadastre um piso antes de criar vagas.
                                </span>
                            )}
                        </div>

                        <label className="vaga-checkbox">
                            <input
                                type="checkbox"
                                checked={formulario.is_ocupada}
                                onChange={handleChange("is_ocupada")}
                            />
                            Vaga já está ocupada
                        </label>

                        <label className="vaga-checkbox">
                            <input
                                type="checkbox"
                                checked={formulario.em_manutencao}
                                onChange={handleChange("em_manutencao")}
                            />
                            Vaga em manutenção
                        </label>

                        {erro && <div className="vaga-aviso vaga-aviso--erro">{erro}</div>}
                        {sucesso && <div className="vaga-aviso vaga-aviso--sucesso">{sucesso}</div>}

                        <div className="vaga-acoes">
                            <button
                                type="button"
                                className="vaga-botao-limpar"
                                onClick={handleLimpar}
                                disabled={salvando}
                            >
                                Limpar
                            </button>

                            <Button type="submit" disabled={salvando || carregandoPisos}>
                                {salvando ? "Cadastrando..." : "Cadastrar vaga"}
                            </Button>
                        </div>

                    </form>
                </div>
                
                <ConfirmacaoSenhaModal
                    isOpen={modalAberto}
                    onClose={() => setModalAberto(false)}
                    onConfirm={handleConfirmarCadastro}
                    titulo="Confirmar Cadastro de Vaga"
                    mensagem="Digite sua senha para confirmar a criação desta vaga."
                />
            </section>
        )
    }

    return (
        <section className="screen active" id="screen-vagas">
            <div className="vaga-card vaga-card--lista">

                <div className="vaga-card-head">
                    <div>
                        <h3>Vagas cadastradas</h3>
                        <div className="hint">
                            Situação atual de cada vaga do estacionamento.
                        </div>
                    </div>
                    <Button type="button" onClick={handleNovaVaga}>
                        + Nova vaga
                    </Button>
                </div>

                {/* Filtros */}
                {!carregandoVagas && vagas.length > 0 && (
                    <div className="vaga-filtros">
                        <div className="vaga-filtro-grupo">
                            <label htmlFor="filtro_piso">Filtrar por Piso:</label>
                            <select
                                id="filtro_piso"
                                className="vaga-select"
                                value={filtroPiso}
                                onChange={(e) => setFiltroPiso(e.target.value)}
                            >
                                <option value="">Todos os pisos</option>
                                {pisos.map((piso) => (
                                    <option key={piso.id} value={piso.id}>
                                        {piso.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="vaga-filtro-grupo">
                            <label htmlFor="filtro_ocupacao">Filtrar por Ocupação:</label>
                            <select
                                id="filtro_ocupacao"
                                className="vaga-select"
                                value={filtroOcupacao}
                                onChange={(e) => setFiltroOcupacao(e.target.value)}
                            >
                                <option value="">Todas</option>
                                <option value="livres">Livres</option>
                                <option value="ocupadas">Ocupadas</option>
                            </select>
                        </div>
                    </div>
                )}

                {erroLista && <div className="vaga-aviso vaga-aviso--erro">{erroLista}</div>}

                {carregandoVagas && (
                    <div className="vaga-estado-vazio">Carregando vagas...</div>
                )}

                {!carregandoVagas && !erroLista && vagas.length === 0 && (
                    <div className="vaga-estado-vazio">
                        Nenhuma vaga cadastrada ainda.
                    </div>
                )}

                {!carregandoVagas && !erroLista && vagas.length > 0 && vagasFiltradas.length === 0 && (
                    <div className="vaga-estado-vazio">
                        Nenhuma vaga encontrada para os filtros aplicados.
                    </div>
                )}

                {!carregandoVagas && vagasFiltradas.length > 0 && (
                    <>
                        <div className="vaga-tabela-wrap">
                            <table className="vaga-tabela">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Código</th>
                                        <th>Piso</th>
                                        <th>Ocupação</th>
                                        <th>Manutenção</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vagasFiltradas.map((vaga) => (
                                        <tr key={vaga.id}>
                                            <td>{vaga.nome}</td>
                                            <td className="vaga-tabela-mono">{vaga.codigo}</td>
                                            <td>{vaga.piso_nome}</td>
                                            <td>
                                                <span className={`vaga-selo ${vaga.is_ocupada ? "vaga-selo--ocupada" : "vaga-selo--livre"}`}>
                                                    {vaga.is_ocupada ? "Ocupada" : "Livre"}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`vaga-selo ${vaga.em_manutencao ? "vaga-selo--manutencao" : "vaga-selo--operacional"}`}>
                                                    {vaga.em_manutencao ? "Em manutenção" : "Operacional"}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="vaga-botao-editar"
                                                    onClick={() => handleEditarVaga(vaga.id)}
                                                    title="Editar vaga"
                                                    aria-label={`Editar vaga ${vaga.nome}`}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <ul className="vaga-lista-mobile">
                            {vagasFiltradas.map((vaga) => (
                                <li key={vaga.id} className="vaga-item-mobile">
                                    <div className="vaga-item-mobile-topo">
                                        <span className="vaga-item-mobile-nome">{vaga.nome}</span>
                                        <div className="vaga-item-mobile-topo-direita">
                                            <span className="vaga-tabela-mono">{vaga.codigo}</span>
                                            <button
                                                type="button"
                                                className="vaga-botao-editar"
                                                onClick={() => handleEditarVaga(vaga.id)}
                                                title="Editar vaga"
                                                aria-label={`Editar vaga ${vaga.nome}`}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="vaga-item-mobile-piso">{vaga.piso_nome}</div>
                                    <div className="vaga-item-mobile-selos">
                                        <span className={`vaga-selo ${vaga.is_ocupada ? "vaga-selo--ocupada" : "vaga-selo--livre"}`}>
                                            {vaga.is_ocupada ? "Ocupada" : "Livre"}
                                        </span>
                                        <span className={`vaga-selo ${vaga.em_manutencao ? "vaga-selo--manutencao" : "vaga-selo--operacional"}`}>
                                            {vaga.em_manutencao ? "Em manutenção" : "Operacional"}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </section>
    )
}
