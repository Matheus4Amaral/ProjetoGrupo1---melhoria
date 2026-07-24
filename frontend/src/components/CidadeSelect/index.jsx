import { useRef, useState } from "react"

import "./styles.css"

import cidadeService from "../../services/cidadeService"

const ATRASO_BUSCA_MS = 350
const TAMANHO_MINIMO_BUSCA = 2

export default function CidadeSelect({
    id,
    placeholder = "Digite o nome da sua cidade...",
    required = false,
    valorInicial = "",
    onSelecionar,
}) {
    const [termo, setTermo] = useState(valorInicial)
    const [opcoes, setOpcoes] = useState([])
    const [aberto, setAberto] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const timeoutBuscaRef = useRef(null)

    function buscar(valor) {
        clearTimeout(timeoutBuscaRef.current)

        if (valor.trim().length < TAMANHO_MINIMO_BUSCA) {
            setOpcoes([])
            setCarregando(false)
            return
        }

        setCarregando(true)

        timeoutBuscaRef.current = setTimeout(async () => {
            try {
                const resultado = await cidadeService.buscarCidades(valor.trim())
                setOpcoes(resultado)
            } catch {
                setOpcoes([])
            } finally {
                setCarregando(false)
            }
        }, ATRASO_BUSCA_MS)
    }

    function handleChange(e) {
        const valor = e.target.value
        setTermo(valor)
        setAberto(true)
        onSelecionar(null)
        buscar(valor)
    }

    function handleSelecionar(cidade) {
        setTermo(`${cidade.nome} - ${cidade.uf}`)
        setOpcoes([])
        setAberto(false)
        onSelecionar(cidade)
    }

    function handleKeyDown(e) {
        if (e.key === "Escape") {
            setAberto(false)
        }
    }

    const mostrarLista = aberto && termo.trim().length >= TAMANHO_MINIMO_BUSCA

    return (
        <div className="cidade-select">
            <input
                id={id}
                className="input"
                type="text"
                autoComplete="off"
                placeholder={placeholder}
                value={termo}
                required={required}
                onChange={handleChange}
                onFocus={() => setAberto(true)}
                onBlur={() => setTimeout(() => setAberto(false), 150)}
                onKeyDown={handleKeyDown}
            />

            {mostrarLista && (
                <ul className="cidade-select-lista">
                    {carregando && (
                        <li className="cidade-select-info">Buscando...</li>
                    )}

                    {!carregando && opcoes.length === 0 && (
                        <li className="cidade-select-info">Nenhuma cidade encontrada</li>
                    )}

                    {!carregando && opcoes.map((cidade) => (
                        <li key={cidade.id}>
                            <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleSelecionar(cidade)}
                            >
                                {cidade.nome} <span>{cidade.uf}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
