import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import "./Estacionamento.css"

import Button from "../../components/Button"
import Input from "../../components/Input"
import CidadeSelect from "../../components/CidadeSelect"

import estacionamentoService from "../../services/estacionamentoService"

const FORMULARIO_INICIAL = {
    nome: "",
    cnpj: "",
    inscricao_estadual: "",
    indicador_insc_estadual: "",
    logradouro: "",
    numero: "",
    bairro: "",
    email: "",
    telefone: "",
    ativo: true,
}

export default function EditarEstacionamento() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [formulario, setFormulario] = useState(FORMULARIO_INICIAL)
    const [cidadeIdAtual, setCidadeIdAtual] = useState("")
    const [cidadeNomeInicial, setCidadeNomeInicial] = useState("")
    const [cidadeSelecionada, setCidadeSelecionada] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")
    const [salvando, setSalvando] = useState(false)

    useEffect(() => {
        async function carregarEstacionamento() {
            try {
                const estacionamento = await estacionamentoService.buscarPorId(id)

                setFormulario({
                    nome: estacionamento.nome,
                    cnpj: estacionamento.cnpj,
                    inscricao_estadual: estacionamento.inscricao_estadual != null
                        ? String(estacionamento.inscricao_estadual)
                        : "",
                    indicador_insc_estadual: String(estacionamento.indicador_insc_estadual),
                    logradouro: estacionamento.logradouro,
                    numero: String(estacionamento.numero),
                    bairro: estacionamento.bairro,
                    email: estacionamento.email || "",
                    telefone: estacionamento.telefone || "",
                    ativo: estacionamento.ativo,
                })
                setCidadeIdAtual(estacionamento.cidade_id)
                setCidadeNomeInicial(`${estacionamento.cidade_nome} - ${estacionamento.cidade_uf}`)
            } catch (error) {
                setErro(error.message)
            } finally {
                setCarregando(false)
            }
        }

        carregarEstacionamento()
    }, [id])

    function handleChange(campo) {
        return (e) => {
            const valor = campo === "ativo" ? e.target.checked : e.target.value
            setFormulario((atual) => ({ ...atual, [campo]: valor }))
        }
    }

    function handleVoltarParaLista() {
        navigate("/admin/estacionamento")
    }

    async function handleSalvar(e) {
        e.preventDefault()
        setErro("")

        const cnpj = formulario.cnpj.replace(/\D/g, "")
        const numero = Number(formulario.numero)
        const indicadorInscEstadual = Number(formulario.indicador_insc_estadual)
        const cidadeId = cidadeSelecionada?.id || cidadeIdAtual

        if (cnpj.length !== 14) {
            setErro("O CNPJ deve conter 14 dígitos.")
            return
        }

        if (!formulario.indicador_insc_estadual) {
            setErro("Selecione o indicador de inscrição estadual.")
            return
        }

        if (!Number.isInteger(numero) || numero < 1) {
            setErro("O número do endereço deve ser um número inteiro maior que zero.")
            return
        }

        if (!cidadeId) {
            setErro("Selecione a cidade do estacionamento.")
            return
        }

        setSalvando(true)

        try {
            const dados = {
                nome: formulario.nome.trim(),
                cnpj,
                indicador_insc_estadual: indicadorInscEstadual,
                logradouro: formulario.logradouro.trim(),
                bairro: formulario.bairro.trim(),
                numero,
                email: formulario.email.trim(),
                telefone: formulario.telefone.trim(),
                ativo: formulario.ativo,
                cidade_id: cidadeId,
            }

            if (formulario.inscricao_estadual.trim() !== "") {
                dados.inscricao_estadual = Number(formulario.inscricao_estadual)
            }

            await estacionamentoService.editar(id, dados)

            navigate("/admin/estacionamento")
        } catch (error) {
            setErro(error.message)
        } finally {
            setSalvando(false)
        }
    }

    return (
        <section className="screen active" id="screen-estacionamento">
            

            <div className="estac-card">
                <div className="estac-card-head">
                    <div>
                        <h3>Editar estacionamento</h3>
                        <div className="hint">
                            Atualize os dados do estacionamento e o endereço onde ele fica.
                        </div>
                    </div>
                    <button
                        type="button"
                        className="estac-botao-limpar"
                        onClick={handleVoltarParaLista}
                    >
                        Voltar para a lista
                    </button>
                </div>

                {carregando && (
                    <div className="estac-estado-vazio">Carregando estacionamento...</div>
                )}

                {!carregando && (
                    <form className="estac-form" onSubmit={handleSalvar}>

                        <div className="estac-linha">
                            <div className="estac-campo">
                                <label htmlFor="nome">Nome</label>
                                <Input
                                    id="nome"
                                    placeholder="Ex.: Estacionamento Central"
                                    value={formulario.nome}
                                    onChange={handleChange("nome")}
                                    required
                                />
                            </div>

                            <div className="estac-campo">
                                <label htmlFor="cnpj">CNPJ</label>
                                <Input
                                    id="cnpj"
                                    placeholder="Somente números"
                                    value={formulario.cnpj}
                                    onChange={handleChange("cnpj")}
                                    maxLength={18}
                                    required
                                />
                                <span className="ajuda">Precisa ser único entre os estacionamentos.</span>
                            </div>
                        </div>

                        <div className="estac-linha">
                            <div className="estac-campo">
                                <label htmlFor="inscricao_estadual">Inscrição estadual</label>
                                <Input
                                    id="inscricao_estadual"
                                    type="number"
                                    step="1"
                                    placeholder="Opcional"
                                    value={formulario.inscricao_estadual}
                                    onChange={handleChange("inscricao_estadual")}
                                />
                            </div>

                            <div className="estac-campo">
                                <label htmlFor="indicador_insc_estadual">Indicador de inscrição estadual</label>
                                <select
                                    id="indicador_insc_estadual"
                                    className="estac-select"
                                    value={formulario.indicador_insc_estadual}
                                    onChange={handleChange("indicador_insc_estadual")}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="1">1 - Contribuinte ICMS</option>
                                    <option value="2">2 - Contribuinte isento de inscrição</option>
                                    <option value="9">9 - Não contribuinte</option>
                                </select>
                            </div>
                        </div>

                        <div className="estac-linha">
                            <div className="estac-campo">
                                <label htmlFor="logradouro">Logradouro</label>
                                <Input
                                    id="logradouro"
                                    placeholder="Ex.: Av. Paulista"
                                    value={formulario.logradouro}
                                    onChange={handleChange("logradouro")}
                                    required
                                />
                            </div>

                            <div className="estac-campo">
                                <label htmlFor="numero">Número</label>
                                <Input
                                    id="numero"
                                    type="number"
                                    min="1"
                                    step="1"
                                    placeholder="Ex.: 1000"
                                    value={formulario.numero}
                                    onChange={handleChange("numero")}
                                    required
                                />
                            </div>
                        </div>

                        <div className="estac-linha">
                            <div className="estac-campo">
                                <label htmlFor="bairro">Bairro</label>
                                <Input
                                    id="bairro"
                                    placeholder="Ex.: Bela Vista"
                                    value={formulario.bairro}
                                    onChange={handleChange("bairro")}
                                    required
                                />
                            </div>

                            <div className="estac-campo">
                                <label htmlFor="cidade">Cidade</label>
                                <CidadeSelect
                                    id="cidade"
                                    valorInicial={cidadeNomeInicial}
                                    onSelecionar={setCidadeSelecionada}
                                />
                            </div>
                        </div>

                        <div className="estac-linha">
                            <div className="estac-campo">
                                <label htmlFor="email">E-mail</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Opcional"
                                    value={formulario.email}
                                    onChange={handleChange("email")}
                                />
                            </div>

                            <div className="estac-campo">
                                <label htmlFor="telefone">Telefone</label>
                                <Input
                                    id="telefone"
                                    placeholder="Opcional"
                                    value={formulario.telefone}
                                    onChange={handleChange("telefone")}
                                />
                            </div>
                        </div>

                        <label className="estac-checkbox">
                            <input
                                type="checkbox"
                                checked={formulario.ativo}
                                onChange={handleChange("ativo")}
                            />
                            Estacionamento ativo
                        </label>

                        {erro && <div className="estac-aviso estac-aviso--erro">{erro}</div>}

                        <div className="estac-acoes">
                            <button
                                type="button"
                                className="estac-botao-limpar"
                                onClick={handleVoltarParaLista}
                                disabled={salvando}
                            >
                                Cancelar
                            </button>

                            <Button type="submit" disabled={salvando}>
                                {salvando ? "Salvando..." : "Salvar alterações"}
                            </Button>
                        </div>

                    </form>
                )}
            </div>
        </section>
    )
}
