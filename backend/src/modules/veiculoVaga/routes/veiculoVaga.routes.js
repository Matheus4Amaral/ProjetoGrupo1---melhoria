const { Router } = require("express")

const VeiculoVagaController = require('../controller/VeiculoVagaController')

const rotas = Router()

/**
 * @swagger
 * /veiculo-vaga:
 *   post:
 *     summary: Estaciona um veículo em uma vaga (Entrada)
 *     tags: [VeículoVaga]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               veiculo_id:
 *                 type: string
 *                 format: uuid
 *               vaga_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Veículo estacionado.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.post('/', VeiculoVagaController.estacionarVeiculo)

/**
 * @swagger
 * /veiculo-vaga:
 *   get:
 *     summary: Lista todos os registros de ocupação
 *     tags: [VeículoVaga]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ocupações.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/', VeiculoVagaController.listarTodos)

/**
 * @swagger
 * /veiculo-vaga/saida/{id}:
 *   put:
 *     summary: Registra a saída de um veículo
 *     tags: [VeículoVaga]
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
 *         description: Saída registrada com sucesso.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.put('/saida/:id', VeiculoVagaController.registrarSaida)

/**
 * @swagger
 * /veiculo-vaga/veiculo/{veiculo_id}:
 *   get:
 *     summary: Lista o histórico de ocupação por veículo
 *     tags: [VeículoVaga]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: veiculo_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Histórico do veículo.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/veiculo/:veiculo_id', VeiculoVagaController.listarHistoricoPorVeiculo)

/**
 * @swagger
 * /veiculo-vaga/vaga/{vaga_id}:
 *   get:
 *     summary: Lista o histórico de ocupação por vaga
 *     tags: [VeículoVaga]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vaga_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Histórico da vaga.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/vaga/:vaga_id', VeiculoVagaController.listarHistoricoPorVaga)

/**
 * @swagger
 * /veiculo-vaga/estacionamento/{estacionamento_id}:
 *   get:
 *     summary: Lista as movimentações recentes de um estacionamento
 *     description: Usado pelo dashboard do gerente. Junta veículo, vaga e piso, ordenado pela entrada mais recente.
 *     tags: [VeículoVaga]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: estacionamento_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Movimentações recentes do estacionamento.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/estacionamento/:estacionamento_id', VeiculoVagaController.listarMovimentacoesPorEstacionamento)

/**
 * @swagger
 * /veiculo-vaga/{id}:
 *   get:
 *     summary: Busca ocupação pelo ID
 *     tags: [VeículoVaga]
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
 *         description: Ocupação encontrada.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
rotas.get('/:id', VeiculoVagaController.buscarPorId)

module.exports = rotas
