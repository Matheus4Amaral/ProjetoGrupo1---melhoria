import api from './api'

async function cadastrarTurno(dados) {
    return await api.post('/turnos', dados)
}

async function listarTodosTurnos() {
    return await api.get('/turnos')
}

async function buscarTurnoPorId(id) {
    return await api.get(`/turnos/${id}`)
}

async function editarTurno(id, dados) {
    return await api.put(`/turnos/${id}`, dados)
}

async function excluirTurno(id) {
    return await api.delete(`/turnos/${id}`)
}

export default {
    cadastrarTurno,
    listarTodosTurnos,
    buscarTurnoPorId,
    editarTurno,
    excluirTurno,
}