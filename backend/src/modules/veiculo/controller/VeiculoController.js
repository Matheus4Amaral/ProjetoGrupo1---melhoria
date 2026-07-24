const VeiculoService = require('../services/VeiculoService')

class VeiculoController {

    async cadastrarVeiculo(req, res) {
        try {
            const veiculo = await VeiculoService.cadastrarVeiculo(req.body)

            return res.status(201).json(veiculo)
        } catch (error) {
            
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async listarTodosVeiculos(req, res) {
        try {
            const veiculos = await VeiculoService.listarTodosVeiculos()

            return res.status(200).json(veiculos)
        } catch (error) {

            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async buscarVeiculoPorId(req, res) {
        try {
            const { id } = req.params

            const veiculo = await VeiculoService.buscarVeiculoPorId(id)

            return res.status(200).json(veiculo)
        } catch (error) {

            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async buscarVeiculoPorPlaca(req, res) {
        try {
            const { placa } = req.params

            const veiculo = await VeiculoService.buscarVeiculoPorPlaca(placa)

            return res.status(200).json(veiculo)
        } catch (error) {
            
            return res.status(404).json({
                erro: error.message
            })
        }
    }

    async editarVeiculo(req, res) {
        try {
            const { id } = req.params

            const veiculo = await VeiculoService.editarVeiculo(id, req.body)

            return res.status(200).json(veiculo)
        } catch (error) {
            
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async deletarVeiculo(req, res) {
        try {
            const { id } = req.params

            const veiculo = await VeiculoService.deletarVeiculo(id)

            return res.status(200).json({
                mensagem: "Veículo deletado com sucesso!"
            })
        } catch (error) {

            return res.status(400).json({
                erro: error.message
            })
        }
    }

}

module.exports = new VeiculoController()