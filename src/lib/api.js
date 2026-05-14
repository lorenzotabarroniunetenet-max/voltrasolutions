const API = import.meta.env.VITE_API_URL || 'https://voltra-backend-m4q8.onrender.com'

function getToken() { return localStorage.getItem('voltra_token') }
function setToken(t) { localStorage.setItem('voltra_token', t) }
function clearToken() { localStorage.removeItem('voltra_token') }

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  // Auth
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email, password, name) => request('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
  verifyEmail: (token) => request(`/api/auth/verify-email?token=${token}`),
  resendVerify: (email) => request('/api/auth/resend-verify', { method: 'POST', body: JSON.stringify({ email }) }),
  me: () => request('/api/auth/me'),

  // Trader (prop)
  myAccounts: () => request('/api/prop/accounts'),
  account: (id) => request(`/api/prop/accounts/${id}`),
  accountSnapshots: (id, from, to) => request(`/api/prop/accounts/${id}/snapshots${from ? `?from=${from}&to=${to}` : ''}`),
  accountStats: (id) => request(`/api/prop/accounts/${id}/stats`),
  myPayouts: () => request('/api/prop/payouts'),
  requestPayout: (data) => request('/api/prop/payouts', { method: 'POST', body: JSON.stringify(data) }),

  // Purchase
  programs: () => request('/api/purchase/programs'),
  requestPurchase: (data) => request('/api/purchase/request', { method: 'POST', body: JSON.stringify(data) }),

  // Admin
  adminUsers: () => request('/api/admin/users'),
  adminAccounts: () => request('/api/admin/accounts'),
  adminCreateAccount: (data) => request('/api/admin/accounts', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateAccount: (id, data) => request(`/api/admin/accounts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  adminPrograms: () => request('/api/admin/programs'),
  adminCreateProgram: (data) => request('/api/admin/programs', { method: 'POST', body: JSON.stringify(data) }),
  adminCreateSnapshots: (data) => request('/api/admin/snapshots', { method: 'POST', body: JSON.stringify(data) }),
  adminDeleteSnapshot: (id) => request(`/api/admin/snapshots/${id}`, { method: 'DELETE' }),
  adminPayouts: (status) => request(`/api/admin/payouts${status ? `?status=${status}` : ''}`),
  adminUpdatePayout: (id, data) => request(`/api/admin/payouts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  auth: { setToken, clearToken, getToken },
}
