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

  async buscarReservaAtivaPorPessoaId(pessoaId) {
    return db("reserva")
        .join("veiculo", "veiculo.id", "reserva.veiculo_id")
        .join("vaga", "vaga.id", "reserva.vaga_id")
        .join("piso", "piso.id", "vaga.piso_id")
        .where("reserva.pessoa_id", pessoaId)
        .where("reserva.status", "ativa")
        .select(
            "reserva.id",
            "reserva.criado_em",
            "veiculo.placa",
            "veiculo.marca",
            "veiculo.modelo",
            "vaga.nome as vaga_nome",
            "vaga.codigo as vaga_codigo",
            "piso.nome as piso_nome"
        )
        .orderBy("reserva.criado_em", "desc")
        .first()
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