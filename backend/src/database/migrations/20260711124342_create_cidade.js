/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('cidade', (table) => {
    table.uuid('id').notNullable().primary().defaultTo(knex.fn.uuid())
    table.string('ibge', 7).notNullable().unique()
    table.string('uf', 2).notNullable()
    table.string('nome').notNullable()
    table.index['nome']
    table.index['igbe']
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('cidade')
};
