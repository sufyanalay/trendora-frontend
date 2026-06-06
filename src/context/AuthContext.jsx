import { createContext, useContext, useState, useEffect } from 'react'
import axios from '../utils/axios'
import socket from '../utils/socket'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      const saved = localStorage.getItem('user')

      if (token && saved) {
        try {
          const res = await axios.get('/auth/me')
          setUser(res.data)

          // ✅ Socket connect + user room join
          socket.connect()
          socket.emit('join', res.data._id)
        } catch (err) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data))
    setUser(res.data)

    // ✅ Socket connect
    socket.connect()
    socket.emit('join', res.data._id)

    return res.data
  }

  const register = async (formData) => {
    const res = await axios.post('/auth/register', formData)
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data))
    setUser(res.data)

    socket.connect()
    socket.emit('join', res.data._id)

    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    socket.disconnect()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)