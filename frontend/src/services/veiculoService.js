import api from './api'

async function cadastrarVeiculo(dados) {
    return await api.post('/veiculo', dados)
}

async function listarTodosVeiculos() {
    return await api.get('/veiculo')
}

async function buscarVeiculoPorId(id) {
    return await api.get(`/veiculo/${id}`)
}

async function buscarVeiculoPorPlaca(placa) {
    return await api.get(`/veiculo/placa/${placa}`)
}

async function editarVeiculo(id, dados) {
    return await api.put(`/veiculo/${id}`, dados)
}

async function deletarVeiculo(id) {
    return await api.delete(`/veiculo/${id}`)
}

export default {
    cadastrarVeiculo,
    listarTodosVeiculos,
    buscarVeiculoPorId,
    buscarVeiculoPorPlaca,
    editarVeiculo,
    deletarVeiculo,
}