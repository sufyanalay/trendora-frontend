import { useState } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import { brandLinks } from './BrandDashboard'
import axios from '../../../utils/axios'

const platformOptions  = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter', 'Snapchat', 'Other']
const categoryOptions  = ['AI Marketing', 'Fashion', 'Food', 'Tech', 'Lifestyle', 'Gaming', 'Fitness', 'Travel', 'Beauty', 'Education', 'Other']

export default function PostOpportunity() {
  const [form, setForm] = useState({
    title: '', description: '', category: '',
    budget: '', deadline: '', platform: '',
  })
  const [customPlatform, setCustomPlatform]   = useState('')
  const [customCategory, setCustomCategory]   = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // ✅ Other select hone par custom value use karo
    const finalPlatform = form.platform === 'Other' ? customPlatform.trim() : form.platform
    const finalCategory = form.category === 'Other' ? customCategory.trim() : form.category

    if (!finalPlatform) return setError('Please enter a platform name')
    if (!finalCategory) return setError('Please enter a category name')

    setLoading(true)
    try {
      await axios.post('/opportunities', {
        ...form,
        platform: finalPlatform,
        category: finalCategory,
        budget:   Number(form.budget),
        deadline: Number(form.deadline),
      })
      setSuccess(true)
      setForm({ title: '', description: '', category: '', budget: '', deadline: '', platform: '' })
      setCustomPlatform('')
      setCustomCategory('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post opportunity.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout links={brandLinks}>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">Post Opportunity</h1>
        <p className="text-muted text-sm mt-1">Create a new campaign for creators to apply.</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-card rounded-2xl border border-border shadow-card p-8">

          {success && (
            <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
              ✅ Opportunity posted successfully! Creators can now apply.
            </div>
          )}

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-secondary mb-1.5">
                Opportunity Title
              </label>
              <input
                type="text" required
                placeholder="e.g. Need a 30-Second AI Generated Ad"
                value={form.title} onChange={e => update('title', e.target.value)}
                className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-secondary mb-1.5">
                Description
              </label>
              <textarea
                required rows={4}
                placeholder="Describe what you need, target audience, content style..."
                value={form.description} onChange={e => update('description', e.target.value)}
                className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light resize-none"
              />
            </div>

            {/* Category + Platform */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">Category</label>
                <select
                  required value={form.category} onChange={e => update('category', e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-white"
                >
                  <option value="">Select category</option>
                  {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* ✅ Custom Category Input */}
                {form.category === 'Other' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter your category..."
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    className="w-full mt-2 px-4 py-3 text-sm border border-primary rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                )}
              </div>

              {/* Platform */}
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">Platform</label>
                <select
                  required value={form.platform} onChange={e => update('platform', e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-white"
                >
                  <option value="">Select platform</option>
                  {platformOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>

                {/* ✅ Custom Platform Input */}
                {form.platform === 'Other' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter your platform..."
                    value={customPlatform}
                    onChange={e => setCustomPlatform(e.target.value)}
                    className="w-full mt-2 px-4 py-3 text-sm border border-primary rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                )}
              </div>
            </div>

            {/* Budget + Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">Budget (PKR)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">PKR</span>
                  <input
                    type="number" required min="100"
                    placeholder="e.g. 5000"
                    value={form.budget} onChange={e => update('budget', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">Deadline (Days)</label>
                <div className="relative">
                  <input
                    type="number" required min="1" max="60"
                    placeholder="e.g. 7"
                    value={form.deadline} onChange={e => update('deadline', e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted">days</span>
                </div>
              </div>
            </div>

            {/* Preview */}
            {form.title && (
              <div className="bg-primary-light rounded-xl p-4 border border-primary/20">
                <p className="text-xs font-bold text-primary mb-2">Preview</p>
                <p className="text-sm font-bold text-secondary">{form.title}</p>
                <p className="text-xs text-muted mt-1">
                  {form.budget && <span>Budget: <span className="text-primary font-bold">PKR {Number(form.budget).toLocaleString()}</span></span>}
                  {form.deadline && <span> · {form.deadline} days</span>}
                  {form.platform && (
                    <span> · {form.platform === 'Other' ? customPlatform || 'Other' : form.platform}</span>
                  )}
                  {form.category && (
                    <span> · {form.category === 'Other' ? customCategory || 'Other' : form.category}</span>
                  )}
                </p>
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors shadow-purple text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : '📢 Post Opportunity'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}


// import { useState } from 'react'
// import DashboardLayout from '../shared/DashboardLayout'
// import { brandLinks } from './BrandDashboard'
// import axios from '../../../utils/axios'

// const platforms   = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter', 'Snapchat']
// const categories  = ['AI Marketing', 'Fashion', 'Food', 'Tech', 'Lifestyle', 'Gaming', 'Fitness', 'Travel', 'Beauty', 'Education']

// export default function PostOpportunity() {
//   const [form, setForm] = useState({
//     title: '', description: '', category: '',
//     budget: '', deadline: '', platform: '',
//   })
//   const [loading, setLoading] = useState(false)
//   const [success, setSuccess] = useState(false)
//   const [error, setError]     = useState('')

//   const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)
//     try {
//       await axios.post('/opportunities', {
//         ...form,
//         budget:   Number(form.budget),
//         deadline: Number(form.deadline),
//       })
//       setSuccess(true)
//       setForm({ title: '', description: '', category: '', budget: '', deadline: '', platform: '' })
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to post opportunity.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <DashboardLayout links={brandLinks}>
//       <div className="mb-6">
//         <h1 className="text-2xl font-black text-secondary">Post Opportunity</h1>
//         <p className="text-muted text-sm mt-1">Create a new campaign for creators to apply.</p>
//       </div>

//       <div className="max-w-2xl">
//         <div className="bg-card rounded-2xl border border-border shadow-card p-8">

//           {success && (
//             <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
//               ✅ Opportunity posted successfully! Creators can now apply.
//             </div>
//           )}

//           {error && (
//             <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">

//             {/* Title */}
//             <div>
//               <label className="block text-sm font-semibold text-secondary mb-1.5">
//                 Opportunity Title
//               </label>
//               <input
//                 type="text" required
//                 placeholder="e.g. Need a 30-Second AI Generated Ad"
//                 value={form.title} onChange={e => update('title', e.target.value)}
//                 className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-semibold text-secondary mb-1.5">
//                 Description
//               </label>
//               <textarea
//                 required rows={4}
//                 placeholder="Describe what you need, target audience, content style..."
//                 value={form.description} onChange={e => update('description', e.target.value)}
//                 className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light resize-none"
//               />
//             </div>

//             {/* Category + Platform */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold text-secondary mb-1.5">Category</label>
//                 <select
//                   required value={form.category} onChange={e => update('category', e.target.value)}
//                   className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-white"
//                 >
//                   <option value="">Select category</option>
//                   {categories.map(c => <option key={c} value={c}>{c}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-secondary mb-1.5">Platform</label>
//                 <select
//                   required value={form.platform} onChange={e => update('platform', e.target.value)}
//                   className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-white"
//                 >
//                   <option value="">Select platform</option>
//                   {platforms.map(p => <option key={p} value={p}>{p}</option>)}
//                 </select>
//               </div>
//             </div>

//             {/* Budget + Deadline */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold text-secondary mb-1.5">
//                   Budget (PKR)
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">PKR</span>
//                   <input
//                     type="number" required min="100"
//                     placeholder="e.g. 5000"
//                     value={form.budget} onChange={e => update('budget', e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-secondary mb-1.5">
//                   Deadline (Days)
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="number" required min="1" max="60"
//                     placeholder="e.g. 7"
//                     value={form.deadline} onChange={e => update('deadline', e.target.value)}
//                     className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
//                   />
//                   <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted">days</span>
//                 </div>
//               </div>
//             </div>

//             {/* Preview Card */}
//             {form.title && (
//               <div className="bg-primary-light rounded-xl p-4 border border-primary/20">
//                 <p className="text-xs font-bold text-primary mb-2">Preview</p>
//                 <p className="text-sm font-bold text-secondary">{form.title}</p>
//                 {form.budget && (
//                   <p className="text-xs text-muted mt-1">
//                     Budget: <span className="text-primary font-bold">PKR {Number(form.budget).toLocaleString()}</span>
//                     {form.deadline && <span> · Deadline: {form.deadline} days</span>}
//                     {form.platform && <span> · {form.platform}</span>}
//                   </p>
//                 )}
//               </div>
//             )}

//             <button
//               type="submit" disabled={loading}
//               className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors shadow-purple text-sm disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Posting...' : '📢 Post Opportunity'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </DashboardLayout>
//   )
// }