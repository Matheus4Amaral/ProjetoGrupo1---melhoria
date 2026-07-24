/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('turno', (table) => {
    table.uuid('id').notNullable().primary().defaultTo(knex.fn.uuid())
    table.string('descricao').notNullable()
    table.time('inicio_em').notNullable()
    table.time('termino_em').notNullable()
    table.timestamp('criado_em').notNullable().defaultTo(knex.fn.now())
    table.timestamp('atualizado_em').notNullable()
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('turno')
};
