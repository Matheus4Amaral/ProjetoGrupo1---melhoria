import api from './api'

class VeiculoVagaService {
    async buscarOcupacaoAtiva() {
        const resposta = await api.get('/veiculo-vaga/ativa/me')
        return resposta
    }

    async registrarSaida(id) {
        const resposta = await api.put(`/veiculo-vaga/saida/${id}`)
        return resposta
    }
}

export default new VeiculoVagaService()
