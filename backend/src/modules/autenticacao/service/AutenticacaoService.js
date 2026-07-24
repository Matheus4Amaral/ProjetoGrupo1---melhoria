const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const PessoaRepository = require('../../pessoa/repository/PessoaRepository')

class AutenticacaoService {

    async login(email, senha) {
        if (!email || !senha) {
            throw new Error('Informe e-mail e senha.')
        }

        const pessoa = await PessoaRepository.buscarPessoaPorEmail(email)

        if (!pessoa) {
            throw new Error('E-mail ou senha inválidos.')
        }

        const senhaValida = await bcrypt.compare(senha, pessoa.senha)

        if (!senhaValida) {
            throw new Error('E-mail ou senha inválidos.')
        }

        const token = jwt.sign(
            {
                id: pessoa.id,
                email: pessoa.email,
                tipo: pessoa.tipo,
                isAdmin: pessoa.is_admin
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        )

        const { senha: _senha, ...pessoaSemSenha } = pessoa

        return {
            token,
            pessoa: pessoaSemSenha
        }
    }
}

module.exports = new AutenticacaoService()
