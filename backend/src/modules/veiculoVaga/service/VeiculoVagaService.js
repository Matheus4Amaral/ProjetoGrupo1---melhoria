const VeiculoVagaRepository = require('../repository/VeiculoVagaRepository')
const VeiculoRepository = require('../../veiculo/repository/VeiculoRepository')
const VagaRepository = require('../../vaga/repository/VagaRepository')

class VeiculoVagaService {

    async estacionarVeiculo(dados) {
        const { veiculo_id, vaga_id } = dados

        const veiculo = await VeiculoRepository.buscarVeiculoPorId(veiculo_id)
        if (!veiculo) {
            throw new Error("Este veículo não foi encontrado.")
        }

        const vaga = await VagaRepository.buscarVagaPorId(vaga_id)
        if (!vaga) {
            throw new Error("Esta vaga não foi encontrada.")
        }

        if (vaga.is_ocupada) {
            throw new Error("Esta vaga já está ocupada.")
        }

        const ocupacaoAtiva = await VeiculoVagaRepository.buscarOcupacaoAtivaPorVeiculoId(veiculo_id)
        if (ocupacaoAtiva) {
            throw new Error("Este veículo já está estacionado em outra vaga.")
        }

        const registro = await VeiculoVagaRepository.estacionarVeiculo({
            veiculo_id,
            vaga_id,
            estacionado_em: new Date()
        })

        await VagaRepository.editarVaga(vaga_id, { is_ocupada: true })

        return registro
    }

    async registrarSaida(id) {
        const registro = await VeiculoVagaRepository.buscarPorId(id)

        if (!registro) {
            throw new Error("Este registro de ocupação não foi encontrado.")
        }

        if (registro.desocupado_em) {
            throw new Error("Esta ocupação já foi encerrada.")
        }

        const registroAtualizado = await VeiculoVagaRepository.registrarSaida(id, new Date())

        await VagaRepository.editarVaga(registro.vaga_id, { is_ocupada: false })

        return registroAtualizado
    }

    async listarTodos() {
        return await VeiculoVagaRepository.listarTodos()
    }

    async listarMovimentacoesPorEstacionamento(estacionamentoId) {
        return await VeiculoVagaRepository.listarMovimentacoesPorEstacionamentoId(estacionamentoId)
    }

    async buscarOcupacaoAtivaPorUsuario(pessoaId) {
        return await VeiculoVagaRepository.buscarOcupacaoAtivaPorPessoaId(pessoaId)
    }

    async buscarPorId(id) {
        const registro = await VeiculoVagaRepository.buscarPorId(id)

        if (!registro) {
            throw new Error("Este registro de ocupação não foi encontrado.")
        }

        return registro
    }

    async listarHistoricoPorVeiculo(veiculoId) {
        const veiculo = await VeiculoRepository.buscarVeiculoPorId(veiculoId)
        if (!veiculo) {
            throw new Error("Este veículo não foi encontrado.")
        }

        return await VeiculoVagaRepository.listarHistoricoPorVeiculoId(veiculoId)
    }

    async listarHistoricoPorVaga(vagaId) {
        const vaga = await VagaRepository.buscarVagaPorId(vagaId)
        if (!vaga) {
            throw new Error("Esta vaga não foi encontrada.")
        }

        return await VeiculoVagaRepository.listarHistoricoPorVagaId(vagaId)
    }
}

module.exports = new VeiculoVagaService()
