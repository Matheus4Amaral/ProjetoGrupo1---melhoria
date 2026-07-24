/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('vaga', (table) => {
    table.uuid('id').notNullable().primary().defaultTo(knex.fn.uuid())
    table.uuid('piso_id').notNullable().references('id').inTable('piso')
    table.string('codigo').notNullable().unique()
    table.string('nome').notNullable()
    table.boolean('is_ocupada').notNullable()
    table.timestamp('criado_em').notNullable().defaultTo(knex.fn.now())
    table.timestamp('atualizado_em')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
