import { createContext, useContext, useState } from "react"

import autenticacaoService from '@/services/autenticacaoService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => autenticacaoService.obterUsuarioLogado())

    async function login(credenciais) {
        const pessoa = await autenticacaoService.login(credenciais)
        setUsuario(pessoa)
        return pessoa
    }

    function logout() {
        autenticacaoService.logout()
        setUsuario(null)
    }

    return (
        <AuthContext.Provider value={{ usuario, autenticado: Boolean(usuario), login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth precisa ser usado dentro de um AuthProvider")
    }

    return context
}
