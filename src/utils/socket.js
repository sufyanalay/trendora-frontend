import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

const socket = io(SOCKET_URL, {
  autoConnect:       false,
  transports:        ['websocket', 'polling'],
  reconnection:      true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
})

socket.on('connect', () => {
  console.log('Socket connected:', socket.id)
})

socket.on('disconnect', () => {
  console.log('Socket disconnected')
})

export default socket