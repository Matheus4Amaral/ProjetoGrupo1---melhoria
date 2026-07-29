import { useEffect } from 'react'

import './styles.css'

export default function ConfirmacaoModal({
    isOpen,
    titulo = 'Confirmar ação',
    mensagem,
    textoConfirmar = 'Confirmar',
    textoCancelar = 'Cancelar',
    variante = 'primaria',
    onConfirm,
    onClose,
}) {
    useEffect(() => {
        if (!isOpen) {
            return
        }

        function handleTecla(evento) {
            if (evento.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleTecla)

        return () => window.removeEventListener('keydown', handleTecla)
    }, [isOpen, onClose])

    if (!isOpen) {
        return null
    }

    return (
        <div className="confirmacao-backdrop" onClick={onClose}>
            <div
                className="confirmacao-container"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirmacao-titulo"
                onClick={(evento) => evento.stopPropagation()}
            >
                <div className="confirmacao-header">
                    <h3 id="confirmacao-titulo">{titulo}</h3>
                </div>

                <div className="confirmacao-body">
                    <p>{mensagem}</p>
                </div>

                <div className="confirmacao-footer">
                    <button
                        type="button"
                        className="confirmacao-btn confirmacao-btn--cancelar"
                        onClick={onClose}
                    >
                        {textoCancelar}
                    </button>
                    <button
                        type="button"
                        className={`confirmacao-btn confirmacao-btn--${variante}`}
                        onClick={onConfirm}
                        autoFocus
                    >
                        {textoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    )
}
