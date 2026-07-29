const db = require('../../../database/connection')

class VeiculoVagaRepository {

    async estacionarVeiculo(dados) {
        const [registro] = await db("veiculo_vaga")
            .insert(dados)
            .returning('*')

        return registro
    }

    async listarTodos() {
        return await db("veiculo_vaga")
            .select('*')
    }

    async listarMovimentacoesPorEstacionamentoId(estacionamentoId, limite = 8) {
        return await db("veiculo_vaga")
            .join("vaga", "vaga.id", "veiculo_vaga.vaga_id")
            .join("piso", "piso.id", "vaga.piso_id")
            .join("veiculo", "veiculo.id", "veiculo_vaga.veiculo_id")
            .where("piso.estacionamento_id", estacionamentoId)
            .select(
                "veiculo_vaga.id",
                "veiculo.placa",
                "vaga.nome as vaga_nome",
                "vaga.codigo as vaga_codigo",
                "piso.nome as piso_nome",
                "veiculo_vaga.estacionado_em",
                "veiculo_vaga.desocupado_em"
            )
            .orderBy("veiculo_vaga.estacionado_em", "desc")
            .limit(limite)
    }

    async buscarPorId(id) {
        return db("veiculo_vaga")
            .where({ id })
            .first()
    }

    async buscarOcupacaoAtivaPorVagaId(vagaId) {
        return db("veiculo_vaga")
            .where({ vaga_id: vagaId, desocupado_em: null })
            .first()
    }

    async buscarOcupacaoAtivaPorVeiculoId(veiculoId) {
        return db("veiculo_vaga")
            .where({ veiculo_id: veiculoId, desocupado_em: null })
            .first()
    }

    async buscarOcupacaoAtivaPorPessoaId(pessoaId) {
        return db("veiculo_vaga")
            .join("veiculo", "veiculo.id", "veiculo_vaga.veiculo_id")
            .join("vaga", "vaga.id", "veiculo_vaga.vaga_id")
            .join("piso", "piso.id", "vaga.piso_id")
            .where("veiculo.pessoa_id", pessoaId)
            .whereNull("veiculo_vaga.desocupado_em")
            .select(
                "veiculo_vaga.id",
                "veiculo.placa",
                "veiculo.marca",
                "veiculo.modelo",
                "vaga.nome as vaga_nome",
                "vaga.codigo as vaga_codigo",
                "piso.nome as piso_nome",
                "veiculo_vaga.estacionado_em"
            )
            .orderBy("veiculo_vaga.estacionado_em", "desc")
            .first()
    }

    async listarHistoricoPorVeiculoId(veiculoId) {
        return db("veiculo_vaga")
            .where({ veiculo_id: veiculoId })
            .select('*')
    }

    async listarHistoricoPorVagaId(vagaId) {
        return db("veiculo_vaga")
            .where({ vaga_id: vagaId })
            .select('*')
    }

    async registrarSaida(id, desocupadoEm) {
        const [registro] = await db("veiculo_vaga")
            .where({ id })
            .update({ desocupado_em: desocupadoEm })
            .returning('*')

        return registro
    }
}

module.exports = new VeiculoVagaRepository()
