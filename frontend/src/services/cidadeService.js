import api from './api'

async function buscarCidades(nome) {
    const parametros = new URLSearchParams({ nome })
    return await api.get(`/cidades?${parametros.toString()}`)
}

export default {
    buscarCidades,
}
