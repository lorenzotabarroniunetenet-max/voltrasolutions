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
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email, password, name) => request('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
  verifyEmail: (token) => request(`/api/auth/verify-email?token=${token}`),
  resendVerify: (email) => request('/api/auth/resend-verify', { method: 'POST', body: JSON.stringify({ email }) }),
  me: () => request('/api/auth/me'),

  myAccounts: () => request('/api/prop/accounts'),
  account: (id) => request(`/api/prop/accounts/${id}`),
  accountSnapshots: (id, from, to) => request(`/api/prop/accounts/${id}/snapshots${from ? `?from=${from}&to=${to}` : ''}`),
  accountStats: (id) => request(`/api/prop/accounts/${id}/stats`),
  myPayouts: () => request('/api/prop/payouts'),
  requestPayout: (data) => request('/api/prop/payouts', { method: 'POST', body: JSON.stringify(data) }),

  programs: () => request('/api/purchase/programs'),
  paymentInfo: () => request('/api/purchase/payment-info'),
  requestPurchase: (data) => request('/api/purchase/request', { method: 'POST', body: JSON.stringify(data) }),

  contactInfo: () => request('/api/contact/info'),
  sendContact: (data) => request('/api/contact/send', { method: 'POST', body: JSON.stringify(data) }),

  // Admin
  adminUsers: () => request('/api/admin/users'),
  adminUserDetail: (id) => request(`/api/admin/users/${id}`),
  adminUpdateUser: (id, data) => request(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  adminDeleteUser: (id) => request(`/api/admin/users/${id}`, { method: 'DELETE' }),
  adminAccounts: () => request('/api/admin/accounts'),
  adminCreateAccount: (data) => request('/api/admin/accounts', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateAccount: (id, data) => request(`/api/admin/accounts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  adminDeleteAccount: (id) => request(`/api/admin/accounts/${id}`, { method: 'DELETE' }),
  adminAccountSnapshots: (id) => request(`/api/admin/accounts/${id}/snapshots`),
  adminPrograms: () => request('/api/admin/programs'),
  adminCreateProgram: (data) => request('/api/admin/programs', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateProgram: (id, data) => request(`/api/admin/programs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  adminDeleteProgram: (id) => request(`/api/admin/programs/${id}`, { method: 'DELETE' }),
  adminCreateSnapshots: (data) => request('/api/admin/snapshots', { method: 'POST', body: JSON.stringify(data) }),
  adminDeleteSnapshot: (id) => request(`/api/admin/snapshots/${id}`, { method: 'DELETE' }),
  adminPayouts: (status) => request(`/api/admin/payouts${status ? `?status=${status}` : ''}`),
  adminUpdatePayout: (id, data) => request(`/api/admin/payouts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  adminSettings: () => request('/api/admin/settings'),
  adminUpdateSetting: (key, value, isPublic) => request(`/api/admin/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value, isPublic }) }),
  adminBulkSettings: (items) => request('/api/admin/settings/bulk', { method: 'POST', body: JSON.stringify(items) }),

  auth: { setToken, clearToken, getToken },
}
