const { Router } = require('express')
const ReservaController = require('../controller/ReservaController')
const autenticacaoMiddleware = require('../../../middlewares/authMiddleware')

const rotas = Router()

rotas.post('/', ReservaController.cadastrarReserva)
rotas.get('/ativa/me', autenticacaoMiddleware, ReservaController.buscarReservaAtivaPorUsuario)
rotas.get('/:id', ReservaController.buscarReservaPorId)
rotas.get('/', ReservaController.listarTodasReservas)
rotas.put('/:id/cancelar', ReservaController.cancelarReserva)

module.exports = rotas