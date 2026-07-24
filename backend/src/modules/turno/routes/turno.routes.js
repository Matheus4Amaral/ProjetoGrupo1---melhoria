const { Router } = require('express')

const adminMiddleware = require("../../../middlewares/adminMiddleware")
const TurnoController= require('../controller/TurnoController')

const rotas = Router()

/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Cadastra um novo turno
 *     tags: [Turno]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *               inicio_em:
 *                 type: string
 *                 format: time
 *                 example: "08:00:00"
 *               termino_em:
 *                 type: string
 *                 format: time
 *                 example: "18:00:00"
 *     responses:
 *       201:
 *         description: Turno cadastrado.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.post('/', adminMiddleware, TurnoController.cadastrarTurno)

/**
 * @swagger
 * /turnos/{id}:
 *   get:
 *     summary: Busca turno pelo ID
 *     tags: [Turno]
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
 *         description: Turno encontrado.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
rotas.get('/:id', TurnoController.buscarTurnoPorId)

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Lista todos os turnos
 *     tags: [Turno]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/', TurnoController.listarTodosTurnos)

/**
 * @swagger
 * /turnos/{id}:
 *   put:
 *     summary: Edita um turno
 *     tags: [Turno]
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
 *               descricao:
 *                 type: string
 *               inicio_em:
 *                 type: string
 *                 format: time
 *                 example: "08:00:00"
 *               termino_em:
 *                 type: string
 *                 format: time
 *                 example: "18:00:00"
 *     responses:
 *       200:
 *         description: Turno editado.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.put('/:id', adminMiddleware, TurnoController.editarTurno)

/**
 * @swagger
 * /turnos/{id}:
 *   delete:
 *     summary: Exclui um turno
 *     tags: [Turno]
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
 *         description: Turno excluído.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.delete('/:id', adminMiddleware, TurnoController.excluirTurno)

module.exports = rotas