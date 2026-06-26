// import { useState, useEffect } from 'react'
// import DashboardLayout from '../shared/DashboardLayout'
// import { brandLinks } from './BrandDashboard'
// import axios from '../../../utils/axios'
// import { Link } from 'react-router-dom'

// export default function MyOpportunities() {
//   const [opportunities, setOpportunities] = useState([])
//   const [loading, setLoading]             = useState(true)

//   useEffect(() => {
//     fetchMyOpportunities()
//   }, [])

//  const fetchMyOpportunities = async () => {
//   try {
//     const res = await axios.get('/opportunities/my/list')
//     setOpportunities(res.data)
//   } catch {
//     setOpportunities([])
//   } finally {
//     setLoading(false)
//   }
// }

//   const statusColors = {
//     active:    'bg-green-50 text-green-700',
//     closed:    'bg-gray-100 text-gray-600',
//     completed: 'bg-blue-50 text-blue-700',
//   }

//   return (
//     <DashboardLayout links={brandLinks}>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-black text-secondary">My Opportunities</h1>
//           <p className="text-muted text-sm mt-1">All campaigns you have posted.</p>
//         </div>
//         <Link
//           to="/brand/post-opportunity"
//           className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors"
//         >
//           + Post New
//         </Link>
//       </div>

//       {loading ? (
//         <div className="space-y-4">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="bg-card rounded-2xl p-6 border border-border animate-pulse">
//               <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
//               <div className="h-3 bg-gray-100 rounded w-1/3" />
//             </div>
//           ))}
//         </div>
//       ) : opportunities.length === 0 ? (
//         <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center py-16">
//           <div className="text-5xl mb-3">📢</div>
//           <p className="font-medium text-secondary">No opportunities posted yet</p>
//           <p className="text-muted text-sm mt-1">Post your first campaign to get started.</p>
//           <Link
//             to="/brand/post-opportunity"
//             className="inline-block mt-4 px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors"
//           >
//             Post Opportunity
//           </Link>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {opportunities.map(op => (
//             <div key={op._id} className="bg-card rounded-2xl border border-border shadow-card p-6 hover:border-primary transition-all">
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-3 mb-2 flex-wrap">
//                     <h3 className="font-bold text-secondary">{op.title}</h3>
//                     <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[op.status]}`}>
//                       {op.status}
//                     </span>
//                   </div>
//                   <p className="text-sm text-muted line-clamp-1 mb-3">{op.description}</p>
//                   <div className="flex flex-wrap gap-4 text-xs text-muted">
//                     <span>💰 PKR {op.budget?.toLocaleString()}</span>
//                     <span>📱 {op.platform}</span>
//                     <span>⏰ {op.deadline} days</span>
//                     <span>📁 {op.category}</span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 flex-shrink-0">
//                   <button className="px-3 py-1.5 text-xs font-semibold border border-border text-muted rounded-lg hover:border-primary hover:text-primary transition-colors">
//                     Edit
//                   </button>
//                   <button className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </DashboardLayout>
//   )
// }

import { useState, useEffect } from "react";
// import DashboardLayout from "../shared/DashboardLayout";
import { brandLinks } from "./BrandDashboard";
import axios from "../../../utils/axios";
import { Link } from "react-router-dom";

const platforms = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Facebook",
  "Twitter",
  "Snapchat",
];
const categories = [
  "AI Marketing",
  "Fashion",
  "Food",
  "Tech",
  "Lifestyle",
  "Gaming",
  "Fitness",
  "Travel",
  "Beauty",
  "Education",
];

export default function MyOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMyOpportunities();
  }, []);

  const fetchMyOpportunities = async () => {
    try {
      const res = await axios.get("/opportunities/my/list");
      setOpportunities(res.data);
    } catch {
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleEdit = (op) => {
    setEditForm({
      title: op.title,
      description: op.description,
      category: op.category,
      platform: op.platform,
      budget: op.budget,
      deadline: op.deadline,
    });
    setEditModal(op);
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`/opportunities/${editModal._id}`, {
        ...editForm,
        budget: Number(editForm.budget),
        deadline: Number(editForm.deadline),
      });
      setOpportunities((prev) =>
        prev.map((op) => (op._id === editModal._id ? res.data : op)),
      );
      showToast("✅ Opportunity updated!");
      setEditModal(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = async (id) => {
    if (
      !window.confirm(
        "Close this opportunity? No new applications will be accepted.",
      )
    )
      return;
    try {
      await axios.put(`/opportunities/${id}/close`);
      setOpportunities((prev) =>
        prev.map((op) => (op._id === id ? { ...op, status: "closed" } : op)),
      );
      showToast("✅ Opportunity closed");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to close");
    }
  };

  const statusColors = {
    active: "bg-green-50 text-green-700",
    closed: "bg-gray-100 text-gray-600",
    completed: "bg-blue-50 text-blue-700",
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-purple overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-dark p-5">
              <h3 className="font-black text-white text-lg">
                Edit Opportunity
              </h3>
              <p className="text-purple-200 text-sm mt-1 truncate">
                {editModal.title}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, category: e.target.value }))
                    }
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    Platform
                  </label>
                  <select
                    value={editForm.platform}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, platform: e.target.value }))
                    }
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary bg-white"
                  >
                    {platforms.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    Budget (PKR)
                  </label>
                  <input
                    type="number"
                    value={editForm.budget}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, budget: e.target.value }))
                    }
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    Deadline (Days)
                  </label>
                  <input
                    type="number"
                    value={editForm.deadline}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, deadline: e.target.value }))
                    }
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditModal(null)}
                  className="flex-1 py-2.5 border-2 border-border text-muted rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving..." : "✅ Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-secondary">
            My Opportunities
          </h1>
          <p className="text-muted text-sm mt-1">
            All campaigns you have posted.
          </p>
        </div>
        <Link
          to="/brand/post-opportunity"
          className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors"
        >
          + Post New
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-6 border border-border animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center py-16">
          <div className="text-5xl mb-3">📢</div>
          <p className="font-medium text-secondary">
            No opportunities posted yet
          </p>
          <p className="text-muted text-sm mt-1">
            Post your first campaign to get started.
          </p>
          <Link
            to="/brand/post-opportunity"
            className="inline-block mt-4 px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Post Opportunity
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((op) => (
            <div
              key={op._id}
              className="bg-card rounded-2xl border border-border shadow-card p-6 hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-bold text-secondary">{op.title}</h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[op.status]}`}
                    >
                      {op.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted line-clamp-1 mb-3">
                    {op.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted">
                    <span>💰 PKR {op.budget?.toLocaleString()}</span>
                    <span>📱 {op.platform}</span>
                    <span>⏰ {op.deadline} days</span>
                    <span>📁 {op.category}</span>
                    <span>
                      📅{" "}
                      {new Date(op.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {op.status === "active" && (
                    <>
                      <button
                        onClick={() => handleEdit(op)}
                        className="px-3 py-1.5 text-xs font-semibold border border-border text-muted rounded-lg hover:border-primary hover:text-primary transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleClose(op._id)}
                        className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        🔒 Close
                      </button>
                    </>
                  )}
                  {op.status === "closed" && (
                    <span className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-500 rounded-lg">
                      Closed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
