/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("pessoa", (table) => {
    table.string("tipo").notNullable().defaultTo("motorista")
  })

  // Mantém quem já era admin como gerente na nova coluna.
  await knex("pessoa").where({ is_admin: true }).update({ tipo: "gerente" })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("pessoa", (table) => {
    table.dropColumn("tipo")
  })
}
