const PessoaRepository = require('../repository/PessoaRepository')
const bcrypt = require('bcrypt')

class PessoaService {

    async cadastrarPessoa(dados) {
        if (!dados.senha) {
            throw new Error("A senha é obrigatória para o cadastro.")
        }
        if (!dados.nome || !dados.email || !dados.cpf) {
            throw new Error("Nome, E-mail e CPF são obrigatórios.")
        }

        const pessoaCpfExistente = await PessoaRepository.buscarPessoaPorCpf(dados.cpf)
        if (pessoaCpfExistente) {
            throw new Error("Ops! Parece que já existe uma pessoa cadastrada com esse CPF!")
        }

        const pessoaEmailExistente = await PessoaRepository.buscarPessoaPorEmail(dados.email)
        if (pessoaEmailExistente) {
            throw new Error("Ops! Parece que já existe uma pessoa cadastrada com esse E-mail!")
        }

        const TIPOS_VALIDOS = ["motorista", "gerente"]
        const tipo = dados.tipo ?? "motorista"

        if (!TIPOS_VALIDOS.includes(tipo)) {
            throw new Error("Tipo de usuário inválido. Use 'motorista' ou 'gerente'.")
        }

        const senhaHash = await bcrypt.hash(dados.senha, 10)

        const novaPessoa = {
            nome: dados.nome,
            email: dados.email,
            cpf: dados.cpf,
            senha: senhaHash,
            logradouro: dados.logradouro,
            bairro: dados.bairro,
            numero: dados.numero,
            complemento: dados.complemento,
            cidade_id: dados.cidade_id,
            tipo,
            // is_admin é mantido em sincronia com o tipo por compatibilidade
            // com as partes do sistema que ainda usam essa flag.
            is_admin: tipo === "gerente",
            id_turno: null,
            estacionamento_id: null
        }

        return await PessoaRepository.cadastrarPessoa(novaPessoa)
    }

    async listarTodasPessoas() {
        return await PessoaRepository.listarTodasPessoas()
    }

    async buscarPessoaPorId(id) {
        const pessoa = await PessoaRepository.buscarPessoaPorId(id)

        if (!pessoa) {
            throw new Error("Pessoa não encontrada!")
        }

        return pessoa
    }

    async editarPessoa(id, dadosPessoa) {

        const pessoa = await PessoaRepository.buscarPessoaPorId(id)

        if (!pessoa) {
            throw new Error("Pessoa não encontrada!")
        }

        if (dadosPessoa.cpf && dadosPessoa.cpf !== pessoa.cpf) {
            const pessoaCpfExistente = await PessoaRepository.buscarPessoaPorCpf(dadosPessoa.cpf)
            if (pessoaCpfExistente && pessoaCpfExistente.id !== id) {
                throw new Error("Ops! Parece que já existe uma pessoa cadastrada com esse CPF!")
            }
        }

        if (dadosPessoa.email && dadosPessoa.email !== pessoa.email) {
            const pessoaEmailExistente = await PessoaRepository.buscarPessoaPorEmail(dadosPessoa.email)
            if (pessoaEmailExistente && pessoaEmailExistente.id !== id) {
                throw new Error("Ops! Parece que já existe uma pessoa cadastrada com esse E-mail!")
            }
        }

        if (dadosPessoa.senha) {
            dadosPessoa.senha = await bcrypt.hash(dadosPessoa.senha, 10)
        }

        dadosPessoa.atualizado_em = new Date()

        await PessoaRepository.editarPessoa(id, dadosPessoa)

        return await PessoaRepository.buscarPessoaPorId(id)
    }

    async deletarPessoa(id) {

        const pessoa = await PessoaRepository.buscarPessoaPorId(id)

        if (!pessoa) {
            throw new Error("Pessoa não encontrada!")
        }

        await PessoaRepository.deletarPessoa(id)
    }

}

module.exports = new PessoaService()