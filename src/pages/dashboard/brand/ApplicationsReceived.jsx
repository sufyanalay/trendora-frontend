import { useState, useEffect } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import { brandLinks } from './BrandDashboard'
import axios from '../../../utils/axios'

const statusColors = {
  pending:   'bg-yellow-50 text-yellow-700',
  accepted:  'bg-green-50 text-green-700',
  rejected:  'bg-red-50 text-red-600',
  countered: 'bg-blue-50 text-blue-700',
  withdrawn: 'bg-gray-100 text-gray-500',
}

const statusLabels = {
  pending:   '⏳ Pending',
  accepted:  '✅ Accepted',
  rejected:  '❌ Rejected',
  countered: '🔄 Counter Offer',
  withdrawn: '↩️ Withdrawn',
}

const avatarColors = [
  'from-purple-400 to-purple-700',
  'from-blue-400 to-blue-700',
  'from-green-400 to-green-700',
  'from-pink-400 to-pink-700',
  'from-orange-400 to-orange-600',
]

export default function ApplicationsReceived() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading]           = useState(true)
  const [toast, setToast]               = useState('')
  const [counterModal, setCounterModal] = useState(null)
  const [counterAmount, setCounterAmount] = useState('')
  const [counterNote, setCounterNote]   = useState('')

  useEffect(() => { fetchApplications() }, [])

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/applications/brand')
      setApplications(res.data)
    } catch {
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

 const handleRespond = async (id, action) => {
  try {
    if (action === 'accept') {
      await axios.put(`/applications/${id}/respond`, { action })
      const res = await axios.post('/collaborations', { applicationId: id })
      setApplications(prev => prev.map(a =>
        a._id === id ? { ...a, status: 'accepted' } : a
      ))
      showToast('✅ Application accepted! Please complete payment.')
    } else {
      await axios.put(`/applications/${id}/respond`, { action })
      setApplications(prev => prev.map(a =>
        a._id === id ? { ...a, status: 'rejected' } : a
      ))
      showToast('❌ Application rejected')
    }
  } catch (err) {
    showToast(err.response?.data?.message || 'Failed')
  }
}
  const handleCounter = async () => {
    if (!counterAmount) return
    try {
      await axios.put(`/applications/${counterModal._id}/respond`, {
        action: 'counter',
        counterAmount: Number(counterAmount),
        note: counterNote,
      })
      setApplications(prev => prev.map(a =>
        a._id === counterModal._id ? { ...a, status: 'countered' } : a
      ))
      showToast('Counter offer sent to creator!')
      setCounterModal(null)
      setCounterAmount('')
      setCounterNote('')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed')
    }
  }

  return (
    <DashboardLayout links={brandLinks}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      {/* Counter Modal */}
      {counterModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-purple">
            <h3 className="font-bold text-secondary text-lg mb-1">Send Counter Offer</h3>
            <p className="text-sm text-muted mb-1">To: <span className="font-semibold text-secondary">{counterModal.creatorId?.fullName}</span></p>
            <p className="text-sm text-muted mb-5">
              Creator offered: <span className="font-bold text-primary">PKR {counterModal.counterAmount?.toLocaleString()}</span>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-secondary mb-1.5">Your Counter Amount (PKR)</label>
              <input
                type="number" placeholder="e.g. 5000"
                value={counterAmount} onChange={e => setCounterAmount(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-secondary mb-1.5">Note (Optional)</label>
              <textarea
                rows={3} placeholder="Explain your counter offer..."
                value={counterNote} onChange={e => setCounterNote(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setCounterModal(null)}
                className="flex-1 py-2.5 border-2 border-border text-muted rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
                Cancel
              </button>
              <button onClick={handleCounter}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors">
                Send Counter
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">Applications Received</h1>
        <p className="text-muted text-sm mt-1">Review and respond to creator applications.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center py-16">
          <div className="text-5xl mb-3">👥</div>
          <p className="font-medium text-secondary">No applications yet</p>
          <p className="text-muted text-sm mt-1">Post an opportunity to start receiving applications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app, i) => (
            <div key={app._id} className="bg-card rounded-2xl border border-border shadow-card p-6 hover:border-primary transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">

                {/* Creator Info */}
                <div className="flex items-start gap-3 flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-lg`}>
                    {app.creatorId?.fullName?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="font-bold text-secondary text-sm">{app.creatorId?.fullName}</p>
                    <p className="text-xs text-muted">{app.creatorId?.email}</p>
                    {app.creatorId?.socialPlatform && (
                      <p className="text-xs text-primary mt-0.5">{app.creatorId.socialPlatform}</p>
                    )}
                  </div>
                </div>

                {/* Application Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="font-bold text-secondary text-sm">
                      {app.opportunityId?.title}
                    </h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[app.status]}`}>
                      {statusLabels[app.status]}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted mb-3">
                    <span>💰 Offer: <span className="font-bold text-primary">PKR {app.counterAmount?.toLocaleString()}</span></span>
                    <span>📱 {app.opportunityId?.platform}</span>
                    <span>🕐 {new Date(app.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}</span>
                  </div>

                  {/* Creator Note */}
                  {app.note && (
                    <p className="text-xs text-muted bg-surface rounded-lg px-3 py-2 mb-3">
                      "{app.note}"
                    </p>
                  )}

                  {/* Creator Counter */}
                  {app.status === 'countered' && app.lastCounterBy === 'creator' && (
                    <div className="bg-purple-50 border border-primary/20 rounded-xl px-4 py-3 mb-3">
                      <p className="text-xs font-bold text-primary mb-1">Creator sent a counter offer!</p>
                      <p className="text-sm font-bold text-secondary">
                        PKR {app.lastCounterAmount?.toLocaleString()}
                      </p>
                      {app.lastCounterNote && (
                        <p className="text-xs text-muted mt-1">"{app.lastCounterNote}"</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {(app.status === 'pending' || (app.status === 'countered' && app.lastCounterBy === 'creator')) && (
                  <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => handleRespond(app._id, 'accept')}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      ✓ Accept
                    </button>
                    <button
                      onClick={() => setCounterModal(app)}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Counter
                    </button>
                    <button
                      onClick={() => handleRespond(app._id, 'reject')}
                      className="px-4 py-2 border border-red-200 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 transition-colors"
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}