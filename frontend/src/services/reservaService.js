import api from './api'

async function estacionarVeiculo(veiculo_id, vaga_id) {
    return await api.post('/veiculo-vaga', { veiculo_id, vaga_id })
}

async function registrarSaida(id) {
    return await api.put(`/veiculo-vaga/saida/${id}`)
}

async function listarTodasOcupacoes() {
    return await api.get('/veiculo-vaga')
}

async function listarMovimentacoesPorEstacionamento(estacionamentoId) {
    return await api.get(`/veiculo-vaga/estacionamento/${estacionamentoId}`)
}

async function buscarOcupacaoPorId(id) {
    return await api.get(`/veiculo-vaga/${id}`)
}

async function listarHistoricoPorVeiculo(veiculoId) {
    return await api.get(`/veiculo-vaga/veiculo/${veiculoId}`)
}

async function listarHistoricoPorVaga(vagaId) {
    return await api.get(`/veiculo-vaga/vaga/${vagaId}`)
}

async function buscarOcupacaoAtivaPorVeiculo(veiculoId) {
    const historico = await listarHistoricoPorVeiculo(veiculoId)
    return historico.find((registro) => !registro.desocupado_em) || null
}

export default {
    estacionarVeiculo,
    registrarSaida,
    listarTodasOcupacoes,
    listarMovimentacoesPorEstacionamento,
    buscarOcupacaoPorId,
    listarHistoricoPorVeiculo,
    listarHistoricoPorVaga,
    buscarOcupacaoAtivaPorVeiculo,
}