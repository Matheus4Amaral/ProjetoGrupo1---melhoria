import "./ConfirmModal.css"

export default function ConfirmModal({
    aberto,
    titulo = "Confirmar ação",
    mensagem,
    textoConfirmar = "Confirmar",
    textoCancelar = "Cancelar",
    onConfirmar,
    onCancelar,
}) {
    if (!aberto) return null

    function handleOverlayClick(e) {
        if (e.target === e.currentTarget) {
            onCancelar()
        }
    }

    return (
        <div className="confirm-modal-overlay" onClick={handleOverlayClick}>
            <div className="confirm-modal" role="dialog" aria-modal="true">
                <h2 className="confirm-modal-titulo">{titulo}</h2>
                <p className="confirm-modal-mensagem">{mensagem}</p>

                <div className="confirm-modal-acoes">
                    <button className="confirm-modal-btn confirm-modal-btn--cancelar" onClick={onCancelar}>
                        {textoCancelar}
                    </button>
                    <button className="confirm-modal-btn confirm-modal-btn--confirmar" onClick={onConfirmar}>
                        {textoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    )
}