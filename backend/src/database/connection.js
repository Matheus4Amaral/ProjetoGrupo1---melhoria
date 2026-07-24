const knex = require("knex")
const configuracao = require('../../knexfile')

const variavel = process.env.NODE_ENV || "development"

const conexao = knex(configuracao[variavel])

module.exports = conexao