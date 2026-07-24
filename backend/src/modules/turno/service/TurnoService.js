const TurnoRepository = require('../repository/TurnoRepository')

class TurnoService{
    async cadastrasTurno(dados){
        return await TurnoRepository.cadastrarTurno(dados) 
    }

    async buscarTurnoPorId(id){
        return await TurnoRepository.buscarTurnoPorId(id)
    }

    async litarTodosTurno(){
        return await TurnoRepository.listarTodosTurnos()
    }

    async editarTurno(id, dados){
        const turnoExistente = await TurnoRepository.buscarTurnoPorId(id)

        if(!turnoExistente) {
            throw new Error("Ops! Parece que o esse turno não existe.")
        }

        return TurnoRepository.editarTurno(id, dados)
    }

    async excluirTurno(id){
        const turnoExistente = await TurnoRepository.buscarTurnoPorId(id)

        if(!turnoExistente) {
            throw new Error("Ops! Parece que esse turno não existe.")
        }

        const turnoEmUso = await TurnoRepository.verificaTurnoEmUso(id)

        if(turnoEmUso) {
            throw new Error("Ops! Este turno está vinculado a uma pessoa e não pode ser excluído.")
        }

        return TurnoRepository.excluirTurno(id)
    }

}

module.exports = new TurnoService()