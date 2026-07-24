/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("estacionamento", (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid())
        table.text('nome').notNullable()
        table.string('cnpj', 14).notNullable().unique()
        table.integer('inscricao_estadual')
        table.integer('indicador_insc_estadual').notNullable()
        table.text('logradouro').notNullable()
        table.text('bairro').notNullable()
        table.integer('numero').notNullable()
        table.string('email')
        table.string('telefone')
        table.boolean('ativo').notNullable().defaultTo(true)
        table.uuid('cidade_id').notNullable().references('id').inTable('cidade')
        table.timestamp('criado_em').defaultTo(knex.fn.now())
        table.timestamp('atualizado_em')
    }
)};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('estacionamento')
};
