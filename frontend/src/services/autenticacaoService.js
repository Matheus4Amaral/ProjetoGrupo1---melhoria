import api from './api'

const TOKEN_KEY = 'hubparking:token'
const USUARIO_KEY = 'hubparking:usuario'

async function login({ email, senha }) {
    const dados = await api.post('/autenticacao/login', { email, senha })

    localStorage.setItem(TOKEN_KEY, dados.token)
    localStorage.setItem(USUARIO_KEY, JSON.stringify(dados.pessoa))

    return dados.pessoa
}

async function cadastrar(dadosPessoa) {
    return await api.post('/pessoa', dadosPessoa)
}

function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USUARIO_KEY)
}

function obterUsuarioLogado() {
    const usuario = localStorage.getItem(USUARIO_KEY)
    return usuario ? JSON.parse(usuario) : null
}

function atualizarUsuarioLocal(pessoa) {
    localStorage.setItem(USUARIO_KEY, JSON.stringify(pessoa));
}

function estaAutenticado() {
    return Boolean(localStorage.getItem(TOKEN_KEY))
}

export default {
    login,
    cadastrar,
    logout,
    obterUsuarioLogado,
    atualizarUsuarioLocal,
    estaAutenticado,
}
