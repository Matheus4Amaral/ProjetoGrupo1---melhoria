const { Router } = require('express')

const CidadeController = require('../controller/CidadeController')

const rotas = Router()

/**
 * @swagger
 * /cidades:
 *   get:
 *     summary: Lista todas as cidades
 *     tags: [Cidade]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cidades.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
rotas.get('/', CidadeController.buscarCidades)

module.exports = rotas
