const { Router } = require("express")

const authMiddleware  = require("./src/middlewares/authMiddleware")
const adminMiddleware = require("./src/middlewares/adminMiddleware")

const estacionamentoRoutes = require("./src/modules/estacionamento/routes/estacionamento.routes")
const pisoRoutes = require("./src/modules/piso/routes/piso.routes")
const pessoaRoutes = require("./src/modules/pessoa/routes/pessoa.routes")
const vagaRoutes = require("./src/modules/vaga/routes/vaga.routes")
const turnoRoutes = require("./src/modules/turno/routes/turno.routes")
const veiculoRoutes = require("./src/modules/veiculo/routes/veiculo.routes")
const veiculoVagaRoutes = require("./src/modules/veiculoVaga/routes/veiculoVaga.routes")
const autenticacaoRoutes = require("./src/modules/autenticacao/routes/autenticacao.routes")
const cidadeRoutes = require("./src/modules/cidade/routes/cidade.routes")
const reservaRoutes = require("./src/modules/reserva/routes/reserva.routes")

const rotas = Router()

rotas.use('/autenticacao', autenticacaoRoutes)
rotas.use('/cidades', cidadeRoutes)
rotas.use('/pessoa', pessoaRoutes)

rotas.use('/estacionamentos', authMiddleware, estacionamentoRoutes)
rotas.use('/pisos',           authMiddleware, pisoRoutes)
rotas.use('/vagas',           authMiddleware, vagaRoutes)
rotas.use('/turnos',          authMiddleware, turnoRoutes)
rotas.use('/veiculo',         authMiddleware, veiculoRoutes)
rotas.use('/veiculo-vaga',    authMiddleware, veiculoVagaRoutes)
rotas.use('/dashboard',       authMiddleware, adminMiddleware)
rotas.use('/cliente',         authMiddleware)
rotas.use('/reservas',        authMiddleware, reservaRoutes)

module.exports = rotas