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
    return db("vaga").where({ piso_id: pisoId }).select("*");
  }

  async contarVagasPorPisoId(pisoId) {
    const [{ total }] = await db("vaga")
      .where({ piso_id: pisoId })
      .count({ total: "*" });

    return Number(total);
  }

  async buscarVagasPorEstacionamentoId(estacionamentoId) {
    return db("vaga")
      .join("piso", "piso.id", "vaga.piso_id")
      .where("piso.estacionamento_id", estacionamentoId)
      .select(
        "vaga.id",
        "vaga.codigo",
        "vaga.nome",
        "vaga.is_ocupada",
        "vaga.em_manutencao",
        "vaga.piso_id",
        "piso.nome as piso_nome",
        "piso.andar as piso_andar"
      )
      .orderBy("piso.andar")
      .orderBy("vaga.nome");
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

  async excluirVaga(id) {
    await db("vaga").where({ id }).del();
  }
}

module.exports = new VagaRepository();
