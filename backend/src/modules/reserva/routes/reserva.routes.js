const { Router } = require('express')
const ReservaController = require('../controller/ReservaController')

const rotas = Router()

rotas.post('/', ReservaController.cadastrarReserva)
rotas.get('/:id', ReservaController.buscarReservaPorId)
rotas.get('/', ReservaController.listarTodasReservas)
rotas.put('/:id/cancelar', ReservaController.cancelarReserva)

module.exports = rotas