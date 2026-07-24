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

export default {
    cadastrarReserva,
    cancelarReserva,
    listarTodasReservas,
}