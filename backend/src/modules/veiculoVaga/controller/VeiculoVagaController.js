const VeiculoVagaService = require('../service/VeiculoVagaService')

class VeiculoVagaController {

    async estacionarVeiculo(req, res) {
        try {
            const registro = await VeiculoVagaService.estacionarVeiculo(req.body)

            return res.status(201).json(registro)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async registrarSaida(req, res) {
        try {
            const { id } = req.params

            const registro = await VeiculoVagaService.registrarSaida(id)

            return res.status(200).json(registro)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async listarTodos(req, res) {
        try {
            const registros = await VeiculoVagaService.listarTodos()

            return res.status(200).json(registros)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params

            const registro = await VeiculoVagaService.buscarPorId(id)

            return res.status(200).json(registro)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async listarMovimentacoesPorEstacionamento(req, res) {
        try {
            const { estacionamento_id } = req.params

            const registros = await VeiculoVagaService.listarMovimentacoesPorEstacionamento(estacionamento_id)

            return res.status(200).json(registros)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async listarHistoricoPorVeiculo(req, res) {
        try {
            const { veiculo_id } = req.params

            const registros = await VeiculoVagaService.listarHistoricoPorVeiculo(veiculo_id)

            return res.status(200).json(registros)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async listarHistoricoPorVaga(req, res) {
        try {
            const { vaga_id } = req.params

            const registros = await VeiculoVagaService.listarHistoricoPorVaga(vaga_id)

            return res.status(200).json(registros)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }
}

module.exports = new VeiculoVagaController()
