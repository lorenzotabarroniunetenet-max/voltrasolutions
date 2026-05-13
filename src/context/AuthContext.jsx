import { createContext, useContext, useState, useEffect } from 'react'
import { CURRENT_USER } from '../lib/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Test user already logged in
  const [user, setUser] = useState(CURRENT_USER)
  const [token, setToken] = useState('mock-jwt-token')

  useEffect(() => {
    const stored = localStorage.getItem('voltra_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
  }, [])

  const login = (u, t) => {
    setUser(u); setToken(t)
    localStorage.setItem('voltra_user', JSON.stringify(u))
    localStorage.setItem('voltra_token', t)
  }
  const logout = () => {
    setUser(null); setToken(null)
    localStorage.removeItem('voltra_user')
    localStorage.removeItem('voltra_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
