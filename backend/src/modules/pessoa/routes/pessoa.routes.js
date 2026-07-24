const { Router } = require('express')

const PessoaController = require('../controller/PessoaController')

const rotas = Router()

/**
 * @swagger
 * /pessoa:
 *   post:
 *     summary: Cadastra uma nova pessoa
 *     description: Cria um registro de pessoa.
 *     tags: [Pessoa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pessoa'
 *     responses:
 *       201:
 *         description: Pessoa cadastrada com sucesso.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.post('/', PessoaController.cadastrarPessoa)

/**
 * @swagger
 * /pessoa:
 *   get:
 *     summary: Lista todas as pessoas
 *     description: Retorna uma lista de todas as pessoas cadastradas.
 *     tags: [Pessoa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pessoas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pessoa'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/', PessoaController.listarTodasPessoas)

/**
 * @swagger
 * /pessoa/{id}:
 *   get:
 *     summary: Busca uma pessoa por ID
 *     description: Retorna os detalhes de uma pessoa específica.
 *     tags: [Pessoa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da pessoa
 *     responses:
 *       200:
 *         description: Dados da pessoa.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pessoa'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
rotas.get('/:id', PessoaController.buscarPessoaPorId)

/**
 * @swagger
 * /pessoa/{id}:
 *   put:
 *     summary: Edita uma pessoa
 *     description: Atualiza os dados de uma pessoa existente.
 *     tags: [Pessoa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da pessoa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pessoa'
 *     responses:
 *       200:
 *         description: Pessoa atualizada com sucesso.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
rotas.put('/:id', PessoaController.editarPessoa)

/**
 * @swagger
 * /pessoa/{id}:
 *   delete:
 *     summary: Deleta uma pessoa
 *     description: Remove o registro de uma pessoa pelo ID.
 *     tags: [Pessoa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da pessoa
 *     responses:
 *       204:
 *         description: Pessoa deletada com sucesso.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
rotas.delete('/:id', PessoaController.deletarPessoa)

module.exports = rotas