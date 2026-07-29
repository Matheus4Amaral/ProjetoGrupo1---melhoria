const db = require("../../../database/connection");

class VagaRepository {
  async cadastrarVaga(dados) {
    const [vaga] = await db("vaga").insert(dados).returning("*");

    return vaga;
  }

  async listarVagas() {
    return db("vaga")
      .join("piso", "piso.id", "vaga.piso_id")
      .select(
        "vaga.id",
        "vaga.codigo",
        "vaga.nome",
        "vaga.is_ocupada",
        "vaga.em_manutencao",
        "vaga.piso_id",
        "piso.nome as piso_nome",
        "vaga.criado_em",
        "vaga.atualizado_em"
      )
      .orderBy("piso.nome")
      .orderBy("vaga.nome");
  }

  async buscarVagaPorId(id) {
    return db("vaga").where({ id }).first();
  }

  async buscarVagaPorCodigo(codigo) {
    return db("vaga").where({ codigo }).first();
  }

  async buscarVagaPorPisoId(pisoId) {
    return db("vaga").where({ pisoId: pisoId }).select("*");
  }

  // async buscarVagasPorEstacionamentoId(estacionamentoId) {
  //   return db("vaga")
  //     .join("piso", "piso.id", "vaga.piso_id")
  //     .where("piso.estacionamento_id", estacionamentoId)
  //     .select(
  //       "vaga.id",
  //       "vaga.codigo",
  //       "vaga.nome",
  //       "vaga.is_ocupada",
  //       "vaga.em_manutencao",
  //       "vaga.piso_id",
  //       "piso.nome as piso_nome",
  //       "piso.andar as piso_andar",
  //       "pessoa.nome as motorista_nome",
  //     )
  //     .orderBy("piso.andar")
  //     .orderBy("vaga.codigo", "asc");
  // }

  async buscarVagasPorEstacionamentoId(estacionamentoId) {
    return db("vaga")
      .join("piso", "piso.id", "vaga.piso_id")
      .leftJoin({ ocupacao_ativa: "veiculo_vaga" }, function () {
        this.on("ocupacao_ativa.vaga_id", "=", "vaga.id")
          .andOnNull("ocupacao_ativa.desocupado_em");
      })
      .leftJoin(
        { veiculo_ocupacao: "veiculo" },
        "veiculo_ocupacao.id",
        "ocupacao_ativa.veiculo_id"
      )
      .leftJoin(
        { pessoa_ocupacao: "pessoa" },
        "pessoa_ocupacao.id",
        "veiculo_ocupacao.pessoa_id"
      )
      .leftJoin({ reserva_ativa: "reserva" }, function () {
        this.on("reserva_ativa.vaga_id", "=", "vaga.id")
          .andOnVal("reserva_ativa.status", "=", "ativa");
      })
      .leftJoin(
        { veiculo_reserva: "veiculo" },
        "veiculo_reserva.id",
        "reserva_ativa.veiculo_id"
      )
      .leftJoin(
        { pessoa_reserva: "pessoa" },
        "pessoa_reserva.id",
        "reserva_ativa.pessoa_id"
      )
      .where("piso.estacionamento_id", estacionamentoId)
      .select(
        "vaga.id",
        "vaga.codigo",
        "vaga.nome",
        "vaga.is_ocupada",
        "vaga.em_manutencao",
        "vaga.piso_id",
        "piso.nome as piso_nome",
        "piso.andar as piso_andar",
        "pessoa_ocupacao.nome as motorista_nome",
        "ocupacao_ativa.id as ocupacao_id",
        "ocupacao_ativa.estacionado_em",
        "veiculo_ocupacao.placa as veiculo_placa",
        "reserva_ativa.id as reserva_id",
        "reserva_ativa.status as reserva_status",
        "reserva_ativa.criado_em as reservado_em",
        "pessoa_reserva.nome as reserva_pessoa_nome",
        "veiculo_reserva.placa as reserva_veiculo_placa"
      )
      .orderBy("piso.andar")
      .orderBy("vaga.codigo", "asc");
  }

  async buscarVagasDesocupadas() {
    return db("vaga").where({ is_ocupada: false }).select("*");
  }

  async editarVaga(id, dados) {
    const [vaga] = await db("vaga")
      .where({ id })
      .update({
        ...dados,
        atualizado_em: db.fn.now(),
      })
      .returning("*");

    return vaga;
  }
}

module.exports = new VagaRepository();
