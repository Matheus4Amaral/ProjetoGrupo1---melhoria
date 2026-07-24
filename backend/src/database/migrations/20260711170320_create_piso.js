/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('piso', (table) => {
    table.uuid('id').primary().notNullable().defaultTo(knex.fn.uuid())
    table.string('codigo').notNullable().unique()
    table.integer('andar').notNullable()
    table.string('nome').notNullable()
    table.integer('vagas').notNullable()
    table.uuid('estacionamento_id').notNullable().references('id').inTable('estacionamento')
    table.timestamp('criado_em').notNullable().defaultTo(knex.fn.now())
    table.timestamp('atualizado_em')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('piso')
};
