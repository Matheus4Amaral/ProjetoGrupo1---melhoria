const db = require('../../../database/connection')

class TurnoRepository {
    async cadastrarTurno(dados){
        const [turno] = await db("turno")
            .insert(dados)
            .returning("*")

        return turno
    }

    async buscarTurnoPorId(id){
        const turno = await db("turno")
            .where({ id: id })
            .first()

        return turno
    }

    async listarTodosTurnos(){
        return await db("turno")
            .select("*")
    }

    async editarTurno(id, dados){
        const [turno] = await db("turno")
            .where({ id: id })
            .update({
                ...dados,
                atualizado_em: db.fn.now()
            })
            .returning("*")

        return turno
    }

    async excluirTurno(id) {
        const [turno] = await db("turno")
            .where({ id: id })
            .del()
            .returning("*")

        return turno
    }

    async verificaTurnoEmUso(id){
        const pessoa = await db("pessoa")
            .where({ id_turno: id })
            .first()

        return !!pessoa
    }
}

module.exports = new TurnoRepository()