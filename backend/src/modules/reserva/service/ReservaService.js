const ReservaRepository = require('../repository/ReservaRepository')
const VagaRepository = require('../../vaga/repository/VagaRepository')

class ReservaService {
  async cadastrarReserva(dados) {
    const vaga = await VagaRepository.buscarVagaPorId(dados.vaga_id)

    if (!vaga) {
      throw new Error("Ops! Essa vaga não existe.")
    }
    if (vaga.is_ocupada) {
      throw new Error("Ops! Essa vaga já está ocupada ou reservada.")
    }

    const reserva = await ReservaRepository.cadastrarReserva(dados)
    await ReservaRepository.marcarVagaComoOcupada(dados.vaga_id)

    return reserva
  }

  async buscarReservaPorId(id) {
    return await ReservaRepository.buscarReservaPorId(id)
  }

  async listarTodasReservas() {
    return await ReservaRepository.listarTodasReservas()
  }

  async buscarReservaAtivaPorUsuario(pessoaId) {
    return await ReservaRepository.buscarReservaAtivaPorPessoaId(pessoaId)
  }

  async cancelarReserva(id) {
    const reservaExistente = await ReservaRepository.buscarReservaPorId(id)

    if (!reservaExistente) {
      throw new Error("Ops! Essa reserva não existe.")
    }

    const reserva = await ReservaRepository.cancelarReserva(id)
    await ReservaRepository.liberarVaga(reservaExistente.vaga_id)

    return reserva
  }
}

module.exports = new ReservaService()