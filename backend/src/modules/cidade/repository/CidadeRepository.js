const db = require('../../../database/connection')

class CidadeRepository {
  async buscarCidadesPorNome(nome = '', limite = 50) {
    return await db('cidade')
      .select('id', 'nome', 'uf', 'ibge')
      .whereILike('nome', `%${nome}%`)
      .orderBy('nome', 'asc')
      .limit(limite)
  }
}

module.exports = new CidadeRepository()