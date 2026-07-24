/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable("pessoa", (table) => {
    table.uuid("id_turno").nullable().alter()
    table.boolean("is_admin").notNullable().defaultTo(false).alter()
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable("pessoa", (table) => {
    table.uuid("id_turno").notNullable().alter()
    table.boolean("is_admin").notNullable().alter()
  })
};
