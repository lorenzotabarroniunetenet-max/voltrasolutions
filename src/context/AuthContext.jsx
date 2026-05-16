import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api.js'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (api.auth.getToken()) {
      api.me().then(setUser).catch(() => api.auth.clearToken()).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password, totpToken) => {
    const { token, user } = await api.login(email, password, totpToken)
    api.auth.setToken(token)
    setUser(user)
    return user
  }

  const setUserFromLogin = (u) => setUser(u)

  const logout = () => {
    api.auth.clearToken()
    setUser(null)
  }

  return <AuthCtx.Provider value={{ user, loading, login, logout, setUserFromLogin }}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
