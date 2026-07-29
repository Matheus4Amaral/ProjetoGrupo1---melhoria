import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import "./Toast.css";

export default function Toast({
    aberto,
    mensagem,
    tipo = "erro",
    onFechar,
    duracao = 4000,
}) {
    useEffect(() => {
        if (!aberto) return;

        const timer = setTimeout(() => {
            onFechar();
        }, duracao);

        return () => clearTimeout(timer);
    }, [aberto, mensagem, duracao, onFechar]);

    if (!aberto) return null;

    return (
        <div className={`toast toast--${tipo}`} role="status">
            {tipo === "sucesso" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <span className="toast-mensagem">{mensagem}</span>
            <button
                type="button"
                className="toast-fechar"
                onClick={onFechar}
                aria-label="Fechar"
            >
                ×
            </button>
        </div>
    );
}
