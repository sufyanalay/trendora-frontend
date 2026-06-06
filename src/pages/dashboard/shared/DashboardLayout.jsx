import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import axios from '../../../utils/axios'
import socket from '../../../utils/socket'

export default function DashboardLayout({ children, links }) {
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notifOpen, setNotifOpen]         = useState(false)
  const [unreadCount, setUnreadCount]     = useState(0)
  const notifRef                          = useRef(null)

  const { user, logout } = useAuth()
  const location         = useLocation()
  const navigate         = useNavigate()

  // ─── Fetch + Socket Setup ─────────────────────────
  useEffect(() => {
    fetchNotifications()

    // Real time notification
    socket.on('new_notification', (notif) => {
      setNotifications(prev => [notif, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    return () => {
      socket.off('new_notification')
    }
  }, [])

  // ─── Outside Click Close ──────────────────────────
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications')
      setNotifications(res.data)
      setUnreadCount(res.data.filter(n => !n.isRead).length)
    } catch {
      setNotifications([])
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await axios.put('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {}
  }

  const handleNotifClick = async (notif) => {
    try {
      if (!notif.isRead) {
        await axios.put(`/notifications/${notif._id}/read`)
        setNotifications(prev => prev.map(n =>
          n._id === notif._id ? { ...n, isRead: true } : n
        ))
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      setNotifOpen(false)
      if (notif.link) navigate(notif.link)
    } catch {}
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const notifIcons = {
    application:   '📋',
    collaboration: '🤝',
    payment:       '💰',
    message:       '💬',
    system:        '🔔',
  }

  return (
    <div className="min-h-screen bg-surface flex">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:flex`}>

        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-black text-sm">T</span>
          </div>
          <span className="text-primary font-black text-lg">TRENDORA</span>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold flex-shrink-0">
              {user?.fullName?.[0] || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-secondary truncate">{user?.fullName}</p>
              <p className="text-xs text-muted capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-primary text-white shadow-purple'
                  : 'text-muted hover:bg-primary-light hover:text-primary'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">

          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-muted hover:bg-surface"
          >
            ☰
          </button>

          <div className="flex items-center gap-3 ml-auto">

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl hover:bg-surface text-xl transition-colors"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-purple border border-border z-50 overflow-hidden">

                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-secondary text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-96 overflow-y-auto divide-y divide-border">
                    {notifications.length === 0 ? (
                      <div className="text-center py-10 text-muted">
                        <div className="text-3xl mb-2">🔔</div>
                        <p className="text-sm font-medium">No notifications yet</p>
                        <p className="text-xs mt-1">We'll notify you when something happens</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n._id}
                          onClick={() => handleNotifClick(n)}
                          className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-surface transition-colors ${
                            !n.isRead ? 'bg-primary-light' : ''
                          }`}
                        >
                          {/* Icon */}
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${
                            n.type === 'payment'       ? 'bg-green-50'
                            : n.type === 'collaboration' ? 'bg-blue-50'
                            : n.type === 'application'   ? 'bg-yellow-50'
                            : n.type === 'message'       ? 'bg-purple-50'
                            : 'bg-surface'
                          }`}>
                            {notifIcons[n.type] || '🔔'}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-secondary line-clamp-1">
                              {n.title}
                            </p>
                            <p className="text-xs text-muted mt-0.5 line-clamp-2">
                              {n.message}
                            </p>
                            <p className="text-xs text-muted mt-1">
                              {new Date(n.createdAt).toLocaleDateString('en-PK', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>

                          {/* Unread dot */}
                          {!n.isRead && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-border bg-surface text-center">
                      <p className="text-xs text-muted">
                        {unreadCount > 0
                          ? `${unreadCount} unread · ${notifications.length} total`
                          : `${notifications.length} notifications — all read`}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Avatar + Name */}
            <div className="flex items-center gap-2 pl-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user?.fullName?.[0] || 'U'}
              </div>
              <div className="hidden sm:block min-w-0">
                <p className="text-xs font-bold text-secondary truncate max-w-[120px]">
                  {user?.fullName}
                </p>
                <p className="text-xs text-muted capitalize">{user?.role}</p>
              </div>
            </div>

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}