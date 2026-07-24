const VeiculoRepository = require('../repository/VeiculoRepository')

class VeiculoService {
    
    async cadastrarVeiculo(dados) {
        const veiculoExistente = await VeiculoRepository.buscarVeiculoPorPlaca(dados.placa)

        if (veiculoExistente) {
            throw new Error('Ops! Parece que este veículo já está cadastrado')
        }

        return await VeiculoRepository.cadastrarVeiculo(dados)
    }

    async listarTodosVeiculos () {
        const veiculos = await VeiculoRepository.listarTodosVeiculos()

        return veiculos
    }

    async buscarVeiculoPorId(id) {
        const veiculo = await VeiculoRepository.buscarVeiculoPorId(id)

        if (!veiculo) {
            throw new Error("Ops! Este veículo não foi encontrado!")
        }

        return veiculo
    }

    async buscarVeiculoPorPlaca(placa) {
        const veiculo = await VeiculoRepository.buscarVeiculoPorPlaca(placa)

        if (!veiculo) {
            throw new Error('Ops! Este veículo não foi encontrado.')
        }

        return veiculo
    }

    async editarVeiculo(id, dadosVeiculo) {
        
        const veiculo = await VeiculoRepository.buscarVeiculoPorId(id)

        if (!veiculo) {
            throw new Error('Ops! Este veículo não foi encontrado.')
        }

        if (dadosVeiculo.placa && dadosVeiculo.placa !== veiculo.placa) {
            const veiculoPlacaExistente = await VeiculoRepository.buscarVeiculoPorPlaca(dadosVeiculo.placa)

            if(veiculoPlacaExistente) {
                throw new Error('Ops! Esta placa já está cadastrada para outro veículo.')
            }
        }
        
        dadosVeiculo.atualizado_em = new Date()

        await VeiculoRepository.editarVeiculo(id, dadosVeiculo)

        return await VeiculoRepository.buscarVeiculoPorId(id)
    }

    async deletarVeiculo (id) {
        const veiculo = await VeiculoRepository.buscarVeiculoPorId(id)

        if (!veiculo) {
            throw new Error('Ops! Este veículo não foi encontrado.')
        }

        await VeiculoRepository.deletarVeiculo(id) 
    }
}

module.exports = new VeiculoService()