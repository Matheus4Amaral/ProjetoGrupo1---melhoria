/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable("vaga", (table) => {
    table.boolean("em_manutencao").notNullable().defaultTo(false)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable("vaga", (table) => {
    table.dropColumn("em_manutencao")
  })
};
