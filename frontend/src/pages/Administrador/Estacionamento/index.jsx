import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import './styles.css'

import Button from '@/components/Button'
import Input from '@/components/Input'
import CidadeSelect from '@/components/CidadeSelect'

import estacionamentoService from '@/services/estacionamentoService'
import { useAuth } from '@/context/AuthContext'
import { useEstacionamentoAtivo } from '@/context/EstacionamentoAtivoContext'
import useMensagemTemporaria from '@/hooks/useMensagemTemporaria'

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
    qtd_pisos: 1,
    qtd_vagas_por_piso: 10,
}

export default function Estacionamento() {
    const navigate = useNavigate()
    const { usuario } = useAuth()
    const { recarregar: recarregarEstacionamentosAtivos } = useEstacionamentoAtivo()

    const [modo, setModo] = useState("lista")

    const [estacionamentos, setEstacionamentos] = useState([])
    const [carregandoLista, setCarregandoLista] = useState(true)
    const [erroLista, setErroLista] = useState("")

    const [formulario, setFormulario] = useState(FORMULARIO_INICIAL)
    const [cidade, setCidade] = useState(null)
    const [cidadeSelectKey, setCidadeSelectKey] = useState(0)
    const [erro, setErro] = useState("")
    const [sucesso, setSucesso] = useMensagemTemporaria()
    const [salvando, setSalvando] = useState(false)

    const carregarEstacionamentos = useCallback(async () => {
        setCarregandoLista(true)
        setErroLista("")

        try {
            const resultado = await estacionamentoService.listarPorGerente(usuario.id)
            setEstacionamentos(resultado || [])
        } catch (error) {
            setErroLista(error.message)
        } finally {
            setCarregandoLista(false)
        }
    }, [usuario.id])

    useEffect(() => {
        carregarEstacionamentos()
    }, [carregarEstacionamentos])

    function handleChange(campo) {
        return (e) => {
            const valor = campo === "ativo" ? e.target.checked : e.target.value
            setFormulario((atual) => ({ ...atual, [campo]: valor }))
        }
    }

    function handleLimpar() {
        setFormulario(FORMULARIO_INICIAL)
        setCidade(null)
        setCidadeSelectKey((atual) => atual + 1)
        setErro("")
        setSucesso("")
    }

    function handleNovoEstacionamento() {
        handleLimpar()
        setModo("cadastro")
    }

    function handleEditarEstacionamento(id) {
        navigate(`/admin/estacionamento/${id}/editar`)
    }

    function handleVoltarParaLista() {
        setModo("lista")
        carregarEstacionamentos()
    }

    async function handleCadastro(e) {
        e.preventDefault()
        setErro("")
        setSucesso("")

        const cnpj = formulario.cnpj.replace(/\D/g, "")
        const numero = Number(formulario.numero)
        const indicadorInscEstadual = Number(formulario.indicador_insc_estadual)

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

        if (!cidade) {
            setErro("Selecione a cidade do estacionamento.")
            return
        }

        const qtdPisos = Number(formulario.qtd_pisos)
        const qtdVagas = Number(formulario.qtd_vagas_por_piso)

        if (!Number.isInteger(qtdPisos) || qtdPisos < 1) {
            setErro("A quantidade de pisos deve ser no mínimo 1.")
            return
        }

        if (!Number.isInteger(qtdVagas) || qtdVagas < 1) {
            setErro("A quantidade de vagas por piso deve ser no mínimo 1.")
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
                cidade_id: cidade.id,
                // Vincula o estacionamento ao gerente logado (ele vira o dono).
                pessoa_id: usuario.id,
                qtd_pisos: qtdPisos,
                qtd_vagas_por_piso: qtdVagas,
            }

            if (formulario.inscricao_estadual.trim() !== "") {
                dados.inscricao_estadual = Number(formulario.inscricao_estadual)
            }

            const estacionamento = await estacionamentoService.cadastrar(dados)

            setFormulario(FORMULARIO_INICIAL)
            setCidade(null)
            setCidadeSelectKey((atual) => atual + 1)
            setSucesso(`Estacionamento cadastrado com sucesso: ${estacionamento.nome}.`)
            carregarEstacionamentos()
            // Atualiza o seletor de estacionamento ativo no topo do painel.
            recarregarEstacionamentosAtivos()
        } catch (error) {
            setErro(error.message)
        } finally {
            setSalvando(false)
        }
    }

    if (modo === "cadastro") {
        return (
            <section className="screen active" id="screen-estacionamento">
                <div className="estac-card">

                    <div className="estac-card-head">
                        <div>
                            <h3>Cadastrar estacionamento</h3>
                            <div className="hint">
                                Informe os dados do estacionamento e o endereço onde ele fica.
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

                    <form className="estac-form" onSubmit={handleCadastro}>

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
                                <CidadeSelect key={cidadeSelectKey} id="cidade" onSelecionar={setCidade} required />
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

                        <div className="estac-linha">
                            <div className="estac-campo">
                                <label htmlFor="qtd_pisos">Quantidade de pisos</label>
                                <Input
                                    id="qtd_pisos"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={formulario.qtd_pisos}
                                    onChange={handleChange("qtd_pisos")}
                                    required
                                />
                            </div>

                            <div className="estac-campo">
                                <label htmlFor="qtd_vagas_por_piso">Quantidade de vagas por piso</label>
                                <Input
                                    id="qtd_vagas_por_piso"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={formulario.qtd_vagas_por_piso}
                                    onChange={handleChange("qtd_vagas_por_piso")}
                                    required
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
                        {sucesso && <div className="estac-aviso estac-aviso--sucesso">{sucesso}</div>}

                        <div className="estac-acoes">
                            <button
                                type="button"
                                className="estac-botao-limpar"
                                onClick={handleLimpar}
                                disabled={salvando}
                            >
                                Limpar
                            </button>

                            <Button type="submit" disabled={salvando}>
                                {salvando ? "Cadastrando..." : "Cadastrar estacionamento"}
                            </Button>
                        </div>

                    </form>
                </div>
            </section>
        )
    }

    return (
        <section className="screen active" id="screen-estacionamento">
            <div className="estac-card estac-card--lista">

                <div className="estac-card-head">
                    <div>
                        <h3>Estacionamentos cadastrados</h3>
                        <div className="hint">
                            Estacionamentos cadastrados e a cidade onde cada um fica.
                        </div>
                    </div>
                    <Button type="button" onClick={handleNovoEstacionamento}>
                        + Novo estacionamento
                    </Button>
                </div>

                {erroLista && <div className="estac-aviso estac-aviso--erro">{erroLista}</div>}

                {carregandoLista && (
                    <div className="estac-estado-vazio">Carregando estacionamentos...</div>
                )}

                {!carregandoLista && !erroLista && estacionamentos.length === 0 && (
                    <div className="estac-estado-vazio">
                        Nenhum estacionamento cadastrado ainda.
                    </div>
                )}

                {!carregandoLista && estacionamentos.length > 0 && (
                    <>
                        <div className="estac-tabela-wrap">
                            <table className="estac-tabela">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>CNPJ</th>
                                        <th>Cidade</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {estacionamentos.map((estacionamento) => (
                                        <tr key={estacionamento.id}>
                                            <td>{estacionamento.nome}</td>
                                            <td className="estac-tabela-mono">{estacionamento.cnpj}</td>
                                            <td>{estacionamento.cidade_nome} - {estacionamento.cidade_uf}</td>
                                            <td>
                                                <span className={`estac-selo ${estacionamento.ativo ? "estac-selo--ativo" : "estac-selo--inativo"}`}>
                                                    {estacionamento.ativo ? "Ativo" : "Inativo"}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="estac-botao-editar"
                                                    onClick={() => handleEditarEstacionamento(estacionamento.id)}
                                                    title="Editar estacionamento"
                                                    aria-label={`Editar estacionamento ${estacionamento.nome}`}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <ul className="estac-lista-mobile">
                            {estacionamentos.map((estacionamento) => (
                                <li key={estacionamento.id} className="estac-item-mobile">
                                    <div className="estac-item-mobile-topo">
                                        <span className="estac-item-mobile-nome">{estacionamento.nome}</span>
                                        <button
                                            type="button"
                                            className="estac-botao-editar"
                                            onClick={() => handleEditarEstacionamento(estacionamento.id)}
                                            title="Editar estacionamento"
                                            aria-label={`Editar estacionamento ${estacionamento.nome}`}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        </button>
                                    </div>
                                    <div className="estac-item-mobile-detalhe">
                                        {estacionamento.cnpj} · {estacionamento.cidade_nome} - {estacionamento.cidade_uf}
                                    </div>
                                    <div className="estac-item-mobile-selos">
                                        <span className={`estac-selo ${estacionamento.ativo ? "estac-selo--ativo" : "estac-selo--inativo"}`}>
                                            {estacionamento.ativo ? "Ativo" : "Inativo"}
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
