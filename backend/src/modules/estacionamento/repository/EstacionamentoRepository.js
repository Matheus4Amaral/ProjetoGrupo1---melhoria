const db = require("../../../database/connection")

class EstacionamentoRepository {
    async criarEstacionamento(dados) {
        const [estacionamento] = await db("estacionamento")
            .insert(dados)
            .returning('*')

        return estacionamento
    }

    async listarTodosEstacionamentos() {
        return await db('estacionamento')
            .join('cidade', 'cidade.id', 'estacionamento.cidade_id')
            .select(
                'estacionamento.id',
                'estacionamento.nome',
                'estacionamento.cnpj',
                'estacionamento.logradouro',
                'estacionamento.bairro',
                'estacionamento.numero',
                'estacionamento.email',
                'estacionamento.telefone',
                'estacionamento.ativo',
                'estacionamento.cidade_id',
                'cidade.nome as cidade_nome',
                'cidade.uf as cidade_uf',
                'estacionamento.criado_em',
                'estacionamento.atualizado_em'
            )
            .orderBy('estacionamento.nome')
    }

    async listarEstacionamentosComDisponibilidade() {
        return await db('estacionamento')
            .join('cidade', 'cidade.id', 'estacionamento.cidade_id')
            .leftJoin('piso', 'piso.estacionamento_id', 'estacionamento.id')
            .leftJoin('vaga', 'vaga.piso_id', 'piso.id')
            .where('estacionamento.ativo', true)
            .groupBy('estacionamento.id', 'cidade.nome', 'cidade.uf')
            .select(
                'estacionamento.id',
                'estacionamento.nome',
                'estacionamento.logradouro',
                'estacionamento.bairro',
                'estacionamento.numero',
                'estacionamento.telefone',
                'cidade.nome as cidade_nome',
                'cidade.uf as cidade_uf',
                db.raw('COUNT(vaga.id)::int as total_vagas'),
                db.raw('COUNT(vaga.id) FILTER (WHERE vaga.is_ocupada = false AND vaga.em_manutencao = false)::int as vagas_livres')
            )
            .orderBy('estacionamento.nome')
    }

    async buscarEstacionamentoPorCnpj(cnpj){
        return await db('estacionamento')
            .where({ cnpj })
            .first()
    }

    async buscarEstacionamentoPorId(id){
        return await db('estacionamento')
            .join('cidade', 'cidade.id', 'estacionamento.cidade_id')
            .select(
                'estacionamento.*',
                'cidade.nome as cidade_nome',
                'cidade.uf as cidade_uf'
            )
            .where({ 'estacionamento.id': id })
            .first()
    }

    async editarEstacionamento(id, dados){
        const [estacionamento] = await db('estacionamento')
            .where({ id })
            .update({
                ...dados,
                atualizado_em: db.fn.now(),
            })
            .returning('*')

        return estacionamento
    }

    async excluirEstacionamento(id){
        return await db('estacionamento')
            .where({ id })
            .del()
    }
}

module.exports = new EstacionamentoRepository()