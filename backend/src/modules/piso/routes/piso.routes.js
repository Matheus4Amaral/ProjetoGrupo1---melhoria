const { Router } = require('express')

const adminMiddleware = require("../../../middlewares/adminMiddleware")
const PisoController = require("../controller/PisoController")

const rotas = Router()

/**
 * @swagger
 * /pisos:
 *   post:
 *     summary: Cadastra um novo piso
 *     tags: [Piso]
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
 *               andar:
 *                 type: integer
 *               nome:
 *                 type: string
 *               vagas:
 *                 type: integer
 *               estacionamento_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Piso cadastrado.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.post("/", adminMiddleware, PisoController.cadastrarPiso)

/**
 * @swagger
 * /pisos/{id}:
 *   get:
 *     summary: Busca piso pelo ID
 *     tags: [Piso]
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
 *         description: Piso encontrado.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
rotas.get('/:id', PisoController.buscarPisoPorId)

/**
 * @swagger
 * /pisos/codigo/{codigo}:
 *   get:
 *     summary: Busca piso pelo código
 *     tags: [Piso]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Piso encontrado.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/codigo/:codigo', PisoController.buscarPisoPorCodigo)

/**
 * @swagger
 * /pisos:
 *   get:
 *     summary: Lista todos os pisos, com o nome do estacionamento ao qual cada um pertence
 *     tags: [Piso]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pisos.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/', PisoController.listarTodosPisos)

/**
 * @swagger
 * /pisos/andar/{andar}:
 *   get:
 *     summary: Busca piso pelo andar
 *     tags: [Piso]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: andar
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pisos encontrados para o andar.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/andar/:andar', PisoController.buscarPisoPorAndar)

/**
 * @swagger
 * /pisos/estacionamento/{estacionamento_id}:
 *   get:
 *     summary: Lista os pisos de um estacionamento
 *     tags: [Piso]
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
 *         description: Pisos do estacionamento.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/estacionamento/:estacionamento_id', PisoController.listarPisosPorEstacionamentoId)

/**
 * @swagger
 * /pisos/{id}:
 *   put:
 *     summary: Edita um piso
 *     tags: [Piso]
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
 *               codigo:
 *                 type: string
 *               andar:
 *                 type: integer
 *               nome:
 *                 type: string
 *               vagas:
 *                 type: integer
 *               estacionamento_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Piso editado.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.put('/:id', adminMiddleware, PisoController.editarPiso)

/**
 * @swagger
 * /pisos/{id}:
 *   delete:
 *     summary: Exclui um piso
 *     tags: [Piso]
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
 *         description: Piso excluído.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.delete('/:id', adminMiddleware, PisoController.excluirPiso)

module.exports = rotas