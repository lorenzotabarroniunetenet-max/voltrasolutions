import { createContext, useContext, useState, useEffect } from 'react'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('voltra_user')
    if (u) try { setUser(JSON.parse(u)) } catch {}
    setLoading(false)
  }, [])

  const login = (u) => { setUser(u); localStorage.setItem('voltra_user', JSON.stringify(u)) }
  const logout = () => { setUser(null); localStorage.removeItem('voltra_user'); localStorage.removeItem('voltra_token') }

  return <Ctx.Provider value={{ user, login, logout, loading, isAdmin: user?.role === 'ADMIN' }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
