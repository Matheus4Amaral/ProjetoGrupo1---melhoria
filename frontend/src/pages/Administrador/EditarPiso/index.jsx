import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import '../Pisos/styles.css'

import Button from '@/components/Button'
import Input from '@/components/Input'

import pisoService from '@/services/pisoService'
import estacionamentoService from '@/services/estacionamentoService'
import ConfirmacaoSenhaModal from '@/components/ConfirmacaoSenhaModal'

const FORMULARIO_INICIAL = {
    codigo: "",
    nome: "",
    andar: "",
    vagas: "",
    estacionamento_id: "",
}

export default function EditarPiso() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [formulario, setFormulario] = useState(FORMULARIO_INICIAL)
    const [estacionamentos, setEstacionamentos] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [carregandoEstacionamentos, setCarregandoEstacionamentos] = useState(true)
    const [erro, setErro] = useState("")
    const [salvando, setSalvando] = useState(false)
    const [acaoModal, setAcaoModal] = useState(null) // 'editar' | 'excluir' | null
    const [excluindo, setExcluindo] = useState(false)

    useEffect(() => {
        async function carregarPiso() {
            try {
                const piso = await pisoService.buscarPisoPorId(id)
                setFormulario({
                    codigo: piso.codigo,
                    nome: piso.nome,
                    andar: String(piso.andar),
                    vagas: String(piso.vagas),
                    estacionamento_id: piso.estacionamento_id,
                })
            } catch (error) {
                setErro(error.message)
            } finally {
                setCarregando(false)
            }
        }

        carregarPiso()
    }, [id])

    useEffect(() => {
        async function carregarEstacionamentos() {
            try {
                const resultado = await estacionamentoService.listarTodos()
                setEstacionamentos(resultado || [])
            } catch (error) {
                setErro(error.message)
            } finally {
                setCarregandoEstacionamentos(false)
            }
        }

        carregarEstacionamentos()
    }, [])

    function handleChange(campo) {
        return (e) => setFormulario((atual) => ({ ...atual, [campo]: e.target.value }))
    }

    function handleVoltarParaLista() {
        navigate("/admin/pisos")
    }

    async function handleSalvar(e) {
        e.preventDefault()
        setErro("")

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

        if (!formulario.estacionamento_id) {
            setErro("Selecione o estacionamento ao qual o piso pertence.")
            return
        }

        setAcaoModal('editar')
    }

    async function handleConfirmarModal() {
        if (acaoModal === 'editar') {
            await efetuarEdicao()
        } else if (acaoModal === 'excluir') {
            await efetuarExclusao()
        }
    }

    async function efetuarEdicao() {
        setSalvando(true)

        try {
            await pisoService.editarPiso(id, {
                codigo: formulario.codigo.trim(),
                nome: formulario.nome.trim(),
                andar: Number(formulario.andar),
                vagas: Number(formulario.vagas),
                estacionamento_id: formulario.estacionamento_id,
            })

            alert("Piso atualizado com sucesso!")
            navigate("/admin/pisos")
        } catch (error) {
            setErro(error.message)
        } finally {
            setSalvando(false)
            setAcaoModal(null)
        }
    }

    async function efetuarExclusao() {
        setExcluindo(true)
        setErro("")
        try {
            await pisoService.excluirPiso(id)
            alert("Piso excluído com sucesso!")
            navigate("/admin/pisos")
        } catch (error) {
            setErro(error.response?.data?.erro || error.message || "Erro ao excluir piso")
        } finally {
            setExcluindo(false)
            setAcaoModal(null)
        }
    }

    return (
        <section className="screen active" id="screen-pisos">
            <div className="piso-card">

                <div className="piso-card-head">
                    <div>
                        <h3>Editar piso</h3>
                        <div className="hint">
                            Atualize os dados do piso e o estacionamento ao qual ele pertence.
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

                {carregando && (
                    <div className="piso-estado-vazio">Carregando piso...</div>
                )}

                {!carregando && (
                    <form className="piso-form" onSubmit={handleSalvar}>

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
                                value={formulario.estacionamento_id}
                                onChange={handleChange("estacionamento_id")}
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
                        </div>

                        {erro && <div className="piso-aviso piso-aviso--erro">{erro}</div>}

                        <div className="piso-acoes">
                            <button
                                type="button"
                                className="piso-botao-limpar"
                                onClick={() => setAcaoModal('excluir')}
                                style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                                disabled={salvando || excluindo || carregandoEstacionamentos}
                            >
                                {excluindo ? "Excluindo..." : "Excluir piso"}
                            </button>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    className="piso-botao-limpar"
                                    onClick={handleVoltarParaLista}
                                    disabled={salvando || excluindo}
                                >
                                    Cancelar
                                </button>
                                <Button type="submit" disabled={salvando || excluindo || carregandoEstacionamentos}>
                                    {salvando ? "Salvando..." : "Salvar alterações"}
                                </Button>
                            </div>
                        </div>

                    </form>
                )}
            </div>

            <ConfirmacaoSenhaModal
                isOpen={acaoModal !== null}
                onClose={() => setAcaoModal(null)}
                onConfirm={handleConfirmarModal}
                titulo={acaoModal === 'editar' ? "Confirmar Edição" : "Excluir Piso"}
                mensagem={acaoModal === 'editar' 
                    ? "Digite sua senha para confirmar a edição deste piso e suas vagas." 
                    : "Tem certeza que deseja excluir este piso? Digite sua senha para confirmar."}
            />
        </section>
    )
}
