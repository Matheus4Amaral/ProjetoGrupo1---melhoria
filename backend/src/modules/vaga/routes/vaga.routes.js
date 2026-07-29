const { Router } = require("express")

const adminMiddleware = require("../../../middlewares/adminMiddleware")
const VagaController = require('../controller/VagaController')

const rotas = Router()

/**
 * @swagger
 * /vagas:
 *   post:
 *     summary: Cadastra uma nova vaga
 *     tags: [Vaga]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               nome:
 *                 type: string
 *               is_ocupada:
 *                 type: boolean
 *               em_manutencao:
 *                 type: boolean
 *               piso_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Vaga cadastrada.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.post('/', adminMiddleware, VagaController.cadastrarVaga)

/**
 * @swagger
 * /vagas:
 *   get:
 *     summary: Lista todas as vagas, com o nome e código do piso ao qual cada uma pertence
 *     tags: [Vaga]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vagas.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/', VagaController.listarVagas)

/**
 * @swagger
 * /vagas/desocupadas:
 *   get:
 *     summary: Busca vagas desocupadas
 *     tags: [Vaga]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vagas desocupadas.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/desocupadas', VagaController.buscarVagasDesocupadas)

/**
 * @swagger
 * /vagas/piso/{piso_id}:
 *   get:
 *     summary: Busca vagas pelo ID do piso
 *     tags: [Vaga]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: piso_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vagas encontradas para o piso.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/piso/:piso_id', VagaController.buscarVagaPorPisoId)

/**
 * @swagger
 * /vagas/estacionamento/{estacionamento_id}:
 *   get:
 *     summary: Lista as vagas de um estacionamento, com o nome e o andar do piso de cada uma
 *     description: Usado pelo hub do motorista para exibir as vagas de um estacionamento.
 *     tags: [Vaga]
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
 *         description: Vagas encontradas para o estacionamento.
 *       400:
 *         description: Estacionamento não encontrado.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/estacionamento/:estacionamento_id', VagaController.buscarVagasPorEstacionamentoId)

/**
 * @swagger
 * /vagas/{id}:
 *   get:
 *     summary: Busca vaga pelo ID
 *     tags: [Vaga]
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
 *         description: Vaga encontrada.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
rotas.get('/:id', VagaController.buscarVagaPorId)

/**
 * @swagger
 * /vagas/{id}:
 *   put:
 *     summary: Edita uma vaga
 *     tags: [Vaga]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               nome:
 *                 type: string
 *               is_ocupada:
 *                 type: boolean
 *               em_manutencao:
 *                 type: boolean
 *               piso_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Vaga editada.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.put('/:id', adminMiddleware, VagaController.editarVaga)

/**
 * @swagger
 * /vagas/{id}:
 *   delete:
 *     summary: Exclui uma vaga
 *     tags: [Vaga]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vaga excluída.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.delete('/:id', adminMiddleware, VagaController.excluirVaga)

module.exports = rotas