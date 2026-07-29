import api from './api'

async function cadastrarReserva(dados) {
    return await api.post('/reservas', dados)
}

async function cancelarReserva(id) {
    return await api.put(`/reservas/${id}/cancelar`)
}

async function listarTodasReservas() {
    return await api.get('/reservas')
}

async function buscarReservaAtiva() {
    return await api.get('/reservas/ativa/me')
}

export default {
    cadastrarReserva,
    cancelarReserva,
    listarTodasReservas,
    buscarReservaAtiva,
}