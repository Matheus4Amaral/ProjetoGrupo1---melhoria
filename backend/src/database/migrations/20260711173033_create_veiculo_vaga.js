/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('veiculo_vaga', (table) => {
    table.uuid('id').notNullable().primary().defaultTo(knex.fn.uuid())
    table.uuid('veiculo_id').notNullable().references('id').inTable('veiculo')
    table.uuid('vaga_id').notNullable().references('id').inTable('vaga')
    table.timestamp('estacionado_em').notNullable()
    table.timestamp('desocupado_em')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('veiculo_vaga')
};
