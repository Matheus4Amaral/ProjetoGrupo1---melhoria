import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import "./Auth.css"

import Container from "../../components/Container"
import Button from "../../components/Button"
import Input from "../../components/Input"
import Text from "../../components/Text"
import CidadeSelect from "../../components/CidadeSelect"

import autenticacaoService from "../../services/autenticacaoService"
import AuthLogo from "./AuthLogo"

import { FaEye, FaEyeSlash } from "react-icons/fa";

const FORMULARIO_INICIAL = {
    tipo: "motorista",
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    confirmarSenha: "",
    logradouro: "",
    bairro: "",
    numero: "",
    complemento: "",
    cidade_id: "",
}

export default function Cadastro() {
    const navigate = useNavigate()

    const [formulario, setFormulario] = useState(FORMULARIO_INICIAL)
    const [erro, setErro] = useState("")
    const [carregando, setCarregando] = useState(false)

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    // function handleChange(campo) {
    //     return (e) => setFormulario((atual) => ({ ...atual, [campo]: e.target.value }))
    // }

    function selecionarTipo(tipo) {
        setFormulario((atual) => ({ ...atual, tipo }))
    }

    function handleSelecionarCidade(cidade) {
        setFormulario((atual) => ({ ...atual, cidade_id: cidade?.id || "" }))
    }


    function formatarCPF(valor) {
        return valor
            .replace(/\D/g, "")
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    function handleChange(campo) {
        return (e) => {
            let valor = e.target.value;

            if (campo === "cpf") {
                valor = formatarCPF(valor);
            }

            setFormulario((atual) => ({
                ...atual,
                [campo]: valor,
            }));
        };
    }

    async function handleCadastro(e) {
        e.preventDefault();
        setErro("");

        const cpfLimpo = formulario.cpf.replace(/\D/g, "");

        if (cpfLimpo.length !== 11) {
            setErro("Informe um CPF válido.");
            return;
        }

        if (formulario.senha !== formulario.confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        if (!formulario.cidade_id) {
            setErro("Selecione uma cidade na lista de sugestões.");
            return;
        }

        setCarregando(true);

        try {
            const {
                tipo,
                nome,
                email,
                senha,
                logradouro,
                bairro,
                numero,
                complemento,
                cidade_id,
            } = formulario;

            await autenticacaoService.cadastrar({
                tipo,
                nome,
                email,
                cpf: cpfLimpo,
                senha,
                logradouro,
                bairro,
                complemento,
                cidade_id,
                numero: Number(numero),
            });

            navigate("/login", { state: { cadastroConcluido: true } });
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <Container>
            <div className="auth-card auth-card--largo">

                <div className="auth-brand">
                    <AuthLogo />

                    <div className="auth-brand-bars">
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                    </div>

                    <Text className="auth-brand-titulo">
                        Comece a usar o HubParking.
                    </Text>

                    <Text className="auth-brand-subtitulo">
                        Cadastre-se para reservar vagas, acompanhar seu histórico e gerenciar seus veículos em um só lugar.
                    </Text>
                </div>

                <form className="auth-form" onSubmit={handleCadastro}>
                    <span className="auth-eyebrow">Novo cadastro</span>

                    <Text className="auth-titulo">
                        Criar conta
                    </Text>

                    <Text className="auth-subtitulo">
                        Preencha seus dados para começar a usar o HubParking.
                    </Text>

                    <div className="auth-campo">
                        <label>Como você vai usar o HubParking?</label>
                        <div className="auth-tipo" role="radiogroup" aria-label="Tipo de conta">
                            <button
                                type="button"
                                role="radio"
                                aria-checked={formulario.tipo === "motorista"}
                                className={`auth-tipo-opcao${formulario.tipo === "motorista" ? " auth-tipo-opcao--ativo" : ""}`}
                                onClick={() => selecionarTipo("motorista")}
                            >
                                <span className="auth-tipo-titulo">Sou motorista</span>
                                <span className="auth-tipo-descricao">Quero encontrar e reservar vagas.</span>
                            </button>

                            <button
                                type="button"
                                role="radio"
                                aria-checked={formulario.tipo === "gerente"}
                                className={`auth-tipo-opcao${formulario.tipo === "gerente" ? " auth-tipo-opcao--ativo" : ""}`}
                                onClick={() => selecionarTipo("gerente")}
                            >
                                <span className="auth-tipo-titulo">Sou gerente</span>
                                <span className="auth-tipo-descricao">Quero gerenciar meus estacionamentos.</span>
                            </button>
                        </div>
                    </div>

                    <div className="auth-campo">
                        <label htmlFor="nome">Nome completo</label>
                        <Input
                            id="nome"
                            placeholder="Seu nome completo"
                            value={formulario.nome}
                            onChange={handleChange("nome")}
                            required
                        />
                    </div>

                    <div className="auth-linha">
                        <div className="auth-campo">
                            <label htmlFor="email">E-mail</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="voce@email.com"
                                value={formulario.email}
                                onChange={handleChange("email")}
                                required
                            />
                        </div>

                        <div className="auth-campo">
                            <label htmlFor="cpf">CPF</label>
                            <Input
                                id="cpf"
                                type="text"
                                placeholder="000.000.000-00"
                                value={formulario.cpf}
                                onChange={handleChange("cpf")}
                                maxLength={14}
                                required
                            />
                        </div>

                    </div>

                    <div className="auth-linha">
                        <div className="auth-campo auth-campo-senha">
                            <label htmlFor="senha">Senha</label>

                            <div className="auth-input-senha">
                                <Input
                                    id="senha"
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formulario.senha}
                                    onChange={handleChange("senha")}
                                    required
                                />

                                <button
                                    type="button"
                                    className="auth-btn-olho"
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                >
                                    {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="auth-campo auth-campo-senha">
                            <label htmlFor="confirmarSenha">Confirmar senha</label>

                            <div className="auth-input-senha">
                                <Input
                                    id="confirmarSenha"
                                    type={mostrarConfirmarSenha ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formulario.confirmarSenha}
                                    onChange={handleChange("confirmarSenha")}
                                    required
                                />

                                <button
                                    type="button"
                                    className="auth-btn-olho"
                                    onClick={() =>
                                        setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                                    }
                                >
                                    {mostrarConfirmarSenha ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="auth-campo">
                        <label htmlFor="logradouro">Logradouro</label>
                        <Input
                            id="logradouro"
                            placeholder="Rua, avenida..."
                            value={formulario.logradouro}
                            onChange={handleChange("logradouro")}
                            required
                        />
                    </div>

                    <div className="auth-linha">
                        <div className="auth-campo">
                            <label htmlFor="bairro">Bairro</label>
                            <Input
                                id="bairro"
                                value={formulario.bairro}
                                onChange={handleChange("bairro")}
                                required
                            />
                        </div>

                        <div className="auth-campo">
                            <label htmlFor="numero">Número</label>
                            <Input
                                id="numero"
                                type="number"
                                value={formulario.numero}
                                onChange={handleChange("numero")}
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-linha">
                        <div className="auth-campo">
                            <label htmlFor="complemento">Complemento (opcional)</label>
                            <Input
                                id="complemento"
                                value={formulario.complemento}
                                onChange={handleChange("complemento")}
                            />
                        </div>

                        <div className="auth-campo">
                            <label htmlFor="cidade_id">Cidade</label>
                            <CidadeSelect
                                id="cidade_id"
                                required
                                onSelecionar={handleSelecionarCidade}
                            />
                        </div>
                    </div>

                    {erro && <Text className="auth-erro">{erro}</Text>}

                    <Button type="submit" disabled={carregando}>
                        {carregando ? "Criando conta..." : "Criar conta"}
                    </Button>

                    <Text className="auth-rodape">
                        Já tem conta? <Link to="/login">Entrar</Link>
                    </Text>
                </form>

            </div>
        </Container>
    )
}
