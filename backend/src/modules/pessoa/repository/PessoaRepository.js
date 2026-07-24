const db = require('../../../database/connection')

class PessoaRepository {

    async cadastrarPessoa(dados) {
        const [pessoa] = await db('pessoa')
            .insert(dados)
            .returning([
                'id',
                'nome',
                'email',
                'logradouro',
                'bairro',
                'numero',
                'complemento',
                'cidade_id',
                'cpf',
                'tipo',
                'is_admin',
                'id_turno',
                'estacionamento_id',
                'criado_em',
                'atualizado_em'
            ])

        return pessoa
    }

    async buscarPessoaPorCpf(cpf) {
        return await db('pessoa')
            .where({ cpf })
            .first()
    }

    async buscarPessoaPorEmail(email) {
        return await db('pessoa')
            .where({ email })
            .first()
    }

    async listarTodasPessoas() {
        return await db('pessoa')
            .select(
                'id',
                'nome',
                'email',
                'logradouro',
                'bairro',
                'numero',
                'complemento',
                'cidade_id',
                'cpf',
                'tipo',
                'is_admin',
                'id_turno',
                'estacionamento_id',
                'criado_em',
                'atualizado_em'
            )
    }

    async buscarPessoaPorId(id) {
        return await db('pessoa')
            .select(
                'id',
                'nome',
                'email',
                'logradouro',
                'bairro',
                'numero',
                'complemento',
                'cidade_id',
                'cpf',
                'tipo',
                'is_admin',
                'id_turno',
                'estacionamento_id',
                'criado_em',
                'atualizado_em'
            )
            .where({ id })
            .first()
    }

    async editarPessoa(id, dadosPessoa) {
        return await db('pessoa')
            .where({ id })
            .update(dadosPessoa)
    }

    async deletarPessoa(id) {
        return await db('pessoa')
            .where({ id })
            .del()
    }

}

module.exports = new PessoaRepository()