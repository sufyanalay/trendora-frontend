import { useState, useEffect } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import axios from '../../../utils/axios'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

const creatorLinks = [
  { to: '/creator/dashboard',      icon: '📊', label: 'Dashboard' },
  { to: '/creator/opportunities',  icon: '🔍', label: 'Browse Opportunities' },
  { to: '/creator/applications',   icon: '📋', label: 'My Applications' },
  { to: '/creator/collaborations', icon: '🤝', label: 'Active Collaborations' },
  { to: '/creator/earnings',       icon: '💰', label: 'Earnings' },
  { to: '/creator/profile',        icon: '👤', label: 'Profile Settings' },
]

const platformIcons = {
  Instagram: 'ri:instagram-fill',
  TikTok:    'ic:baseline-tiktok',
  YouTube:   'ri:youtube-fill',
  Facebook:  'ri:facebook-fill',
  Twitter:   'ri:twitter-x-fill',
  Snapchat:  'ri:snapchat-fill',
}

export default function BrowseOpportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading]             = useState(true)
  const [category, setCategory]           = useState('All')
  const [search, setSearch]               = useState('')
  const [applying, setApplying]           = useState(null)
  const [counterModal, setCounterModal]   = useState(null)
  const [counterAmount, setCounterAmount] = useState('')
  const [counterNote, setCounterNote]     = useState('')
  const [toast, setToast]                 = useState('')
  const [expanded, setExpanded]           = useState(null)

  useEffect(() => { fetchOpportunities() }, [])

  const fetchOpportunities = async () => {
    try {
      const res = await axios.get('/opportunities')
      setOpportunities(res.data)
    } catch {
      setOpportunities([])
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleAccept = async (op) => {
    setApplying(op._id)
    try {
      await axios.post('/applications', {
        opportunityId: op._id,
        offerType:     'accept',
        counterAmount: op.budget,
        note:          '',
      })
      showToast(`✅ Applied to "${op.title}" successfully!`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to apply.')
    } finally {
      setApplying(null)
    }
  }

  const handleCounter = async () => {
    if (!counterAmount) return showToast('Please enter counter amount')
    const minAmount = Math.floor(counterModal.budget * 0.10)
    if (Number(counterAmount) < minAmount) {
      return showToast(`Minimum counter amount is PKR ${minAmount.toLocaleString()} (10% of budget)`)
    }
    if (Number(counterAmount) <= 0) {
      return showToast('Counter amount must be greater than 0')
    }
    try {
      await axios.post('/applications', {
        opportunityId: counterModal._id,
        offerType:     'counter',
        counterAmount: Number(counterAmount),
        note:          counterNote,
      })
      showToast(`✅ Counter offer of PKR ${Number(counterAmount).toLocaleString()} sent!`)
      setCounterModal(null)
      setCounterAmount('')
      setCounterNote('')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send counter offer.')
    }
  }

  // ✅ Dynamic categories from DB
  const availableCategories = ['All', ...new Set(opportunities.map(o => o.category).filter(Boolean))]

  const filtered = opportunities.filter(o => {
    const matchCat    = category === 'All' || o.category === category
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch && o.status === 'active'
  })

  return (
    <DashboardLayout links={creatorLinks}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      {/* ✅ Expanded Opportunity Modal */}
      {expanded && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 py-8"
          onClick={() => setExpanded(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-700 to-violet-700 p-6 rounded-t-3xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full border border-white/30">
                    {expanded.category}
                  </span>
                  <h2 className="text-xl font-black text-white mt-3 leading-tight">{expanded.title}</h2>
                  <p className="text-purple-200 text-sm mt-1">
                    by {expanded.brandId?.brandName || expanded.brandId?.fullName || expanded.brandName}
                  </p>
                </div>
                <button
                  onClick={() => setExpanded(null)}
                  className="w-9 h-9 rounded-xl bg-white/20 text-white hover:bg-white/30 flex items-center justify-center font-bold flex-shrink-0 transition-colors"
                >
                  <Icon icon="solar:close-bold" className="text-xl" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Key Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Budget',   value: `PKR ${expanded.budget?.toLocaleString()}`, icon: 'solar:wallet-money-bold', color: 'text-green-600' },
                  { label: 'Platform', value: expanded.platform,                          icon: platformIcons[expanded.platform] || 'solar:smartphone-bold', color: 'text-purple-600' },
                  { label: 'Deadline', value: `${expanded.deadline} days`,                icon: 'solar:clock-circle-bold', color: 'text-orange-500' },
                  { label: 'Category', value: expanded.category,                          icon: 'solar:tag-bold', color: 'text-blue-600' },
                ].map((item, i) => (
                  <div key={i} className="bg-purple-50/60 border border-purple-100 rounded-2xl p-3 text-center">
                    <Icon icon={item.icon} className={`text-2xl mx-auto mb-1 ${item.color}`} />
                    <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                    <p className="text-xs font-bold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Full Description */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Icon icon="solar:document-text-bold" className="text-purple-600" />
                  Description
                </h3>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {expanded.description}
                  </p>
                </div>
              </div>

              {/* Requirements */}
              {expanded.requirements && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Icon icon="solar:check-circle-bold" className="text-green-500" />
                    Requirements
                  </h3>
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {expanded.requirements}
                    </p>
                  </div>
                </div>
              )}

              {/* Deadline warning */}
              <div className={`rounded-2xl px-4 py-3 flex items-center gap-3 ${
                expanded.deadline <= 3
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-green-50 border border-green-200'
              }`}>
                <Icon
                  icon={expanded.deadline <= 3 ? 'solar:danger-triangle-bold' : 'solar:check-circle-bold'}
                  className={`text-xl ${expanded.deadline <= 3 ? 'text-red-500' : 'text-green-500'}`}
                />
                <p className={`text-sm font-semibold ${
                  expanded.deadline <= 3 ? 'text-red-700' : 'text-green-700'
                }`}>
                  {expanded.deadline <= 3
                    ? `Closing soon — only ${expanded.deadline} days left!`
                    : `${expanded.deadline} days remaining to apply`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => { handleAccept(expanded); setExpanded(null) }}
                  disabled={applying === expanded._id}
                  className="py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-60"
                >
                  {applying === expanded._id ? 'Applying...' : '✓ Accept Budget & Apply'}
                </button>
                <button
                  onClick={() => { setCounterModal(expanded); setExpanded(null) }}
                  className="py-3 border-2 border-purple-600 text-purple-600 font-bold rounded-2xl hover:bg-purple-50 hover:-translate-y-0.5 transition-all text-sm"
                >
                  💬 Send Counter Offer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Counter Offer Modal */}
      {counterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl shadow-purple-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-700 to-violet-700 p-5">
              <h3 className="font-black text-white text-lg">Send Counter Offer</h3>
              <p className="text-purple-200 text-sm mt-1 truncate">{counterModal.title}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-purple-50 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Brand Budget</span>
                <span className="font-black text-purple-700 text-lg">PKR {counterModal.budget?.toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  Your Counter Amount (PKR)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="solar:info-circle-bold" className="text-purple-500 text-sm flex-shrink-0" />
                  <p className="text-xs text-gray-500">
                    Min: <span className="font-bold text-purple-600">
                      PKR {Math.floor(counterModal.budget * 0.10).toLocaleString()}
                    </span>
                    {' '}(10% of budget)
                  </p>
                </div>
                <input
                  type="number"
                  placeholder={`Min PKR ${Math.floor(counterModal.budget * 0.10).toLocaleString()}`}
                  min={Math.floor(counterModal.budget * 0.10)}
                  value={counterAmount}
                  onChange={e => setCounterAmount(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  Note / Proposal
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain your experience, what you'll deliver, why you're the right creator..."
                  value={counterNote}
                  onChange={e => setCounterNote(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-none bg-gray-50"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setCounterModal(null); setCounterAmount(''); setCounterNote('') }}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-500 rounded-2xl text-sm font-semibold hover:border-purple-400 hover:text-purple-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCounter}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-purple-200 transition-all"
                >
                  Send Offer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-200">
            <Icon icon="solar:compass-bold" className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Browse Opportunities</h1>
            <p className="text-gray-500 text-sm">Find and apply to brand campaigns</p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-4 mt-4 flex-wrap">
          {[
            { icon: 'solar:fire-bold', label: `${filtered.length} Available`, color: 'text-orange-500' },
            { icon: 'solar:clock-circle-bold', label: 'Updated daily', color: 'text-blue-500' },
            { icon: 'solar:shield-check-bold', label: 'Verified brands', color: 'text-green-500' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
              <Icon icon={s.icon} className={s.color} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Icon icon="solar:magnifer-bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 bg-white shadow-sm"
          />
        </div>
        {/* ✅ Dynamic categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {availableCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                category === cat
                  ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-200'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-purple-400 hover:text-purple-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 animate-pulse border border-purple-100 shadow-sm">
              <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded-full w-1/2 mb-6" />
              <div className="h-3 bg-gray-100 rounded-full w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded-full w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Icon icon="solar:magnifer-bold" className="text-4xl text-purple-300" />
          </div>
          <p className="font-bold text-gray-700 text-lg">No opportunities found</p>
          <p className="text-gray-400 text-sm mt-1">Try different filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((op, i) => (
            <motion.div
              key={op._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-purple-100 transition-all duration-300 cursor-pointer"
              onClick={() => setExpanded(op)}
            >
              {/* Top Row */}
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                  {op.category}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  op.deadline <= 3
                    ? 'bg-red-50 text-red-600'
                    : 'bg-green-50 text-green-600'
                }`}>
                  <Icon icon="solar:clock-circle-bold" className="text-sm" />
                  {op.deadline}d left
                </span>
              </div>

              {/* Title */}
              <h3 className="font-black text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                {op.title}
              </h3>
              <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                {op.description}
              </p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Icon icon="solar:wallet-money-bold" className="text-green-500" />
                    Budget
                  </span>
                  <span className="font-black text-purple-700">PKR {op.budget?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Icon icon={platformIcons[op.platform] || 'solar:smartphone-bold'} className="text-purple-500" />
                    Platform
                  </span>
                  <span className="font-semibold text-gray-700">{op.platform}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Icon icon="solar:buildings-bold" className="text-blue-500" />
                    Brand
                  </span>
                  <span className="font-semibold text-gray-700 truncate max-w-[120px]">
                    {op.brandId?.brandName || op.brandId?.fullName || op.brandName}
                  </span>
                </div>
              </div>

              {/* Click hint */}
              <div className="text-center py-2 bg-purple-50 rounded-xl mb-3 border border-purple-100">
                <p className="text-xs text-purple-600 font-semibold flex items-center justify-center gap-1">
                  <Icon icon="solar:eye-bold" className="text-sm" />
                  Tap to view full details
                </p>
              </div>

              {/* Quick Buttons */}
              <div className="grid grid-cols-2 gap-2" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => handleAccept(op)}
                  disabled={applying === op._id}
                  className="py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-bold rounded-xl hover:shadow-md hover:shadow-purple-200 transition-all disabled:opacity-60"
                >
                  {applying === op._id ? '...' : '✓ Accept'}
                </button>
                <button
                  onClick={() => setCounterModal(op)}
                  className="py-2.5 border-2 border-purple-600 text-purple-600 text-xs font-bold rounded-xl hover:bg-purple-50 transition-colors"
                >
                  Counter
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
