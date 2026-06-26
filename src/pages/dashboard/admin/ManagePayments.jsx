import { useState, useEffect } from 'react'
// import DashboardLayout from '../shared/DashboardLayout'
import { adminLinks } from './AdminDashboard'
import axios from '../../../utils/axios'

const statusColors = {
  pending:             'bg-gray-100 text-gray-600',
  screenshot_uploaded: 'bg-yellow-50 text-yellow-700',
  verified:            'bg-blue-50 text-blue-700',
  released:            'bg-green-50 text-green-700',
  refunded:            'bg-red-50 text-red-600',
}

const statusLabels = {
  pending:             '⏳ Pending',
  screenshot_uploaded: '📸 Screenshot Uploaded',
  verified:            '✅ Verified — Awaiting Release',
  released:            '💰 Released',
  refunded:            '↩️ Refunded',
}

export default function ManagePayments() {
  const [payments, setPayments]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [toast, setToast]               = useState('')
  const [screenshotModal, setScreenshotModal] = useState(null)
  const [releaseModal, setReleaseModal] = useState(null)
  const [releaseNote, setReleaseNote]   = useState('')
  const [releaseRef, setReleaseRef]     = useState('')
  const [releasing, setReleasing]       = useState(false)
  const [filter, setFilter]             = useState('all')

  useEffect(() => { fetchPayments() }, [])

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/admin/payments')
      setPayments(res.data)
    } catch {
      setPayments([])
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleVerify = async (id) => {
    try {
      await axios.put(`/admin/payments/${id}/verify`)
      setPayments(prev => prev.map(p =>
        p._id === id ? { ...p, status: 'verified' } : p
      ))
      showToast('✅ Payment verified! Collaboration activated.')
    } catch {
      showToast('Action failed.')
    }
  }

  const handleRelease = async () => {
    if (!releaseRef.trim()) return showToast('Please enter transaction reference')
    
    // ✅ Check if brand has approved the work
    if (releaseModal.collaborationId?.status !== 'completed') {
      showToast(`⚠️ Cannot release - Brand hasn't approved work yet (Status: ${releaseModal.collaborationId?.status})`)
      return
    }
    if (releaseModal.collaborationId?.paymentStatus !== 'paid') {
      showToast(`⚠️ Cannot release - Payment not marked as paid by brand`)
      return
    }

    setReleasing(true)
    try {
      await axios.put(`/admin/payments/${releaseModal._id}/release`, {
        releaseNote,
        releaseRef,
      })
      setPayments(prev => prev.map(p =>
        p._id === releaseModal._id ? { ...p, status: 'released' } : p
      ))
      showToast('💰 Payment released to creator!')
      setReleaseModal(null)
      setReleaseNote('')
      setReleaseRef('')
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed.')
    } finally {
      setReleasing(false)
    }
  }

  const filtered = payments.filter(p =>
    filter === 'all' ? true : p.status === filter
  )

 // Stats update karo
const stats = [
  {
    label: 'Total Received',
    value: `PKR ${payments.filter(p => p.status !== 'refunded').reduce((a, p) => a + (p.totalAmount || 0), 0).toLocaleString()}`,
    icon: '💰', color: 'bg-green-50 text-green-700'
  },
  {
    label: 'Needs Verify',
    value: payments.filter(p => p.status === 'screenshot_uploaded').length,
    icon: '📸', color: 'bg-yellow-50 text-yellow-700'
  },
  {
    label: 'Ready to Release',  // ← Brand approved
    value: payments.filter(p => p.status === 'verified').length,
    icon: '🔄', color: 'bg-blue-50 text-blue-700'
  },
  {
    label: 'Commission Earned',
    value: `PKR ${payments.filter(p => p.status === 'released').reduce((a, p) => a + (p.platformCommission || 0), 0).toLocaleString()}`,
    icon: '📊', color: 'bg-purple-50 text-primary'
  },
]

  return (
     <>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      {/* Screenshot Modal */}
      {screenshotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
          onClick={() => setScreenshotModal(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-purple"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="font-bold text-secondary">Payment Screenshot</h3>
                <p className="text-xs text-muted mt-0.5">
                  PKR {screenshotModal.totalAmount?.toLocaleString()}
                </p>
              </div>
              <button onClick={() => setScreenshotModal(null)}
                className="w-8 h-8 rounded-lg bg-surface text-muted hover:bg-border transition-colors flex items-center justify-center font-bold">
                ✕
              </button>
            </div>
            <div className="p-4 bg-gray-50">
              <img src={screenshotModal.screenshotUrl} alt="Payment Screenshot"
                className="w-full max-h-96 object-contain rounded-xl" />
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'Transaction ID',  value: screenshotModal.transactionId || 'N/A' },
                  { label: 'Brand JazzCash',  value: screenshotModal.brandJazzCash || 'N/A' },
                  { label: 'Total Amount',    value: `PKR ${screenshotModal.totalAmount?.toLocaleString()}` },
                  { label: 'Creator Amount',  value: `PKR ${screenshotModal.creatorAmount?.toLocaleString()}` },
                  { label: 'Commission',      value: `PKR ${screenshotModal.platformCommission?.toLocaleString()}` },
                  { label: 'Creator JazzCash',value: screenshotModal.creatorId?.jazzCashNumber || 'Not set' },
                ].map((item, i) => (
                  <div key={i} className="bg-surface rounded-lg p-3">
                    <p className="text-xs text-muted">{item.label}</p>
                    <p className="text-sm font-bold text-secondary mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setScreenshotModal(null)}
                  className="flex-1 py-2.5 border-2 border-border text-muted rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
                  Close
                </button>
                {screenshotModal.status === 'screenshot_uploaded' && (
                  <button
                    onClick={() => { handleVerify(screenshotModal._id); setScreenshotModal(null) }}
                    className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors">
                    ✅ Verify Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Release Modal */}
      {releaseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-purple overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-700 p-5 rounded-t-2xl">
              <h3 className="font-black text-white text-lg">Release Payment to Creator</h3>
              <p className="text-green-100 text-sm mt-1">
                Amount: PKR {releaseModal.creatorAmount?.toLocaleString()}
              </p>
            </div>

            <div className="p-6 space-y-4">

              {/* ✅ Show Collaboration Status */}
              <div className={`rounded-xl p-4 ${
                releaseModal.collaborationId?.status === 'completed' && releaseModal.collaborationId?.paymentStatus === 'paid'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-orange-50 border border-orange-200'
              }`}>
                <p className="text-xs font-bold mb-2 text-secondary">📋 Collaboration Status:</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Work Status:</span>
                    <span className={`font-bold ${releaseModal.collaborationId?.status === 'completed' ? 'text-green-700' : 'text-orange-600'}`}>
                      {releaseModal.collaborationId?.status === 'completed' ? '✅ Completed' : `⏳ ${releaseModal.collaborationId?.status}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Payment Status:</span>
                    <span className={`font-bold ${releaseModal.collaborationId?.paymentStatus === 'paid' ? 'text-green-700' : 'text-orange-600'}`}>
                      {releaseModal.collaborationId?.paymentStatus === 'paid' ? '✅ Paid' : `⏳ ${releaseModal.collaborationId?.paymentStatus}`}
                    </span>
                  </div>
                </div>

                {/* ⚠️ Warning if brand hasn't approved */}
                {(releaseModal.collaborationId?.status !== 'completed' || releaseModal.collaborationId?.paymentStatus !== 'paid') && (
                  <div className="mt-3 p-3 bg-orange-100 rounded-lg border border-orange-300">
                    <p className="text-xs font-semibold text-orange-700">⚠️ Cannot Release Yet</p>
                    <p className="text-xs text-orange-600 mt-1">
                      Brand must first approve the submitted work before you can release payment.
                    </p>
                  </div>
                )}
              </div>

              {/* Creator Payment Info */}
              <div className="bg-primary-light rounded-xl p-4">
                <p className="text-xs font-bold text-primary mb-3">👤 Creator Payment Details:</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Name:</span>
                    <span className="font-bold text-secondary">
                      {releaseModal.creatorId?.fullName}
                    </span>
                  </div>
                  {releaseModal.creatorId?.jazzCashNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">JazzCash:</span>
                      <span className="font-bold text-secondary">
                        {releaseModal.creatorId.jazzCashNumber}
                      </span>
                    </div>
                  )}
                  {releaseModal.creatorId?.easypaisaNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Easypaisa:</span>
                      <span className="font-bold text-secondary">
                        {releaseModal.creatorId.easypaisaNumber}
                      </span>
                    </div>
                  )}
                  {releaseModal.creatorId?.bankName && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Bank:</span>
                        <span className="font-bold text-secondary">
                          {releaseModal.creatorId.bankName}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Account:</span>
                        <span className="font-bold text-secondary">
                          {releaseModal.creatorId.bankAccountNumber}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Title:</span>
                        <span className="font-bold text-secondary">
                          {releaseModal.creatorId.bankAccountTitle}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-sm pt-2 border-t border-primary/20">
                    <span className="text-muted">Amount to Send:</span>
                    <span className="font-black text-green-700 text-base">
                      PKR {releaseModal.creatorAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Transaction Details */}
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Your Transaction Reference Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. TXN987654321"
                  value={releaseRef}
                  onChange={e => setReleaseRef(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Note to Creator (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Payment sent via JazzCash. Please check your account."
                  value={releaseNote}
                  onChange={e => setReleaseNote(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setReleaseModal(null); setReleaseNote(''); setReleaseRef('') }}
                  className="flex-1 py-2.5 border-2 border-border text-muted rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRelease}
                  disabled={releasing || !releaseRef.trim() || releaseModal.collaborationId?.status !== 'completed' || releaseModal.collaborationId?.paymentStatus !== 'paid'}
                  className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {releasing ? 'Releasing...' : '💰 Confirm Release'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">Payments & Commission</h1>
        <p className="text-muted text-sm mt-1">Verify incoming payments and release to creators.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-card rounded-2xl p-5 border border-border shadow-card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color}`}>{s.icon}</div>
            <div className="text-xl font-black text-secondary">{s.value}</div>
            <div className="text-xs text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Platform Account */}
      <div className="bg-primary-light rounded-2xl p-5 border border-primary/20 mb-6">
        <h2 className="font-bold text-secondary mb-3">Platform Payment Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted">JazzCash:</span>
            <span className="font-bold text-secondary">0300-XXXXXXX</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted">Title:</span>
            <span className="font-bold text-secondary">Trendora Official</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted">Commission:</span>
            <span className="font-bold text-primary">10%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { key: 'all',                label: 'All' },
          { key: 'screenshot_uploaded', label: '📸 Needs Verify' },
          { key: 'verified',           label: '✅ To Release' },
          { key: 'released',           label: '💰 Released' },
          { key: 'pending',            label: '⏳ Pending' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
              filter === f.key
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-muted hover:border-primary hover:text-primary'
            }`}>
            {f.label}
            {f.key !== 'all' && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded-full">
                {payments.filter(p => p.status === f.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Payments List */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-secondary">All Transactions</h2>
          <span className="text-xs text-muted">{filtered.length} records</span>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">💳</div>
            <p className="font-medium text-secondary">No payments found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(p => (
              <div key={p._id} className="px-6 py-4 hover:bg-surface transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-bold text-secondary">
                        {p.collaborationId?.opportunityId?.title || 'Collaboration Payment'}
                      </p>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColors[p.status]}`}>
                        {statusLabels[p.status]}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted mb-2">
                      <span>🏢 {p.brandId?.brandName || p.brandId?.fullName}</span>
                      <span>👤 {p.creatorId?.fullName}</span>
                      {p.transactionId && <span>🔖 TXN: {p.transactionId}</span>}
                      <span>📅 {new Date(p.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>

                    {/* Creator payment details — sirf verified/to release mein dikhao */}
                    {(p.status === 'verified' || p.status === 'released') && (
                      <div className="bg-green-50 rounded-lg px-3 py-2 text-xs space-y-1 mt-2">
                        <p className="font-bold text-green-700">Creator Payment Details:</p>
                        {p.creatorId?.jazzCashNumber && (
                          <p className="text-green-600">📱 JazzCash: <span className="font-bold">{p.creatorId.jazzCashNumber}</span></p>
                        )}
                        {p.creatorId?.easypaisaNumber && (
                          <p className="text-green-600">📱 Easypaisa: <span className="font-bold">{p.creatorId.easypaisaNumber}</span></p>
                        )}
                        {p.creatorId?.bankName && (
                          <p className="text-green-600">🏦 {p.creatorId.bankName}: <span className="font-bold">{p.creatorId.bankAccountNumber}</span> ({p.creatorId.bankAccountTitle})</p>
                        )}
                        {!p.creatorId?.jazzCashNumber && !p.creatorId?.easypaisaNumber && !p.creatorId?.bankName && (
                          <p className="text-orange-600">⚠️ Creator has not set payment details yet</p>
                        )}
                      </div>
                    )}

                    {p.screenshotUrl && (
                      <button
                        onClick={() => setScreenshotModal(p)}
                        className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-2 hover:underline"
                      >
                        📸 View Payment Screenshot
                      </button>
                    )}
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
                    <div className="text-right">
                      <p className="text-sm font-black text-secondary">PKR {p.totalAmount?.toLocaleString()}</p>
                      <p className="text-xs text-green-600">Creator: PKR {p.creatorAmount?.toLocaleString()}</p>
                      <p className="text-xs text-primary">Commission: PKR {p.platformCommission?.toLocaleString()}</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {p.status === 'screenshot_uploaded' && (
                        <button
                          onClick={() => setScreenshotModal(p)}
                          className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          🔍 Review & Verify
                        </button>
                      )}
                      {p.status === 'verified' && (
                        <>
                          {p.collaborationId?.status === 'completed' && p.collaborationId?.paymentStatus === 'paid' ? (
                            <button
                              onClick={() => setReleaseModal(p)}
                              className="px-3 py-1.5 text-xs font-bold bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                              title="Brand approved work - Ready to release"
                            >
                              💰 Release Payment
                            </button>
                          ) : (
                            <div className="relative group">
                              <button
                                disabled
                                className="px-3 py-1.5 text-xs font-bold bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed opacity-60"
                                title="Waiting for brand approval"
                              >
                                ⏳ Awaiting Brand
                              </button>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-normal">
                                ⏳ Waiting for brand to approve work completion
                                <br/>
                                Current: {p.collaborationId?.status || 'unknown'}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {p.status === 'pending' && (
                        <span className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-500 rounded-lg">
                          Awaiting Brand
                        </span>
                      )}
                      {p.status === 'released' && (
                        <span className="px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 rounded-lg">
                          ✅ Done
                        </span>
                      )}
                    </div>
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