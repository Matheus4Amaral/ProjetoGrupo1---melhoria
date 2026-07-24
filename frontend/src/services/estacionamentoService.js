import api from './api'

async function cadastrar(dadosEstacionamento) {
    return await api.post('/estacionamentos', dadosEstacionamento)
}

async function listarTodos() {
    return await api.get('/estacionamentos')
}

async function listarPorGerente(pessoaId) {
    return await api.get(`/estacionamentos/gerente/${pessoaId}`)
}

async function listarComDisponibilidade() {
    return await api.get('/estacionamentos/disponibilidade')
}

async function buscarPorId(id) {
    return await api.get(`/estacionamentos/id/${id}`)
}

async function buscarPorCnpj(cnpj) {
    return await api.get(`/estacionamentos/cnpj/${cnpj}`)
}

async function editar(id, dadosEstacionamento) {
    return await api.put(`/estacionamentos/${id}`, dadosEstacionamento)
}

async function excluir(id) {
    return await api.delete(`/estacionamentos/Excluir/${id}`)
}

export default {
    cadastrar,
    listarTodos,
    listarPorGerente,
    listarComDisponibilidade,
    buscarPorId,
    buscarPorCnpj,
    editar,
    excluir,
}