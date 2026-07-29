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
            .leftJoin("pessoa", "pessoa.id", "veiculo.pessoa_id")
            .where("piso.estacionamento_id", estacionamentoId)
            .select(
                "veiculo_vaga.id",
                "veiculo.placa",
                "pessoa.nome as motorista_nome",
                "vaga.nome as vaga_nome",
                "vaga.codigo as vaga_codigo",
                "piso.nome as piso_nome",
                "veiculo_vaga.estacionado_em",
                "veiculo_vaga.desocupado_em"
            )
            .orderBy("veiculo_vaga.estacionado_em", "desc")
            .limit(limite);
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
