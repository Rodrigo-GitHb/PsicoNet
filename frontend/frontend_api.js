/**
 * api.js — Serviço central de comunicação com o backend Django/DRF.
 *
 * Todos os endpoints seguem o padrão:
 *   BASE_URL + /api/<recurso>/
 *
 * O token JWT é lido do localStorage e enviado em todas as requisições
 * autenticadas via cabeçalho "Authorization: Bearer <token>".
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

// ── Utilitários ───────────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem("access_token")
}

function setTokens({ access, refresh }) {
  localStorage.setItem("access_token", access)
  localStorage.setItem("refresh_token", refresh)
}

function clearTokens() {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw Object.assign(new Error(error.detail ?? "Erro na requisição"), { data: error, status: res.status })
  }

  // 204 No Content não tem corpo
  if (res.status === 204) return null
  return res.json()
}

function get(path) {
  return request(path)
}

function post(path, body) {
  const isFormData = body instanceof FormData
  return request(path, {
    method: "POST",
    body: isFormData ? body : JSON.stringify(body),
  })
}

function patch(path, body) {
  const isFormData = body instanceof FormData
  return request(path, {
    method: "PATCH",
    body: isFormData ? body : JSON.stringify(body),
  })
}

function del(path) {
  return request(path, { method: "DELETE" })
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const auth = {
  /** Cria conta e autentica automaticamente. */
  register(data) {
    return post("/api/auth/register/", data).then((res) => {
      setTokens(res)
      return res
    })
  },

  /** Login com username + password. */
  login(credentials) {
    return post("/api/auth/login/", credentials).then((res) => {
      setTokens(res)
      return res
    })
  },

  /** Faz logout limpando os tokens locais. */
  logout() {
    clearTokens()
  },

  /** Retorna os dados do usuário autenticado. */
  me() {
    return get("/api/auth/me/")
  },

  /** Atualiza o perfil do usuário logado (suporta FormData para avatar). */
  updateProfile(data) {
    return patch("/api/auth/me/", data)
  },

  /** Retorna lista de todos os usuários. */
  listUsers() {
    return get("/api/auth/users/")
  },

  /** Retorna o perfil público de um usuário. */
  getUser(username) {
    return get(`/api/auth/users/${username}/`)
  },

  /** Segue ou deixa de seguir um usuário. */
  toggleFollow(username) {
    return post(`/api/auth/users/${username}/follow/`)
  },

  /** Retorna a lista de seguidores de um usuário. */
  followers(username) {
    return get(`/api/auth/users/${username}/followers/`)
  },

  /** Retorna a lista de quem um usuário segue. */
  following(username) {
    return get(`/api/auth/users/${username}/following/`)
  },

  /** Verifica se há token salvo. */
  isLoggedIn() {
    return Boolean(getToken())
  },
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export const posts = {
  /** Feed de posts das pessoas que o usuário segue. */
  feed() {
    return get("/api/posts/feed/")
  },

  /** Feed de descoberta — posts de todos. */
  explore() {
    return get("/api/posts/explore/")
  },

  /** Posts do próprio usuário logado. */
  mine() {
    return get("/api/posts/")
  },

  /** Posts de um usuário específico. */
  byUser(username) {
    return get(`/api/posts/user/${username}/`)
  },

  /** Cria um novo post (suporta FormData para imagem). */
  create(data) {
    return post("/api/posts/", data)
  },

  /** Apaga um post do usuário logado. */
  delete(id) {
    return del(`/api/posts/${id}/`)
  },

  /** Curte ou descurte um post. */
  toggleLike(id) {
    return post(`/api/posts/${id}/like/`)
  },

  /** Retorna os comentários de um post. */
  comments(id) {
    return get(`/api/posts/${id}/comments/`)
  },

  /** Adiciona um comentário a um post. */
  addComment(id, content) {
    return post(`/api/posts/${id}/comments/`, { content })
  },
}

// ── Interações / Sugestões ───────────────────────────────────────────────────

export const interactions = {
  /** Retorna até 5 sugestões de usuários para seguir. */
  suggestions() {
    return get("/api/interactions/suggestions/")
  },
}
