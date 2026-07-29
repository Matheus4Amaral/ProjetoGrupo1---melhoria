const ReservaService = require('../service/ReservaService')

class ReservaController {
  async cadastrarReserva(req, res) {
    try {
      const reserva = await ReservaService.cadastrarReserva(req.body)
      return res.status(201).json(reserva)
    } catch (error) {
      return res.status(400).json({ erro: error.message })
    }
  }

  async buscarReservaPorId(req, res) {
    try {
      const reserva = await ReservaService.buscarReservaPorId(req.params.id)
      return res.status(200).json(reserva)
    } catch (error) {
      return res.status(400).json({ erro: error.message })
    }
  }

  async listarTodasReservas(req, res) {
    try {
      const reservas = await ReservaService.listarTodasReservas()
      return res.status(200).json(reservas)
    } catch (error) {
      return res.status(400).json({ erro: error.message })
    }
  }

  async buscarReservaAtivaPorUsuario(req, res) {
    try {
        const pessoaId = req.usuario.id
        const reserva = await ReservaService.buscarReservaAtivaPorUsuario(pessoaId)
        return res.status(200).json(reserva || null)
    } catch (error) {
        return res.status(400).json({ erro: error.message })
    }
  }

  async cancelarReserva(req, res) {
    try {
      const reserva = await ReservaService.cancelarReserva(req.params.id)
      return res.status(200).json(reserva)
    } catch (error) {
      return res.status(400).json({ erro: error.message })
    }
  }
}

module.exports = new ReservaController()