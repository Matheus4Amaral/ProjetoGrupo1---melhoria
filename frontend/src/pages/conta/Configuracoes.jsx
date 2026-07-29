import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import "./Configuracoes.css";

import Button from "../../components/Button";
import Input from "../../components/Input";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import Toast from "../../components/Toast/Toast";

import { useAuth } from "../../context/AuthContext";
import pessoaService from "../../services/pessoaService";

function checklistSenha(senha) {
    return {
        tamanho: senha.length >= 8,
        numero: /[0-9]/.test(senha),
        especial: /[^A-Za-z0-9]/.test(senha),
    };
}

export default function Configuracoes() {
    const { usuario, atualizarUsuario } = useAuth();

    const [form, setForm] = useState({
        nome: usuario?.nome || "",
        email: usuario?.email || "",
        senhaAtual: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [showSenhaAtual, setShowSenhaAtual] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);

    const querTrocarSenha = form.newPassword.length > 0 || form.confirmNewPassword.length > 0;
    const requisitosSenha = checklistSenha(form.newPassword);

    function handleChange(campo) {
        return (e) => setForm((atual) => ({ ...atual, [campo]: e.target.value }));
    }

    function montarMensagemConfirmacao() {
        const alteracoes = [];

        if (form.nome.trim() !== (usuario?.nome || "")) {
            alteracoes.push(`o nome para "${form.nome.trim()}"`);
        }

        if (form.email.trim() !== (usuario?.email || "")) {
            alteracoes.push(`o e-mail para "${form.email.trim()}"`);
        }

        if (querTrocarSenha) {
            alteracoes.push("a sua senha de acesso");
        }

        if (alteracoes.length === 0) {
            return "Nenhuma alteração foi feita nos seus dados.";
        }

        return `Tem certeza que deseja alterar ${alteracoes.join(" e ")}?`;
    }

    function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        setSucesso("");

        if (!form.nome.trim() || !form.email.trim()) {
            setErro("Nome e e-mail são obrigatórios.");
            return;
        }

        if (querTrocarSenha) {
            if (form.newPassword !== form.confirmNewPassword) {
                setErro("As senhas não coincidem.");
                return;
            }

            if (!requisitosSenha.tamanho || !requisitosSenha.numero || !requisitosSenha.especial) {
                setErro("A nova senha deve ter no mínimo 8 caracteres, incluindo 1 número e 1 caractere especial.");
                return;
            }

            if (!form.senhaAtual) {
                setErro("Informe sua senha atual para definir uma nova senha.");
                return;
            }
        }

        setModalAberto(true);
    }

    async function confirmarSalvar() {
        setModalAberto(false);
        setSalvando(true);
        setErro("");
        setSucesso("");

        try {
            const dados = {
                nome: form.nome.trim(),
                email: form.email.trim(),
            };

            if (querTrocarSenha) {
                dados.senha = form.newPassword;
                dados.senhaAtual = form.senhaAtual;
            }

            const pessoaAtualizada = await pessoaService.editar(usuario.id, dados);

            atualizarUsuario(pessoaAtualizada);
            setForm((atual) => ({
                ...atual,
                senhaAtual: "",
                newPassword: "",
                confirmNewPassword: "",
            }));
            setSucesso("Dados atualizados com sucesso!");
        } catch (error) {
            setErro(error.message);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <section className="screen active" id="screen-configuracoes">
                <div className="config-card">

                    <div className="config-card-head"></div>
                    <div>
                        <h3>Configurações da conta</h3>
                        <div className="hint">
                            Atualize as informações da sua conta.
                        </div>
                    </div>
                </div>

                <form className="config-form" onSubmit={handleSubmit}>

                    <div className="config-linha">
                        <div className="config-campo">
                            <label htmlFor="nome">Nome</label>
                            <Input
                                id="nome"
                                placeholder="Seu nome Completo"
                                value={form.nome}
                                onChange={handleChange("nome")}
                                required
                            />
                        </div>
                        <div className="config-campo">
                            <label htmlFor="email">E-mail</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="voce@email.com"
                                value={form.email}
                                onChange={handleChange("email")}
                                required
                            />
                        </div>
                    </div>

                    <div className="config-secao-titulo"> Alterar senha (opcional) </div>

                    <div className="config-linha">
                        <div className="config-campo">
                            <div className="showPassword">
                                <label htmlFor="senhaAtual">Senha atual</label>
                                <Input
                                    id="senhaAtual"
                                    type={showSenhaAtual ? "text" : "password"}
                                    placeholder="Digite sua senha atual"
                                    value={form.senhaAtual}
                                    onChange={handleChange("senhaAtual")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                                    className="btn-eye"
                                >
                                    <span key={showSenhaAtual ? "open" : "closed"} className="eye-icon-wrapper">
                                        {showSenhaAtual ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </span>
                                </button>
                            </div>
                            <div className="hint">Necessária apenas se você for definir uma nova senha.</div>
                        </div>
                    </div>


                    <div className="config-linha">
                        <div className="config-campo">
                            <div className="showPassword">
                                <label htmlFor="newPassword">Nova Senha</label>
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Deixe em branco para manter a atual"
                                    value={form.newPassword}
                                    onChange={handleChange("newPassword")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="btn-eye"
                                >
                                    <span key={showNewPassword ? "open" : "closed"} className="eye-icon-wrapper">
                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </span>
                                </button>
                            </div>

                            {querTrocarSenha && (
                                <ul className="senha-requisitos">
                                    <li className={requisitosSenha.tamanho ? "ok" : ""}>Mínimo de 8 caracteres</li>
                                    <li className={requisitosSenha.numero ? "ok" : ""}>Pelo menos 1 número</li>
                                    <li className={requisitosSenha.especial ? "ok" : ""}>Pelo menos 1 caractere especial</li>
                                </ul>
                            )}
                        </div>

                        <div className="config-campo">
                            <div className="showPassword">
                                <label htmlFor="confirmNewPassword">Confirmar nova senha</label>
                                <Input
                                    id="confirmNewPassword"
                                    type={showConfirmNewPassword ? "text" : "password"}
                                    placeholder="Repita a nova senha"
                                    value={form.confirmNewPassword}
                                    onChange={handleChange("confirmNewPassword")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                    className="btn-eye"
                                >
                                    <span key={showConfirmNewPassword ? "open" : "closed"} className="eye-icon-wrapper">
                                        {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="config-acoes">
                        <Button type="submit" disabled={salvando}>
                            {salvando ? "Salvando..." : "Salvar alterações"}
                        </Button>
                    </div>

                </form>

            </section>

            <Toast
                aberto={Boolean(erro || sucesso)}
                mensagem={erro || sucesso}
                tipo={erro ? "erro" : "sucesso"}
                onFechar={() => {
                    setErro("");
                    setSucesso("");
                }}
            />

            <ConfirmModal
                aberto={modalAberto}
                titulo="Confirmar alterações"
                mensagem={montarMensagemConfirmacao()}
                textoConfirmar={salvando ? "Salvando..." : "Sim, salvar"}
                textoCancelar="Cancelar"
                onConfirmar={confirmarSalvar}
                onCancelar={() => setModalAberto(false)}
            />
        </>
    );
}
