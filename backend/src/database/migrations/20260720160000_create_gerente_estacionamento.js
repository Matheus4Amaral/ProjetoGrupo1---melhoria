/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("gerente_estacionamento", (table) => {
    table.uuid("id").notNullable().primary().defaultTo(knex.fn.uuid())
    table.uuid("pessoa_id").notNullable().references("id").inTable("pessoa")
    table.uuid("estacionamento_id").notNullable().references("id").inTable("estacionamento")
    table.timestamp("criado_em").notNullable().defaultTo(knex.fn.now())

    // Um gerente não pode ser vinculado duas vezes ao mesmo estacionamento.
    table.unique(["pessoa_id", "estacionamento_id"])
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("gerente_estacionamento")
}
