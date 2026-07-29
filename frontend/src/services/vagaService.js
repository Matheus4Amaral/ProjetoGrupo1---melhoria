import api from './api'

async function cadastrarVaga(dados) {
    return await api.post('/vagas', dados)
}

async function listarTodasVagas() {
    return await api.get('/vagas')
}

async function buscarVagaPorId(id) {
    return await api.get(`/vagas/${id}`)
}

async function buscarVagaPorPisoId(pisoId) {
    return await api.get(`/vagas/piso/${pisoId}`)
}

async function buscarVagasPorEstacionamentoId(estacionamentoId) {
    return await api.get(`/vagas/estacionamento/${estacionamentoId}`)
}

async function buscarVagasDesocupadas() {
    return await api.get('/vagas/desocupadas')
}

async function editarVaga(id, dados) {
    return await api.put(`/vagas/${id}`, dados)
}

async function excluirVaga(id) {
    return await api.delete(`/vagas/${id}`)
}

export default {
    cadastrarVaga,
    listarTodasVagas,
    buscarVagaPorId,
    buscarVagaPorPisoId,
    buscarVagasPorEstacionamentoId,
    buscarVagasDesocupadas,
    editarVaga,
    excluirVaga,
}
