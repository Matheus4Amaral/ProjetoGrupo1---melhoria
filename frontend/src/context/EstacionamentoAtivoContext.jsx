import { createContext, useCallback, useContext, useEffect, useState } from "react"

import estacionamentoService from "../services/estacionamentoService"
import { useAuth } from "./AuthContext"

const EstacionamentoAtivoContext = createContext(null)

const CHAVE_ATIVO = "hubparking:estacionamentoAtivo"

export function EstacionamentoAtivoProvider({ children }) {
    const { usuario } = useAuth()

    const [estacionamentos, setEstacionamentos] = useState([])
    const [estacionamentoAtivoId, setEstacionamentoAtivoId] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    const carregar = useCallback(async () => {
        if (!usuario?.id) {
            return
        }

        setCarregando(true)
        setErro("")

        try {
            const lista = await estacionamentoService.listarPorGerente(usuario.id)
            const dados = lista || []
            setEstacionamentos(dados)

            // Mantém o estacionamento salvo se ele ainda pertencer ao gerente;
            // caso contrário, cai no primeiro da lista.
            const salvo = localStorage.getItem(CHAVE_ATIVO)
            const aindaExiste = dados.some((e) => e.id === salvo)
            const proximoAtivo = aindaExiste ? salvo : (dados[0]?.id ?? null)

            setEstacionamentoAtivoId(proximoAtivo)

            if (proximoAtivo) {
                localStorage.setItem(CHAVE_ATIVO, proximoAtivo)
            } else {
                localStorage.removeItem(CHAVE_ATIVO)
            }
        } catch (error) {
            setErro(error.message)
        } finally {
            setCarregando(false)
        }
    }, [usuario?.id])

    useEffect(() => {
        carregar()
    }, [carregar])

    function selecionar(id) {
        setEstacionamentoAtivoId(id)
        if (id) {
            localStorage.setItem(CHAVE_ATIVO, id)
        }
    }

    const estacionamentoAtivo = estacionamentos.find((e) => e.id === estacionamentoAtivoId) || null

    return (
        <EstacionamentoAtivoContext.Provider
            value={{
                estacionamentos,
                estacionamentoAtivoId,
                estacionamentoAtivo,
                selecionar,
                carregando,
                erro,
                recarregar: carregar,
            }}
        >
            {children}
        </EstacionamentoAtivoContext.Provider>
    )
}

export function useEstacionamentoAtivo() {
    const context = useContext(EstacionamentoAtivoContext)

    if (!context) {
        throw new Error("useEstacionamentoAtivo precisa ser usado dentro de um EstacionamentoAtivoProvider")
    }

    return context
}
