import api from './api';

async function buscarPorId (id) {
    return await api.get(`/pessoa/${id}`)
}

async function editar(id,dadosPessoa) {
    return await api.put(`/pessoa/${id}`, dadosPessoa)
}

export default {
    buscarPorId,
    editar,
}