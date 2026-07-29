const { Router } = require('express')
const authMiddleware = require('../../../middlewares/authMiddleware')

const AutenticacaoController = require('../controller/AutenticacaoController')

const rotas = Router()

/**
 * @swagger
 * /autenticacao/login:
 *   post:
 *     summary: Autentica o usuário (Login)
 *     description: Recebe email e senha, valida e retorna um token JWT para uso nas demais rotas protegidas.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: SEED@email.com
 *               senha:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login bem sucedido. Retorna os dados do usuário e o token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pessoa:
 *                   $ref: '#/components/schemas/Pessoa'
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Credenciais incorretas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
rotas.post('/login', AutenticacaoController.login)
rotas.post('/verificar-senha', authMiddleware, AutenticacaoController.verificarSenha)

module.exports = rotas
