import "./ModalConfirmacao.css"

export default function ModalConfirmacao({
    aberto,
    titulo,
    mensagem,
    onConfirmar,
    onCancelar,
}) {
    if (!aberto) return null

    return (
        <div className="modal-overlay">
            <div className="modal-confirmacao">

                <h2>{titulo}</h2>

                <p>{mensagem}</p>

                <div className="modal-botoes">

                    <button
                        className="btn-cancelar"
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>

                    <button
    className="modal-confirmar"
    onClick={onConfirmar}
>
    Sim, sair
</button>

                </div>

            </div>
        </div>
    )
}