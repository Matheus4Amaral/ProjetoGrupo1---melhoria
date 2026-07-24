const PessoaService = require('../service/PessoaService')

class PessoaController {
    async cadastrarPessoa(req, res) {
        try {
            const pessoa = await PessoaService.cadastrarPessoa(req.body)

            return res.status(201).json(pessoa)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async listarTodasPessoas(req, res) {
        try {
            const pessoas = await PessoaService.listarTodasPessoas()

            return res.status(200).json(pessoas)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async buscarPessoaPorId(req, res) {
        try {
            const { id } = req.params

            const pessoa = await PessoaService.buscarPessoaPorId(id)

            return res.status(200).json(pessoa)

        } catch (error) {
            return res.status(404).json({
                erro: error.message
            })
        }
    }

    async editarPessoa(req, res) {
        try {
            const { id } = req.params

            const pessoa = await PessoaService.editarPessoa(id, req.body)

            return res.status(200).json(pessoa)

        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async deletarPessoa(req, res) {
        try {
            const { id } = req.params

            await PessoaService.deletarPessoa(id)

            return res.status(200).json({
                mensagem: "Pessoa deletada com sucesso!"
            })

        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }
}

module.exports = new PessoaController()