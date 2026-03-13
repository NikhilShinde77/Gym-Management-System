import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(localStorage.getItem('gym_token') || null)

  useEffect(() => {
    const saved = localStorage.getItem('gym_user')
    if (saved && token) setUser(JSON.parse(saved))
  }, [])

  const login = (userData, tok) => {
    setUser(userData)
    setToken(tok)
    localStorage.setItem('gym_token', tok)
    localStorage.setItem('gym_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('gym_token')
    localStorage.removeItem('gym_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)