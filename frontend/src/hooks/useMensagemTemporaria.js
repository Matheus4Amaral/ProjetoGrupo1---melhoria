import { useCallback, useEffect, useRef, useState } from "react"

const DURACAO_PADRAO = 4000

export default function useMensagemTemporaria(mensagemInicial = "", duracao = DURACAO_PADRAO) {
    const [mensagem, setMensagem] = useState(mensagemInicial)
    const temporizador = useRef(null)

    const limparTemporizador = useCallback(() => {
        if (temporizador.current) {
            clearTimeout(temporizador.current)
            temporizador.current = null
        }
    }, [])

    const agendarLimpeza = useCallback(() => {
        limparTemporizador()

        temporizador.current = setTimeout(() => {
            temporizador.current = null
            setMensagem("")
        }, duracao)
    }, [duracao, limparTemporizador])

    const definirMensagem = useCallback((novaMensagem) => {
        setMensagem(novaMensagem)

        if (novaMensagem) {
            agendarLimpeza()
        } else {
            limparTemporizador()
        }
    }, [agendarLimpeza, limparTemporizador])

    useEffect(() => {
        if (mensagemInicial) {
            agendarLimpeza()
        }

        return limparTemporizador
    }, [])

    return [mensagem, definirMensagem]
}
