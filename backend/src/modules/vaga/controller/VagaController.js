const VagaService = require('../service/VagaService')

class VagaController {
    async cadastrarVaga(req, res){
        try {
            const vaga = await VagaService.cadastrarVaga(req.body)

            return res.status(201).json(vaga)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async listarVagas(req, res){
        try {
            const vagas = await VagaService.listarVagas()

            return res.status(200).json(vagas)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async buscarVagaPorId(req, res){
        try {
            const vaga = await VagaService.buscarVagaPorId(
                req.params.id
            )

            return res.status(200).json(vaga)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async buscarVagaPorPisoId(req, res) {
        try {
            const vagas = await VagaService.buscarVagaPorPisoId(
                req.params.piso_id
            )

            return res.status(200).json(vagas)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async buscarVagasPorEstacionamentoId(req, res){
        try {
            const vagas = await VagaService.buscarVagasPorEstacionamentoId(
                req.params.estacionamento_id
            )

            return res.status(200).json(vagas)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async buscarVagasDesocupadas(req, res){
        try {
            const vagas = await VagaService.buscarVagasDesocupadas()

            return res.status(200).json(vagas)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async editarVaga(req, res){
        try {
            const vaga = await VagaService.editarVaga(
                req.params.id,
                req.body
            )

            return res.status(200).json(vaga)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async excluirVaga(req, res){
        try {
            await VagaService.excluirVaga(req.params.id)

            return res.status(200).json({
                sucesso: 'Vaga apagada com sucesso!'
            })
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }
}

module.exports = new VagaController()