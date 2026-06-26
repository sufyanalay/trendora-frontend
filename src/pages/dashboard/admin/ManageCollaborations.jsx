import { useState, useEffect } from 'react'
// import DashboardLayout from '../shared/DashboardLayout'
import { adminLinks } from './AdminDashboard'
import axios from '../../../utils/axios'

const statusColors = {
  payment_pending: 'bg-gray-100 text-gray-600',
  active:          'bg-blue-50 text-blue-700',
  submitted:       'bg-yellow-50 text-yellow-700',
  completed:       'bg-green-50 text-green-700',
  revision:        'bg-orange-50 text-orange-700',
  cancelled:       'bg-red-50 text-red-600',
  disputed:        'bg-red-50 text-red-600',
}

export default function ManageCollaborations() {
  const [collaborations, setCollaborations] = useState([])
  const [loading, setLoading]               = useState(true)
  const [search, setSearch]                 = useState('')
  const [filter, setFilter]                 = useState('all')
  const [toast, setToast]                   = useState('')

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

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this collaboration and all its chat messages?')) return
    try {
      await axios.delete(`/admin/collaborations/${id}`)
      setCollaborations(prev => prev.filter(c => c._id !== id))
      showToast('✅ Collaboration deleted')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete')
    }
  }

  const handleComplete = async (id) => {
    if (!window.confirm('Force complete this collaboration?')) return
    try {
      await axios.put(`/admin/collaborations/${id}/complete`)
      setCollaborations(prev => prev.map(c =>
        c._id === id ? { ...c, status: 'completed' } : c
      ))
      showToast('✅ Collaboration completed')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed')
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this collaboration? Payment will be refunded.')) return
    try {
      await axios.put(`/admin/collaborations/${id}/cancel`)
      setCollaborations(prev => prev.map(c =>
        c._id === id ? { ...c, status: 'cancelled' } : c
      ))
      showToast('✅ Collaboration cancelled')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed')
    }
  }

  const filtered = collaborations.filter(c => {
    const matchSearch =
      c.opportunityId?.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.brandId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.brandId?.brandName?.toLowerCase().includes(search.toLowerCase()) ||
      c.creatorId?.fullName?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  return (
     <>

      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">All Collaborations</h1>
        <p className="text-muted text-sm mt-1">Monitor and manage all collaborations.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text" placeholder="Search by title, brand, or creator..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary bg-white"
        />
        <div className="flex gap-2 flex-wrap">
          {['all', 'active', 'submitted', 'completed', 'revision', 'disputed', 'cancelled'].map(s => (
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
          { label: 'Total',     value: collaborations.length,                                        color: 'text-gray-700' },
          { label: 'Active',    value: collaborations.filter(c => c.status === 'active').length,     color: 'text-blue-700' },
          { label: 'Submitted', value: collaborations.filter(c => c.status === 'submitted').length,  color: 'text-yellow-700' },
          { label: 'Completed', value: collaborations.filter(c => c.status === 'completed').length,  color: 'text-green-700' },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-xl p-4 border border-border shadow-card text-center">
            <div className={`text-2xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* List */}
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
            {filtered.map(c => (
              <div key={c._id} className="px-6 py-4 hover:bg-surface transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-bold text-secondary line-clamp-1">
                        {c.opportunityId?.title || 'N/A'}
                      </p>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColors[c.status]}`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                      <span>🏢 {c.brandId?.brandName || c.brandId?.fullName}</span>
                      <span>👤 {c.creatorId?.fullName}</span>
                      <span>💰 PKR {c.agreedAmount?.toLocaleString()}</span>
                      <span>📱 {c.opportunityId?.platform}</span>
                      <span>📅 {new Date(c.createdAt).toLocaleDateString('en-PK', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0 flex-wrap">
                    {/* Force Complete — active/submitted/revision pe */}
                    {['active', 'submitted', 'revision', 'disputed'].includes(c.status) && (
                      <button
                        onClick={() => handleComplete(c._id)}
                        className="px-3 py-1.5 text-xs font-bold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        ✅ Complete
                      </button>
                    )}

                    {/* Cancel — active/payment_pending pe */}
                    {['active', 'payment_pending', 'disputed'].includes(c.status) && (
                      <button
                        onClick={() => handleCancel(c._id)}
                        className="px-3 py-1.5 text-xs font-bold bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        ✕ Cancel
                      </button>
                    )}

                    {/* Delete — sirf completed pe */}
                    {c.status === 'completed' && (
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
     </>
  )
}