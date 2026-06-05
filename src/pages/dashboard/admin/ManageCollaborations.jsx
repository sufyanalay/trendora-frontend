import { useState, useEffect } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import { adminLinks } from './AdminDashboard'
import axios from '../../../utils/axios'

const statusColors = {
  active:    'bg-blue-50 text-blue-700',
  submitted: 'bg-yellow-50 text-yellow-700',
  completed: 'bg-green-50 text-green-700',
  revision:  'bg-orange-50 text-orange-700',
  cancelled: 'bg-red-50 text-red-600',
  disputed:  'bg-red-50 text-red-600',
}

export default function ManageCollaborations() {
  const [collaborations, setCollaborations] = useState([])
  const [loading, setLoading]               = useState(true)
  const [search, setSearch]                 = useState('')
  const [filter, setFilter]                 = useState('all')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const res = await axios.get('/admin/collaborations')
      setCollaborations(res.data)
    } catch {
      setCollaborations([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = collaborations.filter(c => {
    const matchSearch =
      c.opportunityId?.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.brandId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.creatorId?.fullName?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  return (
    <DashboardLayout links={adminLinks}>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">All Collaborations</h1>
        <p className="text-muted text-sm mt-1">Monitor all active and completed collaborations.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text" placeholder="Search by title, brand, or creator..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-white"
        />
        <div className="flex gap-2 flex-wrap">
          {['all', 'active', 'submitted', 'completed', 'revision'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg capitalize transition-colors ${
                filter === s
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border text-muted hover:border-primary hover:text-primary'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',     value: collaborations.length,                                        color: 'bg-gray-100 text-gray-700' },
          { label: 'Active',    value: collaborations.filter(c => c.status === 'active').length,     color: 'bg-blue-50 text-blue-700' },
          { label: 'Submitted', value: collaborations.filter(c => c.status === 'submitted').length,  color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Completed', value: collaborations.filter(c => c.status === 'completed').length,  color: 'bg-green-50 text-green-700' },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-xl p-4 border border-border shadow-card text-center">
            <div className={`text-2xl font-black mb-1 ${s.color.split(' ')[1]}`}>{s.value}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🤝</div>
            <p className="font-medium text-secondary">No collaborations found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-surface text-xs font-bold text-muted uppercase tracking-wide">
              <div className="col-span-3">Opportunity</div>
              <div className="col-span-2">Brand</div>
              <div className="col-span-2">Creator</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Date</div>
            </div>

            {filtered.map(c => (
              <div key={c._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-surface transition-colors items-center">
                <div className="md:col-span-3">
                  <p className="text-sm font-bold text-secondary line-clamp-1">
                    {c.opportunityId?.title || 'N/A'}
                  </p>
                  <p className="text-xs text-muted">{c.opportunityId?.platform}</p>
                </div>
                <div className="md:col-span-2 text-sm text-secondary">
                  {c.brandId?.brandName || c.brandId?.fullName}
                </div>
                <div className="md:col-span-2 text-sm text-secondary">
                  {c.creatorId?.fullName}
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm font-bold text-primary">
                    PKR {c.agreedAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[c.status]}`}>
                    {c.status}
                  </span>
                </div>
                <div className="md:col-span-1 text-xs text-muted">
                  {new Date(c.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}