// import { useState, useEffect } from 'react'
// import DashboardLayout from '../shared/DashboardLayout'
// import { Link } from 'react-router-dom'
// import axios from '../../../utils/axios'

// export const adminLinks = [
//   { to: '/admin/dashboard',      icon: '📊', label: 'Dashboard' },
//   { to: '/admin/users',          icon: '👥', label: 'All Users' },
//   { to: '/admin/opportunities',  icon: '📢', label: 'All Opportunities' },
//   { to: '/admin/collaborations', icon: '🤝', label: 'All Collaborations' },
//   { to: '/admin/payments',       icon: '💳', label: 'Payments & Commission' },
//   { to: '/admin/disputes',       icon: '⚖️', label: 'Disputes' },
// ]

// export default function AdminDashboard() {
// const [stats, setStats] = useState({
//   users: 0, opportunities: 0, collaborations: 0,
//   revenue: 0, pendingPayments: 0, activeCollabs: 0
// })
//   const [recentUsers, setRecentUsers]               = useState([])
//   const [recentCollabs, setRecentCollabs]           = useState([])
//   const [pendingPayments, setPendingPayments]       = useState([])
//   const [loading, setLoading]                       = useState(true)

//   useEffect(() => { fetchAll() }, [])

//  const fetchAll = async () => {
//   try {
//     const [usersRes, oppsRes, collabsRes, paymentsRes] = await Promise.all([
//       axios.get('/admin/users'),
//       axios.get('/admin/opportunities'),
//       axios.get('/admin/collaborations'),
//       axios.get('/admin/payments'),
//     ])

//     const totalRevenue = paymentsRes.data
//       .filter(p => p.status === 'released')
//       .reduce((a, p) => a + (p.platformCommission || 0), 0)

//     const pendingPayments = paymentsRes.data
//       .filter(p => p.status === 'pending' || p.status === 'screenshot_uploaded').length

//     const activeCollabs = collabsRes.data
//       .filter(c => c.status === 'active' || c.status === 'submitted').length

//     setStats({
//       users:          usersRes.data.length,
//       opportunities:  oppsRes.data.length,
//       collaborations: collabsRes.data.length,
//       revenue:        totalRevenue,
//       pendingPayments,
//       activeCollabs,
//     })

//     setRecentUsers(usersRes.data.slice(0, 5))
//     setRecentCollabs(collabsRes.data.slice(0, 5))
//     setPendingPayments(paymentsRes.data.filter(p =>
//       p.status === 'pending' || p.status === 'screenshot_uploaded'
//     ).slice(0, 5))

//   } catch (err) {
//     console.error(err)
//   } finally {
//     setLoading(false)
//   }
// }

//   const roleColors = {
//     creator: 'bg-blue-50 text-blue-700',
//     brand:   'bg-yellow-50 text-yellow-700',
//     admin:   'bg-purple-50 text-primary',
//   }

//   const collabStatusColors = {
//     active:    'bg-blue-50 text-blue-700',
//     submitted: 'bg-yellow-50 text-yellow-700',
//     completed: 'bg-green-50 text-green-700',
//     revision:  'bg-orange-50 text-orange-700',
//     cancelled: 'bg-red-50 text-red-600',
//   }

//   const paymentStatusColors = {
//     pending:             'bg-gray-100 text-gray-600',
//     screenshot_uploaded: 'bg-yellow-50 text-yellow-700',
//     verified:            'bg-blue-50 text-blue-700',
//     released:            'bg-green-50 text-green-700',
//   }

//   return (
//     <DashboardLayout links={adminLinks}>

//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-2xl md:text-3xl font-black text-secondary">
//           Admin Dashboard 👑
//         </h1>
//         <p className="text-muted text-sm mt-1">Full platform overview and control panel.</p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//        {[
//   { label: 'Total Users',          value: stats.users,                                    icon: '👥', color: 'bg-blue-50 text-blue-700',     to: '/admin/users' },
//   { label: 'Total Opportunities',  value: stats.opportunities,                            icon: '📢', color: 'bg-yellow-50 text-yellow-700', to: '/admin/opportunities' },
//   { label: 'Active Collabs',       value: stats.activeCollabs,                            icon: '🤝', color: 'bg-green-50 text-green-700',   to: '/admin/collaborations' },
//   { label: 'Total Revenue',        value: `PKR ${stats.revenue.toLocaleString()}`,        icon: '💰', color: 'bg-purple-50 text-primary',    to: '/admin/payments' },
// ].map((s, i) => (
//   <Link key={i} to={s.to}
//     className="bg-card rounded-2xl p-5 border border-border shadow-card hover:shadow-purple hover:border-primary transition-all">
//     <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color}`}>
//       {s.icon}
//     </div>
//     <div className="text-xl font-black text-secondary">{s.value}</div>
//     <div className="text-xs text-muted mt-0.5">{s.label}</div>
//   </Link>
// ))}

//       </div>
//       {/* Extra Stats */}
// <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
//   <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-center gap-4">
//     <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-2xl">⏳</div>
//     <div>
//       <div className="text-2xl font-black text-yellow-700">{stats.pendingPayments}</div>
//       <div className="text-sm text-yellow-600 font-medium">Payments Awaiting Action</div>
//       <Link to="/admin/payments" className="text-xs text-yellow-700 font-bold hover:underline">
//         Review Now →
//       </Link>
//     </div>
//   </div>
//   <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
//     <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">🤝</div>
//     <div>
//       <div className="text-2xl font-black text-green-700">{stats.collaborations}</div>
//       <div className="text-sm text-green-600 font-medium">Total Collaborations</div>
//       <Link to="/admin/collaborations" className="text-xs text-green-700 font-bold hover:underline">
//         View All →
//       </Link>
//     </div>
//   </div>
// </div>

//       {/* Main Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

//         {/* Recent Users */}
//         <div className="bg-card rounded-2xl border border-border shadow-card p-6">
//           <div className="flex items-center justify-between mb-5">
//             <h2 className="font-bold text-secondary text-lg">Recent Users</h2>
//             <Link to="/admin/users" className="text-xs text-primary font-semibold hover:underline">
//               View All →
//             </Link>
//           </div>

//           {loading ? (
//             <div className="space-y-3">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
//               ))}
//             </div>
//           ) : recentUsers.length === 0 ? (
//             <div className="text-center py-8 text-muted">
//               <div className="text-4xl mb-2">👥</div>
//               <p className="text-sm">No users yet</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {recentUsers.map((u, i) => (
//                 <div key={u._id} className="flex items-center justify-between p-3 bg-surface rounded-xl hover:bg-primary-light transition-colors">
//                   <div className="flex items-center gap-3">
//                     <div className={`w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm ${
//                       i % 3 === 0 ? 'from-purple-400 to-purple-700'
//                       : i % 3 === 1 ? 'from-blue-400 to-blue-700'
//                       : 'from-green-400 to-green-700'
//                     }`}>
//                       {u.fullName?.[0] || 'U'}
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-secondary">{u.fullName}</p>
//                       <p className="text-xs text-muted">{u.email}</p>
//                     </div>
//                   </div>
//                   <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${roleColors[u.role]}`}>
//                     {u.role}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Recent Collaborations */}
//         <div className="bg-card rounded-2xl border border-border shadow-card p-6">
//           <div className="flex items-center justify-between mb-5">
//             <h2 className="font-bold text-secondary text-lg">Recent Collaborations</h2>
//             <Link to="/admin/collaborations" className="text-xs text-primary font-semibold hover:underline">
//               View All →
//             </Link>
//           </div>

//           {loading ? (
//             <div className="space-y-3">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
//               ))}
//             </div>
//           ) : recentCollabs.length === 0 ? (
//             <div className="text-center py-8 text-muted">
//               <div className="text-4xl mb-2">🤝</div>
//               <p className="text-sm">No collaborations yet</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {recentCollabs.map(c => (
//                 <div key={c._id} className="flex items-center justify-between p-3 bg-surface rounded-xl hover:bg-primary-light transition-colors">
//                   <div className="min-w-0 flex-1">
//                     <p className="text-sm font-bold text-secondary truncate">
//                       {c.opportunityId?.title || 'Collaboration'}
//                     </p>
//                     <p className="text-xs text-muted mt-0.5">
//                       {c.brandId?.brandName || c.brandId?.fullName} → {c.creatorId?.fullName}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2 flex-shrink-0 ml-3">
//                     <span className="text-xs font-bold text-primary">
//                       PKR {c.agreedAmount?.toLocaleString()}
//                     </span>
//                     <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${collabStatusColors[c.status]}`}>
//                       {c.status}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Pending Payments */}
//       <div className="bg-card rounded-2xl border border-border shadow-card p-6">
//         <div className="flex items-center justify-between mb-5">
//           <h2 className="font-bold text-secondary text-lg">Pending Payments Action</h2>
//           <Link to="/admin/payments" className="text-xs text-primary font-semibold hover:underline">
//             View All →
//           </Link>
//         </div>

//         {loading ? (
//           <div className="space-y-3">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
//             ))}
//           </div>
//         ) : pendingPayments.length === 0 ? (
//           <div className="text-center py-8 text-muted">
//             <div className="text-4xl mb-2">✅</div>
//             <p className="text-sm">No pending payments</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {pendingPayments.map(p => (
//               <div key={p._id} className="flex items-center justify-between p-4 bg-surface rounded-xl hover:bg-primary-light transition-colors">
//                 <div>
//                   <p className="text-sm font-bold text-secondary">
//                     {p.brandId?.brandName || p.brandId?.fullName} → {p.creatorId?.fullName}
//                   </p>
//                   <p className="text-xs text-muted mt-0.5">
//                     {new Date(p.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="text-sm font-bold text-primary">
//                     PKR {p.totalAmount?.toLocaleString()}
//                   </span>
//                   <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${paymentStatusColors[p.status]}`}>
//                     {p.status === 'pending' ? '⏳ Pending'
//                       : p.status === 'screenshot_uploaded' ? '📸 Verify Now'
//                       : p.status}
//                   </span>
//                   <Link to="/admin/payments"
//                     className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors">
//                     Action
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//     </DashboardLayout>
//   )
// }


import { useState, useEffect } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import { Link } from 'react-router-dom'
import axios from '../../../utils/axios'

export const adminLinks = [
  { to: '/admin/dashboard',      icon: '📊', label: 'Dashboard' },
  { to: '/admin/users',          icon: '👥', label: 'All Users' },
  { to: '/admin/opportunities',  icon: '📢', label: 'All Opportunities' },
  { to: '/admin/collaborations', icon: '🤝', label: 'All Collaborations' },
  { to: '/admin/payments',       icon: '💳', label: 'Payments & Commission' },
  { to: '/admin/disputes',       icon: '⚖️', label: 'Disputes' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0, opportunities: 0, collaborations: 0,
    revenue: 0, pendingPayments: 0, activeCollabs: 0
  })
  const [recentUsers, setRecentUsers]         = useState([])
  const [recentCollabs, setRecentCollabs]     = useState([])
  const [pendingPayments, setPendingPayments] = useState([])
  const [loading, setLoading]                 = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [usersRes, oppsRes, collabsRes, paymentsRes] = await Promise.all([
        axios.get('/admin/users'),
        axios.get('/admin/opportunities'),
        axios.get('/admin/collaborations'),
        axios.get('/admin/payments'),
      ])

      const totalRevenue = paymentsRes.data
        .filter(p => p.status === 'released')
        .reduce((a, p) => a + (p.platformCommission || 0), 0)

      const pendingCount = paymentsRes.data
        .filter(p => p.status === 'pending' || p.status === 'screenshot_uploaded').length

      const activeCollabs = collabsRes.data
        .filter(c => c.status === 'active' || c.status === 'submitted').length

      setStats({
        users:          usersRes.data.length,
        opportunities:  oppsRes.data.length,
        collaborations: collabsRes.data.length,
        revenue:        totalRevenue,
        pendingPayments: pendingCount,
        activeCollabs,
      })

      setRecentUsers(usersRes.data.slice(0, 4))
      setRecentCollabs(collabsRes.data.slice(0, 4))
      setPendingPayments(
        paymentsRes.data
          .filter(p => p.status === 'pending' || p.status === 'screenshot_uploaded')
          .slice(0, 5)
      )
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const roleStyle = {
    creator: 'bg-blue-50 text-blue-700',
    brand:   'bg-yellow-50 text-yellow-700',
    admin:   'bg-purple-50 text-primary',
  }

  const collabStatusStyle = {
    active:    'bg-blue-50 text-blue-700',
    submitted: 'bg-yellow-50 text-yellow-700',
    completed: 'bg-green-50 text-green-700',
    revision:  'bg-orange-50 text-orange-700',
    cancelled: 'bg-red-50 text-red-600',
  }

  const paymentStatusStyle = {
    pending:             'bg-gray-100 text-gray-500',
    screenshot_uploaded: 'bg-yellow-50 text-yellow-700',
    verified:            'bg-blue-50 text-blue-700',
    released:            'bg-green-50 text-green-700',
  }

  const paymentStatusLabel = {
    pending:             '⏳ Pending',
    screenshot_uploaded: '📸 Verify Now',
    verified:            '✅ Verified',
    released:            '💚 Released',
  }

  const avatarColors = [
    'bg-purple-100 text-purple-700',
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-yellow-100 text-yellow-700',
  ]

  const SkeletonRow = () => (
    <div className="h-14 bg-surface rounded-xl animate-pulse mb-2" />
  )

  return (
    <DashboardLayout links={adminLinks}>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-secondary">Admin Dashboard</h1>
          <p className="text-muted text-sm mt-1">Platform overview & control panel</p>
        </div>
        {/* <div className="flex items-center gap-2 bg-primary-light text-primary text-sm font-semibold px-4 py-2 rounded-xl">
          👑 Admin
        </div> */}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total users',      value: stats.users,                             icon: '👥', iconBg: 'bg-purple-50', to: '/admin/users' },
          { label: 'Opportunities',    value: stats.opportunities,                     icon: '📢', iconBg: 'bg-yellow-50', to: '/admin/opportunities' },
          { label: 'Active collabs',   value: stats.activeCollabs,                     icon: '🤝', iconBg: 'bg-green-50',  to: '/admin/collaborations' },
          { label: 'Total revenue',    value: `PKR ${stats.revenue.toLocaleString()}`, icon: '💰', iconBg: 'bg-purple-50', to: '/admin/payments' },
        ].map((s, i) => (
          <Link
            key={i}
            to={s.to}
            className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 hover:border-primary hover:shadow-purple transition-all"
          >
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${s.iconBg}`}>
                {s.icon}
              </div>
              <span className="text-xs text-success font-semibold">↑ new</span>
            </div>
            <div>
              <p className="text-xl font-black text-secondary">{s.value}</p>
              <p className="text-xs text-muted mt-0.5">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center text-xl flex-shrink-0">⏳</div>
          <div>
            <p className="text-2xl font-black text-yellow-700">{stats.pendingPayments}</p>
            <p className="text-sm text-yellow-600 font-semibold">Payments awaiting action</p>
            <Link to="/admin/payments" className="text-xs text-yellow-700 font-bold hover:underline">
              Review now →
            </Link>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-xl flex-shrink-0">🤝</div>
          <div>
            <p className="text-2xl font-black text-green-700">{stats.collaborations}</p>
            <p className="text-sm text-green-600 font-semibold">Total collaborations</p>
            <Link to="/admin/collaborations" className="text-xs text-green-700 font-bold hover:underline">
              View all →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Users + Collaborations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

        {/* Recent Users */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-secondary text-base">Recent users</h2>
            <Link to="/admin/users" className="text-xs text-primary font-semibold hover:underline">
              View all →
            </Link>
          </div>

          {loading ? (
            <>{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</>
          ) : recentUsers.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <div className="text-4xl mb-2">👥</div>
              <p className="text-sm">No users yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentUsers.map((u, i) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-3 bg-surface border border-border rounded-xl hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                      {u.fullName?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-secondary">{u.fullName}</p>
                      <p className="text-xs text-muted">{u.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${roleStyle[u.role]}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Collaborations */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-secondary text-base">Recent collaborations</h2>
            <Link to="/admin/collaborations" className="text-xs text-primary font-semibold hover:underline">
              View all →
            </Link>
          </div>

          {loading ? (
            <>{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</>
          ) : recentCollabs.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <div className="text-4xl mb-2">🤝</div>
              <p className="text-sm">No collaborations yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentCollabs.map(c => (
                <div
                  key={c._id}
                  className="flex items-center justify-between p-3 bg-surface border border-border rounded-xl hover:border-primary transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-secondary truncate">
                      {c.opportunityId?.title || 'Collaboration'}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {c.brandId?.brandName || c.brandId?.fullName} → {c.creatorId?.fullName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <span className="text-xs font-bold text-primary">
                      PKR {c.agreedAmount?.toLocaleString()}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${collabStatusStyle[c.status]}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pending Payments */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-secondary text-base">Pending payments action</h2>
          <Link to="/admin/payments" className="text-xs text-primary font-semibold hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <>{[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}</>
        ) : pendingPayments.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-sm">No pending payments</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingPayments.map(p => (
              <div
                key={p._id}
                className="flex items-center justify-between p-3 bg-surface border border-border rounded-xl hover:border-primary transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-secondary truncate">
                    {p.brandId?.brandName || p.brandId?.fullName} → {p.creatorId?.fullName}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(p.createdAt).toLocaleDateString('en-PK', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <span className="text-sm font-bold text-primary">
                    PKR {p.totalAmount?.toLocaleString()}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${paymentStatusStyle[p.status]}`}>
                    {paymentStatusLabel[p.status] || p.status}
                  </span>
                  <Link
                    to="/admin/payments"
                    className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Action
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </DashboardLayout>
  )
}