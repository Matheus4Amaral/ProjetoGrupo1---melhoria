const BASE_URL = 'http://localhost:3000'

const TOKEN_KEY = 'hubparking:token'

function obterToken() {
  return localStorage.getItem(TOKEN_KEY)
}

async function request(path, { method = 'GET', body, headers } = {}) {
  const token = obterToken()

  const resposta = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const dados = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    throw new Error(dados?.erro || 'Não foi possível completar a requisição.')
  }

  return dados
}

const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
  TOKEN_KEY,
}

export default api