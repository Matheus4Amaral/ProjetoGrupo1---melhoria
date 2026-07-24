const db = require('../../../database/connection')

class PisoRepository{
    async criarPiso(dados) {
        const [piso] = await db("piso")
            .insert(dados)
            .returning('*')
    
        return piso
    }

    async listarTodosPisos() {
        return await db("piso")
            .join("estacionamento", "estacionamento.id", "piso.estacionamento_id")
            .select(
                "piso.id",
                "piso.codigo",
                "piso.nome",
                "piso.andar",
                "piso.vagas",
                "piso.estacionamento_id",
                "estacionamento.nome as estacionamento_nome",
                "piso.criado_em",
                "piso.atualizado_em"
            )
            .orderBy("estacionamento.nome")
            .orderBy("piso.andar")
    }

    async buscarPisoPorId(id){
        return db("piso")
            .where({ id })
            .first()
    }

    async buscarPisosPorEstacionamentoId(estacionamentoId){
        return await db("piso")
            .join("estacionamento", "estacionamento.id", "piso.estacionamento_id")
            .where("piso.estacionamento_id", estacionamentoId)
            .select(
                "piso.id",
                "piso.codigo",
                "piso.nome",
                "piso.andar",
                "piso.vagas",
                "piso.estacionamento_id",
                "estacionamento.nome as estacionamento_nome",
                "piso.criado_em",
                "piso.atualizado_em"
            )
            .orderBy("piso.andar")
    }

    async buscarPisoPorCodigo(codigo) {
        return db("piso")
            .where({ codigo })
            .first()
    }

    async buscarPisoPorAndar(andar){
        return db("piso")
            .where({ andar })
            .select("*")
    }

    async editarPiso(id, dados){
        const [piso] = await db("piso")
            .where({ id })
            .update({
                ...dados,
                atualizado_em: db.fn.now()
            })
            .returning("*")

        return piso
    }

    async excluirPiso(id){
        await db("piso")
            .where({ id })
            .del()
    }
}

module.exports = new PisoRepository()