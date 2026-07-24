const db = require('../../../database/connection')

class VeiculoRepository {
    
    async cadastrarVeiculo(dados) {
        const [veiculo] = await db('veiculo')
            .insert(dados)
            .returning([
                'id',
                'placa',
                'modelo',
                'marca',
                'ano',
                'combustivel',
                'cor',
                'pessoa_id',
                'criado_em',
                'atualizado_em'
            ])
        return veiculo
    }

    async listarTodosVeiculos() {
        return await db('veiculo')
            .select(
                'id',
                'placa',
                'modelo',
                'marca',
                'ano',
                'combustivel',
                'cor',
                'pessoa_id',
                'criado_em',
                'atualizado_em'
            )
    }

    async buscarVeiculoPorId(id) {
        return await db('veiculo')
            .select(
                'id',
                'placa',
                'modelo',
                'marca',
                'ano',
                'combustivel',
                'cor',
                'pessoa_id',
                'criado_em',
                'atualizado_em'
            )
            .where({ id })
            .first()
    }

    async buscarVeiculoPorPlaca(placa) {
        return await db('veiculo')
            .select(
                'id',
                'placa',
                'modelo',
                'marca',
                'ano',
                'combustivel',
                'cor',
                'pessoa_id',
                'criado_em',
                'atualizado_em'
            )
            .where({ placa })
            .first()
    }

    async editarVeiculo(id, dadosVeiculo) {
        return await db('veiculo')
            .where({ id })
            .update(dadosVeiculo)
    }

    async deletarVeiculo(id) {
        return await db('veiculo')
            .where({ id })
            .del()
    }
}

module.exports = new VeiculoRepository()