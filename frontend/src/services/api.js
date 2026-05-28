const API_ORIGIN = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_BASE_URL = `${API_ORIGIN.replace(/\/$/, '')}/api`
const ACCESS_TOKEN_KEY = 'pulse.access'
const REFRESH_TOKEN_KEY = 'pulse.refresh'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setTokens(tokens) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function mediaUrl(path) {
  if (!path) {
    return ''
  }

  if (path.startsWith('http')) {
    return path
  }

  return `${API_ORIGIN.replace(/\/$/, '')}${path}`
}

export async function apiRequest(path, options = {}) {
  const token = getAccessToken()
  const isFormData = options.body instanceof FormData
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 204) {
    return null
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload?.detail ||
      payload?.non_field_errors?.join(' ') ||
      Object.values(payload || {}).flat().join(' ') ||
      `Erro na API: ${response.status}`
    throw new Error(message)
  }

  return payload
}
