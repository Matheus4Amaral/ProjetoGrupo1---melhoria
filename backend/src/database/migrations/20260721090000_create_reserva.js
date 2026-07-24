/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.up = function(knex) {
  return knex.schema.createTable("reserva", (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table.uuid('pessoa_id').notNullable().references('id').inTable('pessoa')
    table.uuid('vaga_id').notNullable().references('id').inTable('vaga')
    table.uuid('veiculo_id').notNullable().references('id').inTable('veiculo')
    table.string('status').notNullable().defaultTo('ativa')
    table.timestamp('criado_em').defaultTo(knex.fn.now())
    table.timestamp('atualizado_em').defaultTo(knex.fn.now())
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.down = function(knex) {
  return knex.schema.dropTable('reserva')
};