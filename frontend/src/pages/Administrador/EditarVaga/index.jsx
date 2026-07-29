import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import '../Vagas/styles.css'

import Button from '@/components/Button'
import Input from '@/components/Input'

import vagaService from '@/services/vagaService'
import pisoService from '@/services/pisoService'
import ConfirmacaoSenhaModal from '@/components/ConfirmacaoSenhaModal'

const FORMULARIO_INICIAL = {
    codigo: "",
    nome: "",
    piso_id: "",
    is_ocupada: false,
    em_manutencao: false,
}

export default function EditarVaga() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [formulario, setFormulario] = useState(FORMULARIO_INICIAL)
    const [pisos, setPisos] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [carregandoPisos, setCarregandoPisos] = useState(true)
    const [erro, setErro] = useState("")
    const [salvando, setSalvando] = useState(false)
    const [acaoModal, setAcaoModal] = useState(null)
    const [excluindo, setExcluindo] = useState(false)

    useEffect(() => {
        async function carregarVaga() {
            try {
                const vaga = await vagaService.buscarVagaPorId(id)
                setFormulario({
                    codigo: vaga.codigo,
                    nome: vaga.nome,
                    piso_id: vaga.piso_id,
                    is_ocupada: vaga.is_ocupada,
                    em_manutencao: vaga.em_manutencao,
                })
            } catch (error) {
                setErro(error.message)
            } finally {
                setCarregando(false)
            }
        }

        carregarVaga()
    }, [id])

    useEffect(() => {
        async function carregarPisos() {
            try {
                const resultado = await pisoService.listarTodosPisos()
                setPisos(resultado || [])
            } catch (error) {
                setErro(error.message)
            } finally {
                setCarregandoPisos(false)
            }
        }

        carregarPisos()
    }, [])

    function handleChange(campo) {
        return (e) => {
            const valor = campo === "is_ocupada" || campo === "em_manutencao"
                ? e.target.checked
                : e.target.value
            setFormulario((atual) => ({ ...atual, [campo]: valor }))
        }
    }

    function handleVoltarParaLista() {
        navigate("/admin/vagas")
    }

    async function handleSalvar(e) {
        e.preventDefault()
        setErro("")

        if (!formulario.piso_id) {
            setErro("Selecione o piso ao qual a vaga pertence.")
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
            await vagaService.editarVaga(id, {
                codigo: formulario.codigo.trim(),
                nome: formulario.nome.trim(),
                is_ocupada: formulario.is_ocupada,
                em_manutencao: formulario.em_manutencao,
                piso_id: formulario.piso_id,
            })

            alert("Vaga atualizada com sucesso!")
            navigate("/admin/vagas")
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
            await vagaService.excluirVaga(id)
            alert("Vaga excluída com sucesso!")
            navigate("/admin/vagas")
        } catch (error) {
            setErro(error.response?.data?.erro || error.message || "Erro ao excluir vaga")
        } finally {
            setExcluindo(false)
            setAcaoModal(null)
        }
    }

    return (
        <section className="screen active" id="screen-vagas">
            <div className="vaga-card">

                <div className="vaga-card-head">
                    <div>
                        <h3>Editar vaga</h3>
                        <div className="hint">
                            Atualize os dados da vaga e o piso ao qual ela pertence.
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

                {carregando && (
                    <div className="vaga-estado-vazio">Carregando vaga...</div>
                )}

                {!carregando && (
                    <form className="vaga-form" onSubmit={handleSalvar}>

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

                        <div className="vaga-acoes">
                            <button
                                type="button"
                                className="vaga-botao-limpar"
                                onClick={() => setAcaoModal('excluir')}
                                style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                                disabled={salvando || excluindo || carregandoPisos}
                            >
                                {excluindo ? "Excluindo..." : "Excluir vaga"}
                            </button>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    className="vaga-botao-limpar"
                                    onClick={handleVoltarParaLista}
                                    disabled={salvando || excluindo}
                                >
                                    Cancelar
                                </button>
                                <Button type="submit" disabled={salvando || excluindo || carregandoPisos}>
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
                titulo={acaoModal === 'editar' ? "Confirmar Edição" : "Excluir Vaga"}
                mensagem={acaoModal === 'editar' 
                    ? "Digite sua senha para confirmar a edição desta vaga." 
                    : "Tem certeza que deseja excluir esta vaga? Digite sua senha para confirmar."}
            />
        </section>
    )
}
