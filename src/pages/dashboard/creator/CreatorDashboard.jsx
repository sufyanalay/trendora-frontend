import { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import DashboardLayout from '../shared/DashboardLayout'
import { Link } from 'react-router-dom'
import axios from '../../../utils/axios'
import socket from '../../../utils/socket'

export const creatorLinks = [
  { to: '/creator/dashboard',      icon: '📊', label: 'Dashboard' },
  { to: '/creator/opportunities',  icon: '🔍', label: 'Browse Opportunities' },
  { to: '/creator/applications',   icon: '📋', label: 'My Applications' },
  { to: '/creator/collaborations', icon: '🤝', label: 'Active Collaborations' },
  { to: '/creator/earnings',       icon: '💰', label: 'Earnings' },
  { to: '/creator/profile',        icon: '👤', label: 'Profile Settings' },
]

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function CreatorDashboard() {
  const { user } = useAuth()
  const [stats, setStats]                   = useState({ earnings: 0, active: 0, pending: 0, completed: 0 })
  const [opportunities, setOpportunities]   = useState([])
  const [collaborations, setCollaborations] = useState([])
  const [notifications, setNotifications]   = useState([])
  const [payments, setPayments]             = useState([])
  const [loading, setLoading]               = useState(true)

  useEffect(() => {
  fetchAll()

  // Real time update
  socket.on('new_notification', () => {
    fetchAll()
  })

  return () => socket.off('new_notification')
}, [])

const fetchAll = async () => {
  try {
    const [oppsRes, collabsRes, notifsRes, paymentsRes, appsRes] = await Promise.all([
      axios.get('/opportunities'),
      axios.get('/collaborations/creator'),
      axios.get('/notifications'),
      axios.get('/payments/creator'),
      axios.get('/applications/my'),
    ])

    setOpportunities(oppsRes.data.slice(0, 3))
    setCollaborations(collabsRes.data)
    setNotifications(notifsRes.data.slice(0, 5))
    setPayments(paymentsRes.data)

    const totalEarnings   = paymentsRes.data
      .filter(p => p.status === 'released')
      .reduce((a, p) => a + (p.creatorAmount || 0), 0)

    const pendingEarnings = paymentsRes.data
      .filter(p => p.status === 'verified')
      .reduce((a, p) => a + (p.creatorAmount || 0), 0)

    const activeCollabs   = collabsRes.data
      .filter(c => c.status === 'active' || c.status === 'submitted' || c.status === 'revision').length

    const completed       = collabsRes.data
      .filter(c => c.status === 'completed').length

    const pendingApps     = appsRes.data
      .filter(a => a.status === 'pending' || a.status === 'countered').length

    setStats({
      earnings: totalEarnings,
      pending:  pendingEarnings,
      active:   activeCollabs,
      completed,
      pendingApps,
    })

  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}

  const statusColors = {
    active:    'bg-blue-50 text-blue-700',
    submitted: 'bg-yellow-50 text-yellow-700',
    completed: 'bg-green-50 text-green-700',
    revision:  'bg-orange-50 text-orange-700',
    cancelled: 'bg-red-50 text-red-600',
  }

  const notifIcons = {
    application:   '📋',
    collaboration: '🤝',
    payment:       '💰',
    message:       '💬',
    system:        '🔔',
  }

  return (
    <DashboardLayout links={creatorLinks}>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-secondary">
            {getGreeting()}, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted text-sm mt-1">Welcome back to your creator workspace</p>
        </div>
        <Link to="/creator/opportunities"
          className="hidden sm:block px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors">
          + Browse Opportunities
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
       {[
  { label: 'Total Earnings',    value: `PKR ${stats.earnings.toLocaleString()}`,  icon: '💰', color: 'bg-green-50 text-green-700',   sub: 'View Earnings →',     to: '/creator/earnings' },
  { label: 'Pending Earnings',  value: `PKR ${stats.pending.toLocaleString()}`,   icon: '⏳', color: 'bg-orange-50 text-orange-600', sub: 'View Details →',      to: '/creator/earnings' },
  { label: 'Active Projects',   value: stats.active,                               icon: '🤝', color: 'bg-blue-50 text-blue-700',     sub: 'View Projects →',     to: '/creator/collaborations' },
  { label: 'Pending Apps',      value: stats.pendingApps || 0,                     icon: '📋', color: 'bg-purple-50 text-primary',    sub: 'View Applications →', to: '/creator/applications' },
].map((s, i) => (
          <div key={i} className="bg-card rounded-2xl p-5 border border-border shadow-card hover:shadow-purple transition-all">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-xl mb-3`}>
              {s.icon}
            </div>
            <div className={`text-xl font-black ${s.text}`}>{s.value}</div>
            <div className="text-xs text-muted mt-0.5 mb-2">{s.label}</div>
            <Link to={s.to} className="text-xs text-primary font-semibold hover:underline">{s.sub}</Link>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Latest Opportunities */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-secondary text-lg">Latest Opportunities</h2>
            <Link to="/creator/opportunities" className="text-xs text-primary font-semibold hover:underline">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-sm">No opportunities available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {opportunities.map((op, i) => (
                <div key={op._id} className="flex items-center justify-between p-4 bg-surface rounded-xl hover:bg-primary-light transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      i === 0 ? 'bg-blue-100' : i === 1 ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      {i === 0 ? '🎬' : i === 1 ? '✏️' : '📸'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-secondary group-hover:text-primary transition-colors line-clamp-1">
                        {op.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                        <span>{op.brandName}</span>
                        <span>·</span>
                        <span>{op.deadline} Days Left</span>
                        <span>·</span>
                        <span>{op.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-primary">PKR {op.budget?.toLocaleString()}</p>
                    <Link to="/creator/opportunities"
                      className="text-xs text-muted hover:text-primary transition-colors">
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-secondary text-lg">Notifications</h2>
            <span className="text-xs text-primary font-semibold cursor-pointer hover:underline">View All</span>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n._id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  n.isRead ? 'bg-surface' : 'bg-primary-light'
                }`}>
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-sm flex-shrink-0 shadow-sm">
                    {notifIcons[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-secondary line-clamp-1">{n.title}</p>
                    <p className="text-xs text-muted mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-muted mt-1">
                      {new Date(n.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  {!n.isRead && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Projects + Wallet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active Projects */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-secondary text-lg">Active Projects</h2>
            <Link to="/creator/collaborations" className="text-xs text-primary font-semibold hover:underline">
              View All Projects →
            </Link>
          </div>

          {collaborations.filter(c => c.status === 'active' || c.status === 'submitted' || c.status === 'revision').length === 0 ? (
            <div className="text-center py-8 text-muted">
              <div className="text-4xl mb-2">🤝</div>
              <p className="text-sm">No active projects</p>
              <Link to="/creator/opportunities"
                className="inline-block mt-3 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl">
                Browse Opportunities
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {collaborations.filter(c => ['active', 'submitted', 'revision'].includes(c.status)).slice(0, 3).map(c => {
                const progress = c.status === 'active' ? 30 : c.status === 'submitted' ? 80 : 50
                return (
                  <div key={c._id} className="p-4 bg-surface rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold text-sm">
                          {c.brandId?.brandName?.[0] || c.brandId?.fullName?.[0] || 'B'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-secondary line-clamp-1">
                            {c.opportunityId?.title}
                          </p>
                          <p className="text-xs text-muted">
                            {c.brandId?.brandName || c.brandId?.fullName}
                          </p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[c.status]}`}>
                            {c.status === 'active' ? 'In Progress'
                              : c.status === 'submitted' ? 'Under Review'
                              : 'Revision'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-xs text-muted flex-shrink-0">
                        <p>Budget</p>
                        <p className="font-bold text-primary">PKR {c.agreedAmount?.toLocaleString()}</p>
                        <p className="mt-1">Deadline</p>
                        <p className="font-bold text-secondary">{c.deadline} Days</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-primary">{progress}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Wallet Summary */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6">
          <h2 className="font-bold text-secondary text-lg mb-5">Wallet Summary</h2>

          <div className="space-y-4 mb-6">
            {[
              { label: 'Available Balance', value: `PKR ${stats.earnings.toLocaleString()}`,  icon: '💰', color: 'bg-green-50 text-green-700' },
              { label: 'Reserved Balance',  value: `PKR ${stats.pending.toLocaleString()}`,   icon: '⏳', color: 'bg-orange-50 text-orange-600' },
              { label: 'Total Earnings',    value: `PKR ${(stats.earnings + stats.pending).toLocaleString()}`, icon: '📊', color: 'bg-blue-50 text-blue-700' },
            ].map((w, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${w.color}`}>
                    {w.icon}
                  </div>
                  <span className="text-xs text-muted font-medium">{w.label}</span>
                </div>
                <span className="text-sm font-bold text-secondary">{w.value}</span>
              </div>
            ))}
          </div>

          <Link
            to="/creator/earnings"
            className="block w-full text-center py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors text-sm"
          >
            View Earnings
          </Link>
        </div>
      </div>

    </DashboardLayout>
  )
}