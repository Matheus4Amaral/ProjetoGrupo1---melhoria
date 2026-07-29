import React, { useState, useEffect } from 'react';
import './styles.css';
import Button from '../Button';
import Input from '../Input';
import autenticacaoService from '../../services/autenticacaoService';

export default function ConfirmacaoSenhaModal({ isOpen, onClose, onConfirm, titulo, mensagem }) {
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSenha('');
            setErro('');
            setCarregando(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    async function handleConfirmar(e) {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            await autenticacaoService.verificarSenha(senha);
            onConfirm();
            onClose();
        } catch (error) {
            setErro(error.response?.data?.erro || error.message || 'Senha incorreta.');
            setCarregando(false);
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <div className="modal-header">
                    <h3>{titulo || 'Confirmação Necessária'}</h3>
                    <button type="button" className="modal-close" onClick={onClose} disabled={carregando}>&times;</button>
                </div>
                
                <form onSubmit={handleConfirmar}>
                    <div className="modal-body">
                        <p>{mensagem || 'Por favor, insira sua senha para confirmar esta ação.'}</p>
                        
                        <div className="modal-input-group">
                            <label htmlFor="senha_confirmacao">Sua senha</label>
                            <Input 
                                id="senha_confirmacao"
                                type="password" 
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        {erro && <div className="modal-erro">{erro}</div>}
                    </div>

                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="modal-btn-cancelar" 
                            onClick={onClose}
                            disabled={carregando}
                        >
                            Cancelar
                        </button>
                        <Button type="submit" disabled={carregando || !senha}>
                            {carregando ? 'Verificando...' : 'Confirmar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
