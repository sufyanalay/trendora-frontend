import { useState, useEffect, useRef } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import { brandLinks } from './BrandDashboard'
import axios from '../../../utils/axios'

const statusColors = {
  pending:             'bg-gray-100 text-gray-600',
  screenshot_uploaded: 'bg-yellow-50 text-yellow-700',
  verified:            'bg-blue-50 text-blue-700',
  released:            'bg-green-50 text-green-700',
  refunded:            'bg-red-50 text-red-600',
}

const statusLabels = {
  pending:             '⏳ Payment Pending',
  screenshot_uploaded: '📸 Verification Pending',
  verified:            '✅ Verified',
  released:            '💰 Released',
  refunded:            '↩️ Refunded',
}

export default function BrandPayments() {
  const [payments, setPayments]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [uploadModal, setUploadModal]     = useState(null)
  const [screenshot, setScreenshot]       = useState(null)
  const [screenshotPreview, setPreview]   = useState(null)
  const [transactionId, setTransactionId] = useState('')
  const [jazzCash, setJazzCash]           = useState('')
  const [payNote, setPayNote]             = useState('')
  const [uploading, setUploading]         = useState(false)
  const [toast, setToast]                 = useState('')
  const fileRef                           = useRef(null)

  useEffect(() => { fetchPayments() }, [])

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/payments/brand')
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setScreenshot(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleUpload = async () => {
    if (!screenshot) return showToast('Please select a screenshot first')
    if (!transactionId.trim()) return showToast('Please enter Transaction ID')

    setUploading(true)
    try {
      // Step 1 — Cloudinary pe upload karo
      const formData = new FormData()
      formData.append('image', screenshot)

      const uploadRes = await axios.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const screenshotUrl = uploadRes.data.url

      // Step 2 — Payment record update karo
      await axios.put(`/payments/${uploadModal._id}/upload-screenshot`, {
        screenshotUrl,
        transactionId,
        brandJazzCash: jazzCash,
        paymentNote:   payNote,
      })

      setPayments(prev => prev.map(p =>
        p._id === uploadModal._id
          ? { ...p, status: 'screenshot_uploaded', screenshotUrl }
          : p
      ))

      showToast('✅ Payment proof submitted! Admin will verify soon.')
      setUploadModal(null)
      resetForm()

    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setScreenshot(null)
    setPreview(null)
    setTransactionId('')
    setJazzCash('')
    setPayNote('')
  }

  const totalSpent      = payments.filter(p => p.status === 'released').reduce((a, p) => a + (p.totalAmount || 0), 0)
  const totalPending    = payments.filter(p => ['pending', 'screenshot_uploaded'].includes(p.status)).reduce((a, p) => a + (p.totalAmount || 0), 0)
  const totalCommission = payments.filter(p => p.status === 'released').reduce((a, p) => a + (p.platformCommission || 0), 0)

  return (
    <DashboardLayout links={brandLinks}>

      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      {/* Payment Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 overflow-y-auto py-6">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-purple my-auto">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark p-6 rounded-t-2xl">
              <h3 className="font-black text-white text-xl">Complete Payment</h3>
              <p className="text-purple-200 text-sm mt-1">
                Send payment to Trendora and upload proof
              </p>
            </div>

            <div className="p-6 space-y-5">

              {/* Amount */}
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <p className="text-xs text-muted mb-1">Total Amount to Pay</p>
                <p className="text-3xl font-black text-primary">
                  PKR {uploadModal.totalAmount?.toLocaleString()}
                </p>
                <p className="text-xs text-muted mt-1">
                  Creator will receive PKR {uploadModal.creatorAmount?.toLocaleString()} after 10% commission
                </p>
              </div>

              {/* Send To */}
              <div className="bg-gray-50 rounded-xl p-4 border border-border">
                <p className="text-xs font-bold text-secondary mb-3">
                  📱 Send Payment To:
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'JazzCash Number', value: '0300-XXXXXXX' },
                    { label: 'Account Title',   value: 'Trendora Official' },
                    { label: 'Amount',          value: `PKR ${uploadModal.totalAmount?.toLocaleString()}` },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs text-muted">{item.label}:</span>
                      <span className="text-sm font-bold text-secondary">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  📸 Upload Payment Screenshot *
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    screenshotPreview
                      ? 'border-primary bg-primary-light'
                      : 'border-border hover:border-primary hover:bg-primary-light'
                  }`}
                >
                  {screenshotPreview ? (
                    <div>
                      <img
                        src={screenshotPreview}
                        alt="Screenshot preview"
                        className="max-h-40 mx-auto rounded-lg object-contain mb-2"
                      />
                      <p className="text-xs text-primary font-semibold">
                        ✅ Screenshot selected — click to change
                      </p>
                    </div>
                  ) : (
                    <div className="py-4">
                      <div className="text-3xl mb-2">📷</div>
                      <p className="text-sm font-semibold text-secondary">
                        Click to upload screenshot
                      </p>
                      <p className="text-xs text-muted mt-1">JPG, PNG, WEBP supported</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Transaction ID / Reference Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. TXN123456789"
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>

              {/* Sender JazzCash */}
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Your JazzCash Number
                </label>
                <input
                  type="text"
                  placeholder="03XX-XXXXXXX"
                  value={jazzCash}
                  onChange={e => setJazzCash(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Any additional info..."
                  value={payNote}
                  onChange={e => setPayNote(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setUploadModal(null); resetForm() }}
                  className="flex-1 py-3 border-2 border-border text-muted rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !screenshot || !transactionId.trim()}
                  className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    '✅ Submit Payment Proof'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">Payments</h1>
        <p className="text-muted text-sm mt-1">Track all your campaign payments.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Spent',      value: `PKR ${totalSpent.toLocaleString()}`,      icon: '💳', color: 'bg-green-50 text-green-700' },
          { label: 'Pending Payments', value: `PKR ${totalPending.toLocaleString()}`,    icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Commission Paid',  value: `PKR ${totalCommission.toLocaleString()}`, icon: '📊', color: 'bg-purple-50 text-primary' },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-2xl p-5 border border-border shadow-card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color}`}>{s.icon}</div>
            <div className="text-xl font-black text-secondary">{s.value}</div>
            <div className="text-xs text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* How it Works */}
      <div className="bg-primary-light rounded-2xl p-5 border border-primary/20 mb-6">
        <h2 className="font-bold text-secondary mb-4">How Payments Work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Accept Creator',   desc: 'Accept a creator application' },
            { step: '2', title: 'Pay Trendora',     desc: 'Send payment via JazzCash & upload screenshot' },
            { step: '3', title: 'Admin Verifies',   desc: 'Admin verifies within 24 hours & collaboration activates' },
            { step: '4', title: 'Work & Release',   desc: 'Approve work → creator gets paid automatically' },
          ].map(s => (
            <div key={s.step} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {s.step}
              </div>
              <div>
                <p className="text-sm font-bold text-secondary">{s.title}</p>
                <p className="text-xs text-muted mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <h2 className="font-bold text-secondary mb-5">Payment History</h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">💳</div>
            <p className="font-medium text-secondary">No payments yet</p>
            <p className="text-muted text-sm mt-1">Accept a creator to see payment here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p._id} className="bg-surface rounded-xl p-4 border border-border hover:border-primary transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-secondary">
                      {p.collaborationId?.opportunityId?.title || 'Collaboration Payment'}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      Creator: {p.creatorId?.fullName} ·{' '}
                      {new Date(p.createdAt).toLocaleDateString('en-PK', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>

                    {/* Screenshot preview agar uploaded hai */}
                    {p.screenshotUrl && (
                      <a
                        href={p.screenshotUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-1 hover:underline"
                      >
                        📸 View Screenshot
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-right">
                      <p className="text-sm font-bold text-secondary">
                        PKR {p.totalAmount?.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted">
                        Creator: PKR {p.creatorAmount?.toLocaleString()}
                      </p>
                    </div>

                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusColors[p.status]}`}>
                      {statusLabels[p.status]}
                    </span>

                    {p.status === 'pending' && (
                      <button
                        onClick={() => setUploadModal(p)}
                        className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors"
                      >
                        💳 Pay Now
                      </button>
                    )}
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