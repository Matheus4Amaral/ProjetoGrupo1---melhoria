const CidadeRepository = require('../repository/CidadeRepository')

const LIMITE_RESULTADOS = 20
const TAMANHO_MINIMO_BUSCA = 2

class CidadeService {

    async buscarCidades(nome) {
        const termo = (nome || '').trim()

        if (termo.length < TAMANHO_MINIMO_BUSCA) {
            return []
        }

        return await CidadeRepository.buscarCidadesPorNome(termo, LIMITE_RESULTADOS)
    }
}

module.exports = new CidadeService()
