import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import './styles.css'

import Button from '@/components/Button'
import Input from '@/components/Input'

import pisoService from '@/services/pisoService'
import { useEstacionamentoAtivo } from '@/context/EstacionamentoAtivoContext'
import ConfirmacaoSenhaModal from '@/components/ConfirmacaoSenhaModal'
import useMensagemTemporaria from '@/hooks/useMensagemTemporaria'

const FORMULARIO_INICIAL = {
    codigo: "",
    nome: "",
    andar: "",
    vagas: "",
}

export default function Pisos() {
    const navigate = useNavigate()
    const {
        estacionamentos,
        estacionamentoAtivoId,
        selecionar,
        carregando: carregandoEstacionamentos,
    } = useEstacionamentoAtivo()

    const [modo, setModo] = useState("lista")

    const [pisos, setPisos] = useState([])
    const [carregandoPisos, setCarregandoPisos] = useState(true)
    const [erroLista, setErroLista] = useState("")

    const [formulario, setFormulario] = useState(FORMULARIO_INICIAL)
    const [erro, setErro] = useState("")
    const [sucesso, setSucesso] = useMensagemTemporaria()
    const [salvando, setSalvando] = useState(false)
    const [modalAberto, setModalAberto] = useState(false)

    // Enquanto o usuário não escolhe no formulário, vale o estacionamento ativo do topo.
    const [estacionamentoEscolhido, setEstacionamentoEscolhido] = useState(null)
    const estacionamentoDestinoId = estacionamentoEscolhido ?? estacionamentoAtivoId ?? ""

    const carregarPisos = useCallback(async () => {
        if (!estacionamentoAtivoId) {
            setPisos([])
            setCarregandoPisos(false)
            return
        }

        setCarregandoPisos(true)
        setErroLista("")

        try {
            const resultado = await pisoService.listarPorEstacionamento(estacionamentoAtivoId)
            setPisos(resultado || [])
        } catch (error) {
            setErroLista(error.message)
        } finally {
            setCarregandoPisos(false)
        }
    }, [estacionamentoAtivoId])

    useEffect(() => {
        carregarPisos()
    }, [carregarPisos])

    function handleChange(campo) {
        return (e) => setFormulario((atual) => ({ ...atual, [campo]: e.target.value }))
    }

    function handleLimpar() {
        setFormulario(FORMULARIO_INICIAL)
        setEstacionamentoEscolhido(null)
        setErro("")
        setSucesso("")
    }

    function handleNovoPiso() {
        handleLimpar()
        setModo("cadastro")
    }

    function handleEditarPiso(id) {
        navigate(`/admin/pisos/${id}/editar`)
    }

    function handleVoltarParaLista() {
        setModo("lista")
        carregarPisos()
    }

    async function handleCadastro(e) {
        e.preventDefault()
        setErro("")
        setSucesso("")

        const andar = Number(formulario.andar)
        const vagas = Number(formulario.vagas)

        if (!Number.isInteger(andar)) {
            setErro("O andar deve ser um número inteiro.")
            return
        }

        if (!Number.isInteger(vagas) || vagas < 1) {
            setErro("A quantidade de vagas deve ser um número inteiro maior que zero.")
            return
        }

        if (!estacionamentoDestinoId) {
            setErro("Selecione o estacionamento em que o piso será cadastrado.")
            return
        }

        setModalAberto(true)
    }

    async function handleConfirmarCadastro() {
        setSalvando(true)

        const andar = Number(formulario.andar)
        const vagas = Number(formulario.vagas)

        try {
            const piso = await pisoService.cadastrarPiso({
                codigo: formulario.codigo.trim(),
                nome: formulario.nome.trim(),
                andar,
                vagas,
                estacionamento_id: estacionamentoDestinoId,
            })

            setFormulario(FORMULARIO_INICIAL)
            setSucesso(`Piso cadastrado com sucesso: ${piso.nome} (${piso.codigo}).`)

            // Se o piso foi criado em outro estacionamento, o painel passa a mostrar esse,
            // senão o piso recém-criado não apareceria na lista.
            if (estacionamentoDestinoId !== estacionamentoAtivoId) {
                selecionar(estacionamentoDestinoId)
                setEstacionamentoEscolhido(null)
            } else {
                carregarPisos()
            }

            setModalAberto(false)
        } catch (error) {
            setErro(error.message)
        } finally {
            setSalvando(false)
        }
    }

    if (modo === "cadastro") {
        return (
            <section className="screen active" id="screen-pisos">
                <div className="piso-card">

                    <div className="piso-card-head">
                        <div>
                            <h3>Cadastrar piso</h3>
                            <div className="hint">
                                Informe os dados do novo piso e o estacionamento ao qual ele pertence.
                            </div>
                        </div>
                        <button
                            type="button"
                            className="piso-botao-limpar"
                            onClick={handleVoltarParaLista}
                        >
                            Voltar para a lista
                        </button>
                    </div>

                    <form className="piso-form" onSubmit={handleCadastro}>

                        <div className="piso-linha">
                            <div className="piso-campo">
                                <label htmlFor="codigo">Código</label>
                                <Input
                                    id="codigo"
                                    placeholder="Ex.: P-01"
                                    value={formulario.codigo}
                                    onChange={handleChange("codigo")}
                                    required
                                />
                                <span className="ajuda">Precisa ser único entre os pisos.</span>
                            </div>

                            <div className="piso-campo">
                                <label htmlFor="nome">Nome</label>
                                <Input
                                    id="nome"
                                    placeholder="Ex.: Térreo"
                                    value={formulario.nome}
                                    onChange={handleChange("nome")}
                                    required
                                />
                            </div>
                        </div>

                        <div className="piso-linha">
                            <div className="piso-campo">
                                <label htmlFor="andar">Andar</label>
                                <Input
                                    id="andar"
                                    type="number"
                                    step="1"
                                    placeholder="Ex.: 0 para o térreo"
                                    value={formulario.andar}
                                    onChange={handleChange("andar")}
                                    required
                                />
                                <span className="ajuda">Use números negativos para subsolos.</span>
                            </div>

                            <div className="piso-campo">
                                <label htmlFor="vagas">Quantidade de vagas</label>
                                <Input
                                    id="vagas"
                                    type="number"
                                    min="1"
                                    step="1"
                                    placeholder="Ex.: 120"
                                    value={formulario.vagas}
                                    onChange={handleChange("vagas")}
                                    required
                                />
                            </div>
                        </div>

                        <div className="piso-campo">
                            <label htmlFor="estacionamento_id">Estacionamento</label>
                            <select
                                id="estacionamento_id"
                                className="piso-select"
                                value={estacionamentoDestinoId}
                                onChange={(e) => setEstacionamentoEscolhido(e.target.value)}
                                disabled={carregandoEstacionamentos}
                                required
                            >
                                <option value="">
                                    {carregandoEstacionamentos
                                        ? "Carregando estacionamentos..."
                                        : "Selecione um estacionamento"}
                                </option>

                                {estacionamentos.map((estacionamento) => (
                                    <option key={estacionamento.id} value={estacionamento.id}>
                                        {estacionamento.nome}
                                    </option>
                                ))}
                            </select>

                            {!carregandoEstacionamentos && estacionamentos.length === 0 && (
                                <span className="ajuda">
                                    Nenhum estacionamento cadastrado. Cadastre um estacionamento antes de criar pisos.
                                </span>
                            )}

                            {estacionamentoDestinoId && estacionamentoDestinoId !== estacionamentoAtivoId && (
                                <span className="ajuda">
                                    Após o cadastro, o painel passa a mostrar esse estacionamento.
                                </span>
                            )}
                        </div>

                        {erro && <div className="piso-aviso piso-aviso--erro">{erro}</div>}
                        {sucesso && <div className="piso-aviso piso-aviso--sucesso">{sucesso}</div>}

                        <div className="piso-acoes">
                            <button
                                type="button"
                                className="piso-botao-limpar"
                                onClick={handleLimpar}
                                disabled={salvando}
                            >
                                Limpar
                            </button>

                            <Button type="submit" disabled={salvando || !estacionamentoDestinoId}>
                                {salvando ? "Cadastrando..." : "Cadastrar piso"}
                            </Button>
                        </div>

                    </form>
                </div>

                <ConfirmacaoSenhaModal
                    isOpen={modalAberto}
                    onClose={() => setModalAberto(false)}
                    onConfirm={handleConfirmarCadastro}
                    titulo="Confirmar Cadastro de Piso"
                    mensagem="Digite sua senha para confirmar a criação deste piso e das respectivas vagas."
                />
            </section>
        )
    }

    return (
        <section className="screen active" id="screen-pisos">
            <div className="piso-card piso-card--lista">

                <div className="piso-card-head">
                    <div>
                        <h3>Pisos cadastrados</h3>
                        <div className="hint">
                            Pisos de cada estacionamento e a quantidade de vagas planejada.
                        </div>
                    </div>
                    <Button type="button" onClick={handleNovoPiso}>
                        + Novo piso
                    </Button>
                </div>

                {erroLista && <div className="piso-aviso piso-aviso--erro">{erroLista}</div>}

                {carregandoPisos && (
                    <div className="piso-estado-vazio">Carregando pisos...</div>
                )}

                {!carregandoPisos && !erroLista && pisos.length === 0 && (
                    <div className="piso-estado-vazio">
                        Nenhum piso cadastrado ainda.
                    </div>
                )}

                {!carregandoPisos && pisos.length > 0 && (
                    <>
                        <div className="piso-tabela-wrap">
                            <table className="piso-tabela">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Código</th>
                                        <th>Andar</th>
                                        <th>Vagas</th>
                                        <th>Estacionamento</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pisos.map((piso) => (
                                        <tr key={piso.id}>
                                            <td>{piso.nome}</td>
                                            <td className="piso-tabela-mono">{piso.codigo}</td>
                                            <td>{piso.andar}</td>
                                            <td>{piso.vagas}</td>
                                            <td>{piso.estacionamento_nome}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="piso-botao-editar"
                                                    onClick={() => handleEditarPiso(piso.id)}
                                                    title="Editar piso"
                                                    aria-label={`Editar piso ${piso.nome}`}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <ul className="piso-lista-mobile">
                            {pisos.map((piso) => (
                                <li key={piso.id} className="piso-item-mobile">
                                    <div className="piso-item-mobile-topo">
                                        <span className="piso-item-mobile-nome">{piso.nome}</span>
                                        <div className="piso-item-mobile-topo-direita">
                                            <span className="piso-tabela-mono">{piso.codigo}</span>
                                            <button
                                                type="button"
                                                className="piso-botao-editar"
                                                onClick={() => handleEditarPiso(piso.id)}
                                                title="Editar piso"
                                                aria-label={`Editar piso ${piso.nome}`}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="piso-item-mobile-estacionamento">{piso.estacionamento_nome}</div>
                                    <div className="piso-item-mobile-detalhes">
                                        <span>Andar {piso.andar}</span>
                                        <span>{piso.vagas} vagas</span>
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
