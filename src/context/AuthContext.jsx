import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setTokenState] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('voltra_token')
    const u = localStorage.getItem('voltra_user')
    if (t && u) {
      try { setUser(JSON.parse(u)); setTokenState(t) } catch {}
    }
    setLoading(false)
  }, [])

  const login = (u, t) => {
    setUser(u); setTokenState(t)
    localStorage.setItem('voltra_user', JSON.stringify(u))
    localStorage.setItem('voltra_token', t)
  }
  const logout = () => {
    setUser(null); setTokenState(null)
    localStorage.removeItem('voltra_user')
    localStorage.removeItem('voltra_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
