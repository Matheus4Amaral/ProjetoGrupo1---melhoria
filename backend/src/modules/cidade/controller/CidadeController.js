const CidadeService = require('../service/CidadeService')

class CidadeController {

    async buscarCidades(req, res) {
        try {
            const { nome } = req.query

            const cidades = await CidadeService.buscarCidades(nome)

            return res.status(200).json(cidades)
        } catch (error) {

            return res.status(400).json({
                erro: error.message
            })
        }
    }
}

module.exports = new CidadeController()
