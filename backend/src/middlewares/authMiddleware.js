const jwt = require('jsonwebtoken')

module.exports = function autenticacaoMiddleware(req, res, proximo) {
    const cabecalhoAutorizacao = req.headers.authorization

    if (!cabecalhoAutorizacao) {
        return res.status(401).json({ erro: 'Token não fornecido.' })
    }

    const [, token] = cabecalhoAutorizacao.split(' ')

    try {
        const dadosToken = jwt.verify(token, process.env.JWT_SECRET)

        req.usuario = {
            id: dadosToken.id,
            email: dadosToken.email,
            isAdmin: dadosToken.isAdmin
        }

        return proximo()
    } catch {
        return res.status(401).json({ erro: 'Token inválido ou expirado.' })
    }
}
