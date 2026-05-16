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
  login: (email, password, emailOtp) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password, emailOtp }) }),
  register: (email, password, name) => request('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
  verifyEmail: (token) => request(`/api/auth/verify-email?token=${token}`),
  resendVerify: (email) => request('/api/auth/resend-verify', { method: 'POST', body: JSON.stringify({ email }) }),
  forgotPassword: (email) => request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token, password) => request('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
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
  adminApproveUser: (id) => request(`/api/admin/users/${id}/approve`, { method: 'POST' }),
  adminRevokeUser: (id) => request(`/api/admin/users/${id}/revoke`, { method: 'POST' }),
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

  // Membri (Sprint 1 + decorations + notifications + ceremonies)
  briefings: () => request('/api/membri/briefings'),
  briefingLatest: () => request('/api/membri/briefings/latest'),
  dossier: () => request('/api/membri/dossier'),
  notifications: () => request('/api/membri/notifications'),
  notificationsUnreadCount: () => request('/api/membri/notifications/unread-count'),
  notificationRead: (id) => request(`/api/membri/notifications/${id}/read`, { method: 'POST' }),
  notificationsReadAll: () => request('/api/membri/notifications/read-all', { method: 'POST' }),
  ceremonyPending: () => request('/api/membri/ceremonies/pending'),
  ceremonyAcknowledge: (id) => request(`/api/membri/ceremonies/${id}/acknowledge`, { method: 'POST' }),
  alboOnore: () => request('/api/membri/albo-onore'),
  documents: () => request('/api/membri/documents'),
  signDocument: (id) => request(`/api/membri/documents/${id}/sign`, { method: 'POST' }),
  updateProfile: (data) => request('/api/membri/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  changePassword: (current, next) => request('/api/auth/change-password', { method: 'POST', body: JSON.stringify({ current, next }) }),
  email2faStatus: () => request('/api/auth/email-2fa/status'),
  email2faEnable: () => request('/api/auth/email-2fa/enable', { method: 'POST' }),
  email2faDisable: (password) => request('/api/auth/email-2fa/disable', { method: 'POST', body: JSON.stringify({ password }) }),
  email2faDismissNudge: () => request('/api/auth/email-2fa/dismiss-nudge', { method: 'POST' }),
  adminToggleUserEmail2fa: (id, enabled) => request(`/api/admin/users/${id}/email-2fa`, { method: 'POST', body: JSON.stringify({ enabled }) }),

  // Admin - briefings, decorations, promotions, documents
  adminBriefings: () => request('/api/admin/briefings'),
  adminCreateBriefing: (data) => request('/api/admin/briefings', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateBriefing: (id, data) => request(`/api/admin/briefings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  adminDeleteBriefing: (id) => request(`/api/admin/briefings/${id}`, { method: 'DELETE' }),
  adminDecorations: () => request('/api/admin/decorations'),
  adminAwardDecoration: (data) => request('/api/admin/decorations/award', { method: 'POST', body: JSON.stringify(data) }),
  adminPromoteUser: (id, data) => request(`/api/admin/users/${id}/promote`, { method: 'POST', body: JSON.stringify(data) }),
  adminLogEntry: (id, data) => request(`/api/admin/users/${id}/log`, { method: 'POST', body: JSON.stringify(data) }),
  adminUserDocuments: (id) => request(`/api/admin/users/${id}/documents`),
  adminUploadDocument: (id, data) => request(`/api/admin/users/${id}/documents`, { method: 'POST', body: JSON.stringify(data) }),
  adminDeleteDocument: (id) => request(`/api/admin/documents/${id}`, { method: 'DELETE' }),

  // Coupon
  validateCoupon: (code, programId) => request('/api/purchase/validate-coupon', { method: 'POST', body: JSON.stringify({ code, programId }) }),

  // Admin - analytics, coupons, audit, export
  adminAnalytics: () => request('/api/admin/analytics'),
  adminCoupons: () => request('/api/admin/coupons'),
  adminCreateCoupon: (data) => request('/api/admin/coupons', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateCoupon: (id, data) => request(`/api/admin/coupons/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  adminDeleteCoupon: (id) => request(`/api/admin/coupons/${id}`, { method: 'DELETE' }),
  adminCouponRedemptions: (id) => request(`/api/admin/coupons/${id}/redemptions`),
  adminAuditLog: () => request('/api/admin/audit-log'),
  adminExportAlbo: () => request('/api/admin/export-albo'),

  auth: { setToken, clearToken, getToken },
}
