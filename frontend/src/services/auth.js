import api from './api'

const TOKEN_KEY = 'sn_ai_token'

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function login(username, password) {
  const form = new FormData()
  form.append('username', username)
  form.append('password', password)
  const res = await api.post('/api/auth/token', form)
  const token = res.data.access_token
  saveToken(token)
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return token
}

export function attachToken() {
  const t = getToken()
  if (t) api.defaults.headers.common['Authorization'] = `Bearer ${t}`
}

export async function currentUser() {
  try {
    const res = await api.get('/api/auth/me')
    return res.data
  } catch (e) {
    return null
  }
}

// run once at app startup
attachToken()

export default {
  login,
  saveToken,
  getToken,
  clearToken,
}
