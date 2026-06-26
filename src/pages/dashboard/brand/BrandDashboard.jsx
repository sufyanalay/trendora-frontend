import { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
// import DashboardLayout from '../shared/DashboardLayout'
import { Link } from 'react-router-dom'
import axios from '../../../utils/axios'
import socket from '../../../utils/socket'

export const brandLinks = [
  { to: '/brand/dashboard',        icon: '📊', label: 'Dashboard' },
  { to: '/brand/post-opportunity', icon: '📢', label: 'Post Opportunity' },
  { to: '/brand/opportunities',    icon: '📋', label: 'My Opportunities' },
  { to: '/brand/applications',     icon: '👥', label: 'Applications Received' },
  { to: '/brand/collaborations',   icon: '🤝', label: 'Active Collaborations' },
  { to: '/brand/payments',         icon: '💳', label: 'Payments' },
  { to: '/brand/profile',          icon: '🏢', label: 'Profile Settings' },
]

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function BrandDashboard() {
  const { user } = useAuth()
  const [stats, setStats]                   = useState({ opportunities: 0, applications: 0, active: 0, spent: 0 })
  const [opportunities, setOpportunities]   = useState([])
  const [applications, setApplications]     = useState([])
  const [collaborations, setCollaborations] = useState([])
  const [notifications, setNotifications]   = useState([])
  const [loading, setLoading]               = useState(true)

  useEffect(() => {
  fetchAll()

  socket.on('new_notification', () => {
    fetchAll()
  })

  return () => socket.off('new_notification')
}, [])
 const fetchAll = async () => {
  try {
    const [oppsRes, appsRes, collabsRes, notifsRes, paymentsRes] = await Promise.all([
      axios.get('/opportunities/my/list'),
      axios.get('/applications/brand'),
      axios.get('/collaborations/brand'),
      axios.get('/notifications'),
      axios.get('/payments/brand'),
    ])

    setOpportunities(oppsRes.data.slice(0, 3))
    setApplications(appsRes.data.slice(0, 5))
    setCollaborations(collabsRes.data)
    setNotifications(notifsRes.data.slice(0, 5))

    const totalSpent = paymentsRes.data
      .filter(p => p.status === 'released')
      .reduce((a, p) => a + (p.totalAmount || 0), 0)

    const pendingPayments = paymentsRes.data
      .filter(p => ['pending', 'screenshot_uploaded'].includes(p.status))
      .reduce((a, p) => a + (p.totalAmount || 0), 0)

    setStats({
      opportunities: oppsRes.data.filter(o => o.status === 'active').length,
      applications:  appsRes.data.filter(a => a.status === 'pending' || a.status === 'countered').length,
      active:        collabsRes.data.filter(c => ['active', 'submitted', 'revision'].includes(c.status)).length,
      spent:         totalSpent,
      pending:       pendingPayments,
    })

  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}

  const notifIcons = {
    application:   '📋',
    collaboration: '🤝',
    payment:       '💰',
    message:       '💬',
    system:        '🔔',
  }

  const statusColors = {
    active:    'bg-blue-50 text-blue-700',
    submitted: 'bg-yellow-50 text-yellow-700',
    completed: 'bg-green-50 text-green-700',
    revision:  'bg-orange-50 text-orange-700',
  }

  return (
     <>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-secondary">
            {getGreeting()}, {user?.brandName || user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted text-sm mt-1">Manage your campaigns and collaborations</p>
        </div>
        <Link to="/brand/post-opportunity"
          className="hidden sm:block px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors">
          + Post Opportunity
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
     {[
  { label: 'Active Opportunities', value: stats.opportunities,                         icon: '📢', color: 'bg-blue-50 text-blue-700',     sub: 'View All →',        to: '/brand/opportunities' },
  { label: 'Pending Applications', value: stats.applications,                          icon: '👥', color: 'bg-yellow-50 text-yellow-700', sub: 'Review →',          to: '/brand/applications' },
  { label: 'Active Collabs',       value: stats.active,                                icon: '🤝', color: 'bg-green-50 text-green-700',   sub: 'View Projects →',   to: '/brand/collaborations' },
  { label: 'Total Spent',          value: `PKR ${stats.spent.toLocaleString()}`,       icon: '💳', color: 'bg-purple-50 text-primary',    sub: 'View Payments →',   to: '/brand/payments' },
].map((s, i) =>  (
          <div key={i} className="bg-card rounded-2xl p-5 border border-border shadow-card hover:shadow-purple transition-all">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-xl mb-3`}>
              {s.icon}
            </div>
            <div className="text-xl font-black text-secondary">{s.value}</div>
            <div className="text-xs text-muted mt-0.5 mb-2">{s.label}</div>
            <Link to={s.to} className="text-xs text-primary font-semibold hover:underline">{s.sub}</Link>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-secondary text-lg">Recent Applications</h2>
            <Link to="/brand/applications" className="text-xs text-primary font-semibold hover:underline">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <div className="text-4xl mb-2">👥</div>
              <p className="text-sm">No applications yet</p>
              <Link to="/brand/post-opportunity"
                className="inline-block mt-3 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl">
                Post Opportunity
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app, i) => (
                <div key={app._id} className="flex items-center justify-between p-4 bg-surface rounded-xl hover:bg-primary-light transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${
                      i % 3 === 0 ? 'from-purple-400 to-purple-700'
                      : i % 3 === 1 ? 'from-blue-400 to-blue-700'
                      : 'from-green-400 to-green-700'
                    } flex items-center justify-center text-white font-bold text-sm`}>
                      {app.creatorId?.fullName?.[0] || 'C'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-secondary">{app.creatorId?.fullName}</p>
                      <p className="text-xs text-muted line-clamp-1">{app.opportunityId?.title}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-primary">PKR {app.counterAmount?.toLocaleString()}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      app.status === 'pending' ? 'bg-yellow-50 text-yellow-700'
                      : app.status === 'accepted' ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                    }`}>
                      {app.status}
                    </span>
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
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n._id} className={`flex items-start gap-3 p-3 rounded-xl ${
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
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Collaborations */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-secondary text-lg">Active Collaborations</h2>
          <Link to="/brand/collaborations" className="text-xs text-primary font-semibold hover:underline">
            View All →
          </Link>
        </div>

        {collaborations.filter(c => ['active', 'submitted', 'revision'].includes(c.status)).length === 0 ? (
          <div className="text-center py-8 text-muted">
            <div className="text-4xl mb-2">🤝</div>
            <p className="text-sm">No active collaborations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collaborations.filter(c => ['active', 'submitted', 'revision'].includes(c.status)).slice(0, 3).map(c => {
              const progress = c.status === 'active' ? 30 : c.status === 'submitted' ? 80 : 50
              return (
                <div key={c._id} className="p-4 bg-surface rounded-xl border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold">
                      {c.creatorId?.fullName?.[0] || 'C'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-secondary truncate">{c.creatorId?.fullName}</p>
                      <p className="text-xs text-muted truncate">{c.opportunityId?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className={`font-semibold px-2 py-0.5 rounded-full ${statusColors[c.status]}`}>
                      {c.status === 'active' ? 'In Progress' : c.status === 'submitted' ? 'Under Review' : 'Revision'}
                    </span>
                    <span className="font-bold text-primary">PKR {c.agreedAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-primary">{progress}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

     </>
  )
}