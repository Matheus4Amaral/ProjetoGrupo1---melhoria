const TurnoService = require('../service/TurnoService')

class TurnoController {
    async cadastrarTurno(req, res){
        try {
            const turno = await TurnoService.cadastrasTurno(req.body)

            return res.status(200).json(turno)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async buscarTurnoPorId(req, res){
        try {
            const turno = await TurnoService.buscarTurnoPorId(
                req.params.id
            )

            return res.status(200).json(turno)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async listarTodosTurnos(req, res){
        try {
            const turnos = await TurnoService.litarTodosTurno()

            return res.status(200).json(turnos)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async editarTurno(req, res){
        try {
            const turno = await TurnoService.editarTurno(
                req.params.id,
                req.body
            )

            return res.status(200).json(turno)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async excluirTurno(req, res){
        try {
            const turno = await TurnoService.excluirTurno(
                req.params.id
            )

            return res.status(200).json(turno)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }
}

module.exports = new TurnoController()