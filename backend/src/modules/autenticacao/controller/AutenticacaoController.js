const AutenticacaoService = require('../service/AutenticacaoService')

class AutenticacaoController {

    async login(req, res) {
        try {
            const { email, senha } = req.body

            const resultado = await AutenticacaoService.login(email, senha)

            return res.status(200).json(resultado)
        } catch (error) {

            return res.status(401).json({
                erro: error.message
            })
        }
    }
}

module.exports = new AutenticacaoController()
