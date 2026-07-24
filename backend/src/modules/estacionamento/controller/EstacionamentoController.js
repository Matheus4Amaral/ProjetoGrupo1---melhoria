const EstacionamentoService = require('../service/EstacionamentoService')

class EstacionamentoController {
    async cadastrarEstacionamento(req, res) {
        try {
            const estacionamento = await EstacionamentoService.criarEstacionamento(req.body)

            return res.status(201).json(estacionamento)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }
    
    async listarEstacionamentos(req, res){
        try {
            const estacionamento = await EstacionamentoService.listarEstacionamentos()

            return res.status(200).json(estacionamento)
        } catch (error) {
            return res.status(500).json({
                erro: error.message
            })
        }
    }

    async listarEstacionamentosPorGerente(req, res){
        try {
            const estacionamentos = await EstacionamentoService.listarEstacionamentosPorGerente(
                req.params.pessoa_id
            )

            return res.status(200).json(estacionamentos)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async listarEstacionamentosComDisponibilidade(req, res){
        try {
            const estacionamentos = await EstacionamentoService.listarEstacionamentosComDisponibilidade()

            return res.status(200).json(estacionamentos)
        } catch (error) {
            return res.status(500).json({
                erro: error.message
            })
        }
    }

    async buscarEstacionamentoPorCnpj(req, res){
        try {
            const estacionamento = await EstacionamentoService.buscarEstacionamentoPorCnpj(
                req.params.cnpj
            )

            return res.status(200).json(estacionamento)
        } catch (error) {
            return res.status(404).json({
                erro: error.message
            })
        }
    }

    async buscarEstacionamentoPorId(req, res){
        try {
            const estacionamento = await EstacionamentoService.buscarEstacionamentoPorId(
                req.params.id
            )

            return res.status(200).json(estacionamento)
        } catch (error) {
            return res.status(404).json({
                erro: error.message
            })
        }
    }

    async editarEstacionamento(req, res){
        try {
            const estacionamento = await EstacionamentoService.editarEstacionamento(
                req.params.id,
                req.body
            )

            return res.status(200).json(estacionamento)
        } catch (error) {
            return res.status(404).json({
                erro: error.message
            })
        }
    }

    async excluirEstacionamento(req, res){
        try {
            const estacionamento = await EstacionamentoService.excluirEstacionamento(
                req.params.id
            )

            return res.status(200).json({
                sucesso: 'Estacionamento apagado com sucesso!'
            })
        } catch (error) {
            return res.status(500).json({
                erro: error.message
            })
        }
    }
}

module.exports = new EstacionamentoController()