const { Router } = require('express')

const VeiculoController = require('../controller/VeiculoController')

const rotas = Router()

/**
 * @swagger
 * /veiculo:
 *   post:
 *     summary: Cadastra um novo veículo
 *     tags: [Veículo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               placa:
 *                 type: string
 *                 example: "ABC1D23"
 *               modelo:
 *                 type: string
 *                 example: "Civic"
 *               marca:
 *                 type: string
 *                 example: "Honda"
 *               ano:
 *                 type: string
 *                 example: "2022"
 *               combustivel:
 *                 type: string
 *                 example: "Flex"
 *               cor:
 *                 type: string
 *                 example: "Preto"
 *               pessoa_id:
 *                 type: string
 *                 format: uuid
 *                 description: "ID da Pessoa Seed"
 *     responses:
 *       201:
 *         description: Veículo cadastrado.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.post('/', VeiculoController.cadastrarVeiculo)

/**
 * @swagger
 * /veiculo:
 *   get:
 *     summary: Lista todos os veículos
 *     tags: [Veículo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de veículos.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/', VeiculoController.listarTodosVeiculos)

/**
 * @swagger
 * /veiculo/{id}:
 *   get:
 *     summary: Busca veículo pelo ID
 *     tags: [Veículo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Veículo encontrado.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
rotas.get('/:id', VeiculoController.buscarVeiculoPorId)

/**
 * @swagger
 * /veiculo/placa/{placa}:
 *   get:
 *     summary: Busca veículo pela placa
 *     tags: [Veículo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placa
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Veículo encontrado.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
rotas.get('/placa/:placa', VeiculoController.buscarVeiculoPorPlaca)

/**
 * @swagger
 * /veiculo/{id}:
 *   put:
 *     summary: Edita um veículo
 *     tags: [Veículo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               placa:
 *                 type: string
 *                 example: "ABC1D23"
 *               modelo:
 *                 type: string
 *                 example: "Civic"
 *               marca:
 *                 type: string
 *                 example: "Honda"
 *               ano:
 *                 type: string
 *                 example: "2022"
 *               combustivel:
 *                 type: string
 *                 example: "Flex"
 *               cor:
 *                 type: string
 *                 example: "Preto"
 *               pessoa_id:
 *                 type: string
 *                 format: uuid
 *                 description: "ID da Pessoa Seed"
 *     responses:
 *       200:
 *         description: Veículo editado.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.put('/:id', VeiculoController.editarVeiculo)

/**
 * @swagger
 * /veiculo/{id}:
 *   delete:
 *     summary: Exclui um veículo
 *     tags: [Veículo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Veículo excluído.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.delete('/:id', VeiculoController.deletarVeiculo)

module.exports = rotas