module.exports = function adminMiddleware(req, res, proximo) {
    if (!req.usuario?.isAdmin) {
        return res.status(403).json({ erro: 'Acesso restrito a administradores.' })
    }

    return proximo()
}
