const db = require("../../../database/connection")

class GerenteEstacionamentoRepository {
    async vincular(pessoaId, estacionamentoId) {
        const [vinculo] = await db("gerente_estacionamento")
            .insert({
                pessoa_id: pessoaId,
                estacionamento_id: estacionamentoId,
            })
            .returning("*")

        return vinculo
    }

    async removerVinculosPorEstacionamento(estacionamentoId) {
        return await db("gerente_estacionamento")
            .where({ estacionamento_id: estacionamentoId })
            .del()
    }

    async existeVinculo(pessoaId, estacionamentoId) {
        const vinculo = await db("gerente_estacionamento")
            .where({ pessoa_id: pessoaId, estacionamento_id: estacionamentoId })
            .first()

        return Boolean(vinculo)
    }

    async listarEstacionamentosPorGerente(pessoaId) {
        return await db("gerente_estacionamento")
            .join("estacionamento", "estacionamento.id", "gerente_estacionamento.estacionamento_id")
            .join("cidade", "cidade.id", "estacionamento.cidade_id")
            .where("gerente_estacionamento.pessoa_id", pessoaId)
            .select(
                "estacionamento.id",
                "estacionamento.nome",
                "estacionamento.cnpj",
                "estacionamento.logradouro",
                "estacionamento.bairro",
                "estacionamento.numero",
                "estacionamento.email",
                "estacionamento.telefone",
                "estacionamento.ativo",
                "estacionamento.cidade_id",
                "cidade.nome as cidade_nome",
                "cidade.uf as cidade_uf",
                "estacionamento.criado_em",
                "estacionamento.atualizado_em"
            )
            .orderBy("estacionamento.nome")
    }
}

module.exports = new GerenteEstacionamentoRepository()
