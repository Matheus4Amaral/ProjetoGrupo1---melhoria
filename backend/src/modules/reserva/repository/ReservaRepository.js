const db = require("../../../database/connection")

class ReservaRepository {
  async cadastrarReserva(dados) {
    const [reserva] = await db("reserva").insert(dados).returning("*")
    return reserva
  }

  async buscarReservaPorId(id) {
    return db("reserva").where({ id }).first()
  }

  async listarTodasReservas() {
    return db("reserva").select("*")
  }

  async cancelarReserva(id) {
    const [reserva] = await db("reserva")
      .where({ id })
      .update({ status: 'cancelada', atualizado_em: db.fn.now() })
      .returning("*")
    return reserva
  }

  async marcarVagaComoOcupada(vagaId) {
    return db("vaga").where({ id: vagaId }).update({ is_ocupada: true })
  }

  async liberarVaga(vagaId) {
    return db("vaga").where({ id: vagaId }).update({ is_ocupada: false })
  }
}

module.exports = new ReservaRepository()