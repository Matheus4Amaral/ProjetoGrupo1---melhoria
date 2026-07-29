/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('piso', (table) => {
    table.dropUnique(['codigo'])
    table.unique(['estacionamento_id', 'codigo'])
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('piso', (table) => {
    table.dropUnique(['estacionamento_id', 'codigo'])
    table.unique(['codigo'])
  })
};
