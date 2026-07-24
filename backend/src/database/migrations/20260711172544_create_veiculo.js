/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('veiculo', (table) => {
    table.uuid('id').notNullable().primary().defaultTo(knex.fn.uuid())
    table.string('placa').notNullable().unique()
    table.string('modelo')
    table.string('marca')
    table.string('ano')
    table.string('combustivel')
    table.string('cor')
    table.uuid('pessoa_id').references('id').inTable('pessoa').notNullable()
    table.timestamp('criado_em').notNullable().defaultTo(knex.fn.now())
    table.timestamp('atualizado_em')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('veiculo')
};
