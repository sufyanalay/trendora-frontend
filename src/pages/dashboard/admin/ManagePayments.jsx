import { useState, useEffect } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
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
  verified:            '✅ Verified',
  released:            '💰 Released',
  refunded:            '↩️ Refunded',
}

export default function ManagePayments() {
  const [payments, setPayments]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [toast, setToast]               = useState('')
  const [screenshotModal, setScreenshotModal] = useState(null)
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
      showToast('✅ Payment verified! Collaboration is now active.')
    } catch {
      showToast('Action failed.')
    }
  }

  const handleRelease = async (id) => {
    try {
      await axios.put(`/admin/payments/${id}/release`)
      setPayments(prev => prev.map(p =>
        p._id === id ? { ...p, status: 'released' } : p
      ))
      showToast('💰 Payment released to creator!')
    } catch {
      showToast('Action failed.')
    }
  }

  const filtered = payments.filter(p =>
    filter === 'all' ? true : p.status === filter
  )

  const stats = [
    {
      label: 'Total Received',
      value: `PKR ${payments.filter(p => p.status !== 'refunded').reduce((a, p) => a + (p.totalAmount || 0), 0).toLocaleString()}`,
      icon: '💰',
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'Awaiting Verify',
      value: payments.filter(p => p.status === 'screenshot_uploaded').length,
      icon: '📸',
      color: 'bg-yellow-50 text-yellow-700',
    },
    {
      label: 'To Release',
      value: payments.filter(p => p.status === 'verified').length,
      icon: '🔄',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Total Commission',
      value: `PKR ${payments.filter(p => p.status === 'released').reduce((a, p) => a + (p.platformCommission || 0), 0).toLocaleString()}`,
      icon: '📊',
      color: 'bg-purple-50 text-primary',
    },
  ]

  return (
    <DashboardLayout links={adminLinks}>

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
                  Brand: {screenshotModal.brandId?.brandName || screenshotModal.brandId?.fullName} ·
                  PKR {screenshotModal.totalAmount?.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setScreenshotModal(null)}
                className="w-8 h-8 rounded-lg bg-surface text-muted hover:bg-border transition-colors flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Screenshot Image */}
            <div className="p-4 bg-gray-50">
              <img
                src={screenshotModal.screenshotUrl}
                alt="Payment Screenshot"
                className="w-full max-h-96 object-contain rounded-xl"
              />
            </div>

            {/* Payment Details */}
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

              {screenshotModal.paymentNote && (
                <div className="bg-surface rounded-lg p-3">
                  <p className="text-xs text-muted">Note</p>
                  <p className="text-sm text-secondary mt-0.5">{screenshotModal.paymentNote}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setScreenshotModal(null)}
                  className="flex-1 py-2.5 border-2 border-border text-muted rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
                >
                  Close
                </button>
                {screenshotModal.status === 'screenshot_uploaded' && (
                  <button
                    onClick={() => {
                      handleVerify(screenshotModal._id)
                      setScreenshotModal(null)
                    }}
                    className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors"
                  >
                    ✅ Verify Payment
                  </button>
                )}
                {screenshotModal.status === 'verified' && (
                  <button
                    onClick={() => {
                      handleRelease(screenshotModal._id)
                      setScreenshotModal(null)
                    }}
                    className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-colors"
                  >
                    💰 Release to Creator
                  </button>
                )}
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
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color}`}>
              {s.icon}
            </div>
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
            <span className="text-muted">Account Title:</span>
            <span className="font-bold text-secondary">Trendora Official</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted">Commission Rate:</span>
            <span className="font-bold text-primary">10%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { key: 'all',                label: 'All' },
          { key: 'screenshot_uploaded',label: '📸 Needs Verify' },
          { key: 'verified',           label: '✅ Verified' },
          { key: 'released',           label: '💰 Released' },
          { key: 'pending',            label: '⏳ Pending' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
              filter === f.key
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-muted hover:border-primary hover:text-primary'
            }`}
          >
            {f.label}
            {f.key !== 'all' && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
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
            <p className="text-muted text-sm mt-1">Payments will appear here when brands pay.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(p => (
              <div key={p._id} className="px-6 py-4 hover:bg-surface transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                  {/* Left — Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-bold text-secondary">
                        {p.collaborationId?.opportunityId?.title || 'Collaboration Payment'}
                      </p>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColors[p.status]}`}>
                        {statusLabels[p.status]}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                      <span>
                        🏢 Brand: <span className="font-semibold text-secondary">
                          {p.brandId?.brandName || p.brandId?.fullName}
                        </span>
                      </span>
                      <span>
                        👤 Creator: <span className="font-semibold text-secondary">
                          {p.creatorId?.fullName}
                        </span>
                      </span>
                      {p.creatorId?.jazzCashNumber && (
                        <span>
                          📱 JazzCash: <span className="font-semibold text-secondary">
                            {p.creatorId.jazzCashNumber}
                          </span>
                        </span>
                      )}
                      {p.transactionId && (
                        <span>
                          🔖 TXN: <span className="font-semibold text-secondary">
                            {p.transactionId}
                          </span>
                        </span>
                      )}
                      <span>
                        📅 {new Date(p.createdAt).toLocaleDateString('en-PK', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Screenshot link */}
                    {p.screenshotUrl && (
                      <button
                        onClick={() => setScreenshotModal(p)}
                        className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-2 hover:underline"
                      >
                        📸 View Payment Screenshot
                      </button>
                    )}
                  </div>

                  {/* Right — Amount + Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
                    <div className="text-right">
                      <p className="text-sm font-black text-secondary">
                        PKR {p.totalAmount?.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600">
                        Creator: PKR {p.creatorAmount?.toLocaleString()}
                      </p>
                      <p className="text-xs text-primary">
                        Commission: PKR {p.platformCommission?.toLocaleString()}
                      </p>
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
                        <button
                          onClick={() => handleRelease(p._id)}
                          className="px-3 py-1.5 text-xs font-bold bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          💰 Release
                        </button>
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
    </DashboardLayout>
  )
}