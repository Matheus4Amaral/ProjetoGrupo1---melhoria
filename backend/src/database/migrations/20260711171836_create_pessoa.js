/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('pessoa', (table) => {
    table.uuid('id').notNullable().primary().defaultTo(knex.fn.uuid())
    table.string('nome').notNullable()
    table.string('email').notNullable().unique()
    table.string('senha').notNullable()
    table.string('logradouro').notNullable()
    table.string('bairro').notNullable()
    table.integer('numero').notNullable()
    table.string('complemento')
    table.uuid('cidade_id').notNullable().references('id').inTable('cidade')
    table.string('cpf').notNullable().unique()
    table.boolean('is_admin').notNullable()
    table.uuid('id_turno').notNullable().references('id').inTable('turno')
    table.uuid('estacionamento_id').references('id').inTable('estacionamento')
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
