import api from './api'

async function cadastrarPiso(dados) {
    return await api.post('/pisos', dados)
}

async function listarTodosPisos() {
    return await api.get('/pisos')
}

async function listarPorEstacionamento(estacionamentoId) {
    return await api.get(`/pisos/estacionamento/${estacionamentoId}`)
}

async function buscarPisoPorId(id) {
    return await api.get(`/pisos/${id}`)
}

async function buscarPisoPorCodigo(codigo) {
    return await api.get(`/pisos/codigo/${codigo}`)
}

async function buscarPisoPorAndar(andar) {
    return await api.get(`/pisos/andar/${andar}`)
}

async function editarPiso(id, dados) {
    return await api.put(`/pisos/${id}`, dados)
}

async function excluirPiso(id) {
    return await api.delete(`/pisos/${id}`)
}

export default {
    cadastrarPiso,
    listarTodosPisos,
    listarPorEstacionamento,
    buscarPisoPorId,
    buscarPisoPorCodigo,
    buscarPisoPorAndar,
    editarPiso,
    excluirPiso,
}
