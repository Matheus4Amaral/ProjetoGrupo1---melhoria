import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import '../styles.css'

import Container from '@/components/Container'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Text from '@/components/Text'

import Logo from '@/assets/logo.png'
import { useAuth } from '@/context/AuthContext'
import useMensagemTemporaria from '@/hooks/useMensagemTemporaria'

export default function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuth()

    const [formulario, setFormulario] = useState({ email: "", senha: "" })
    const [erro, setErro] = useState("")
    const [sucesso, setSucesso] = useMensagemTemporaria(
        location.state?.cadastroConcluido ? "Conta criada com sucesso! Faça login para continuar." : ""
    )
    const [carregando, setCarregando] = useState(false)

    function handleChange(campo) {
        return (e) => setFormulario((atual) => ({ ...atual, [campo]: e.target.value }))
    }

    async function handleLogin(e) {
        e.preventDefault()
        setErro("")
        setSucesso("")
        setCarregando(true)

        try {
            const pessoa = await login(formulario)
            const ehGerente = pessoa.tipo === "gerente" || pessoa.is_admin
            if (ehGerente) {
                navigate("/admin/dashboard")
            } else {
                navigate("/motorista")
            }
        } catch (error) {
            setErro(error.message)
        } finally {
            setCarregando(false)
        }
    }

    return (
        <Container>
            <div className="auth-card">

                <div className="auth-brand">
                    <div className="auth-brand-logo">
                        <img src={Logo} alt="HubParking" />
                        <span>HubParking</span>
                    </div>

                    <div className="auth-brand-bars">
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                    </div>

                    <Text className="auth-brand-titulo">
                        Cada vaga, monitorada em tempo real.
                    </Text>

                    <Text className="auth-brand-subtitulo">
                        Controle de pisos, turnos e veículos em um único painel — do talão de entrada ao fechamento de caixa.
                    </Text>
                </div>

                <form className="auth-form" onSubmit={handleLogin}>
                    <span className="auth-eyebrow">Acesso ao sistema</span>

                    <Text className="auth-titulo">
                        Bem-vindo de volta
                    </Text>

                    <Text className="auth-subtitulo">
                        Entre com suas credenciais para continuar.
                    </Text>

                    <div className="auth-campo">
                        <label htmlFor="email">E-mail</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seuemail@gmail.com"
                            value={formulario.email}
                            onChange={handleChange("email")}
                            required
                        />
                    </div>

                    <div className="auth-campo">
                        <label htmlFor="senha">Senha</label>
                        <Input
                            id="senha"
                            type="password"
                            placeholder="••••••••"
                            value={formulario.senha}
                            onChange={handleChange("senha")}
                            required
                        />
                    </div>

                    {sucesso && <Text className="auth-sucesso">{sucesso}</Text>}
                    {erro && <Text className="auth-erro">{erro}</Text>}

                    <Button type="submit" disabled={carregando}>
                        {carregando ? "Entrando..." : "Entrar"}
                    </Button>

                    <Text className="auth-rodape">
                        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
                    </Text>
                </form>

            </div>
        </Container>
    )
}
