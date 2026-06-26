import { useState, useEffect } from "react";
// import DashboardLayout from "../shared/DashboardLayout";
import axios from "../../../utils/axios";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
// import { creatorLinks } from "../creator/CreatorDashboard";
// import { creatorLinks } from "../dashboardLinks";

// const creatorLinks = [
//   { to: '/creator/dashboard',      icon: '📊', label: 'Dashboard' },
//   { to: '/creator/opportunities',  icon: '🔍', label: 'Browse Opportunities' },
//   { to: '/creator/applications',   icon: '📋', label: 'My Applications' },
//   { to: '/creator/collaborations', icon: '🤝', label: 'Active Collaborations' },
//   { to: '/creator/earnings',       icon: '💰', label: 'Earnings' },
//   { to: '/creator/profile',        icon: '👤', label: 'Profile Settings' },
// ]

const statusColors = {
  pending: "bg-yellow-50 text-yellow-700",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-600",
  countered: "bg-blue-50 text-blue-700",
  withdrawn: "bg-gray-100 text-gray-500",
};

const statusLabels = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  countered: "Counter Offer",
  withdrawn: "Withdrawn",
};
const statusFilters = [
  "All",
  "Pending",
  "Accepted",
  "Counter Offer",
  "Rejected",
  "Withdrawn",
];
const statusIcons = {
  pending: "solar:hourglass-bold",
  accepted: "solar:check-circle-bold",
  rejected: "solar:close-circle-bold",
  countered: "solar:refresh-circle-bold",
  withdrawn: "solar:undo-left-round-bold",
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [counterModal, setCounterModal] = useState(null);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterNote, setCounterNote] = useState("");
  const [editModal, setEditModal] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [withdrawModal, setWithdrawModal] = useState(null);
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("/applications/my");
      setApplications(res.data);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  // ✅ Withdraw with warning
  const handleWithdraw = async (id) => {
    const withdrawnCount = applications.filter(
      (a) => a.status === "withdrawn",
    ).length;
    const remaining = 2 - withdrawnCount;

    if (withdrawnCount >= 2) {
      if (
        !window.confirm(
          `⚠️ Warning: This is your 3rd withdrawal!\n\nAfter this you will be BANNED from applying for 7 days.\n\nAre you sure?`,
        )
      )
        return;
    } else {
      if (
        !window.confirm(
          `Withdraw this application?\n\nNote: After ${remaining} more withdrawal(s) you will be temporarily banned.\n\nAre you sure?`,
        )
      )
        return;
    }

    try {
      const res = await axios.delete(`/applications/${id}`);
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "withdrawn" } : a)),
      );
      if (res.data.banned) {
        showToast(
          "⚠️ You have been temporarily banned from applying for 7 days due to too many withdrawals.",
        );
      } else {
        showToast("Application withdrawn");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to withdraw");
    }
  };
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.opportunityId?.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      status === "All" || statusLabels[app.status] === status;

    return matchesSearch && matchesStatus;
  });

  // ✅ Edit pending application
  const handleEditOpen = (app) => {
    setEditModal(app);
    setEditAmount(app.counterAmount || "");
    setEditNote(app.note || "");
  };

  const handleEditSave = async () => {
    const minAmount = Math.floor(editModal.opportunityId?.budget * 0.1);
    if (Number(editAmount) < minAmount) {
      return showToast(
        `Minimum amount is PKR ${minAmount.toLocaleString()} (10% of budget)`,
      );
    }

    setSaving(true);
    try {
      const res = await axios.put(`/applications/${editModal._id}`, {
        counterAmount: Number(editAmount),
        note: editNote,
      });
      setApplications((prev) =>
        prev.map((a) =>
          a._id === editModal._id
            ? {
                ...a,
                counterAmount: res.data.counterAmount,
                note: res.data.note,
              }
            : a,
        ),
      );
      showToast("✅ Application updated!");
      setEditModal(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleCreatorRespond = async (action) => {
    if (action === "counter") {
      const minAmount = Math.floor(counterModal.opportunityId?.budget * 0.1);
      if (!counterAmount || Number(counterAmount) < minAmount) {
        return showToast(
          `Minimum counter amount is PKR ${minAmount.toLocaleString()}`,
        );
      }
    }

    try {
      await axios.put(`/applications/${counterModal._id}/creator-respond`, {
        action,
        counterAmount: Number(counterAmount),
        note: counterNote,
      });
      setApplications((prev) =>
        prev.map((a) =>
          a._id === counterModal._id
            ? {
                ...a,
                status:
                  action === "accept"
                    ? "accepted"
                    : action === "reject"
                      ? "rejected"
                      : "countered",
              }
            : a,
        ),
      );
      showToast(
        action === "accept"
          ? "✅ Counter offer accepted!"
          : action === "reject"
            ? "❌ Counter offer rejected"
            : "🔄 New counter sent!",
      );
      setCounterModal(null);
      setCounterAmount("");
      setCounterNote("");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed");
    }
  };

  const withdrawnCount = applications.filter(
    (a) => a.status === "withdrawn",
  ).length;

  return (
    <>
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple max-w-sm">
          {toast}
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-lg overflow-hidden rounded-[32px] border border-purple-100 bg-white shadow-[0_25px_80px_rgba(124,58,237,0.18)]"
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 px-7 py-6">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

              <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                  <Icon icon="solar:pen-bold" className="text-3xl text-white" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white">
                    Edit Application
                  </h2>

                  <p className="mt-1 text-sm text-purple-100 truncate">
                    {editModal.opportunityId?.title}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-7 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Your Amount (PKR)
                </label>
                <p className="text-xs text-muted mb-2">
                  Min:{" "}
                  <span className="font-bold text-primary">
                    PKR{" "}
                    {Math.floor(
                      (editModal.opportunityId?.budget || 0) * 0.1,
                    ).toLocaleString()}
                  </span>{" "}
                  · Budget: PKR{" "}
                  {editModal.opportunityId?.budget?.toLocaleString()}
                </p>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  min={Math.floor((editModal.opportunityId?.budget || 0) * 0.1)}
                  className="
w-full
rounded-2xl
border

bg-[#FCFBFF]
px-5
py-3.5
text-sm
font-medium
outline-none
border-primary
focus:ring-4
ring-purple-100
transition-all
"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Note / Proposal
                </label>
                <textarea
                  rows={3}
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Update your proposal..."
                  className="
w-full
rounded-2xl
border

px-5
py-3.5
text-sm
resize-none
outline-none
border-primary
focus:ring-4
focus:ring-purple-100
transition-all
"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditModal(null)}
                  className="
flex
items-center
justify-center
gap-2
flex-1
h-12
rounded-2xl
border
border-purple-100
font-semibold
text-secondary
transition-all
hover:bg-purple-50
hover:border-primary
"
                >
                  <>
                    <Icon
                      icon="solar:close-circle-linear"
                      className="text-lg"
                    />
                    Cancel
                  </>
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={saving}
                  className="
flex
items-center
justify-center
gap-2
flex-1
h-12
rounded-2xl
bg-gradient-to-r
from-purple-600
to-violet-600
font-bold
text-white
transition-all
hover:-translate-y-0.5
hover:shadow-lg
hover:shadow-purple-300/30
disabled:opacity-60
"
                >
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Icon icon="solar:diskette-bold" className="text-lg" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Counter Modal */}
      {counterModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-purple">
            <h3 className="font-bold text-secondary text-lg mb-1">
              Brand Counter Offer
            </h3>
            <p className="text-sm text-muted mb-2">
              Brand offered:{" "}
              <span className="font-bold text-primary">
                PKR {counterModal.lastCounterAmount?.toLocaleString()}
              </span>
            </p>
            {counterModal.lastCounterNote && (
              <p className="text-xs text-muted bg-surface rounded-lg px-3 py-2 mb-4">
                "{counterModal.lastCounterNote}"
              </p>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-secondary mb-1.5">
                Your Counter Amount (PKR)
              </label>
              <p className="text-xs text-muted mb-2">
                Min:{" "}
                <span className="font-bold text-primary">
                  PKR{" "}
                  {Math.floor(
                    (counterModal.opportunityId?.budget || 0) * 0.1,
                  ).toLocaleString()}
                </span>
              </p>
              <input
                type="number"
                placeholder="Enter amount..."
                min={Math.floor(
                  (counterModal.opportunityId?.budget || 0) * 0.1,
                )}
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-secondary mb-1.5">
                Note
              </label>
              <textarea
                rows={2}
                placeholder="Add a note..."
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleCreatorRespond("accept")}
                className="py-2.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-colors"
              >
                ✓ Accept
              </button>
              <button
                onClick={() => handleCreatorRespond("counter")}
                className="py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-colors"
              >
                Counter
              </button>
              <button
                onClick={() => handleCreatorRespond("reject")}
                className="py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors"
              >
                ✕ Reject
              </button>
            </div>
            <button
              onClick={() => setCounterModal(null)}
              className="w-full mt-2 py-2 text-xs text-muted hover:text-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {withdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-lg overflow-hidden rounded-[32px] border border-purple-100 bg-white shadow-[0_25px_80px_rgba(124,58,237,0.18)]"
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 px-7 py-6">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

              <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                  <Icon
                    icon="solar:shield-warning-bold"
                    className="text-3xl text-white"
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white">
                    Withdraw Application
                  </h2>

                  <p className="mt-1 text-sm text-purple-100">
                    Please review before continuing.
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-7">
              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="solar:info-circle-bold"
                    className="mt-0.5 text-2xl text-primary"
                  />

                  <div>
                    <h3 className="font-bold text-secondary">Are you sure?</h3>

                    <p className="mt-1 text-sm leading-6 text-muted">
                      This application will be withdrawn immediately and you
                      will no longer be considered for this opportunity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="solar:danger-triangle-bold"
                    className="mt-0.5 text-2xl text-red-500"
                  />

                  <div>
                    <h3 className="font-bold text-red-600">Important Notice</h3>

                    <p className="mt-1 text-sm leading-6 text-red-500">
                      Repeated withdrawals may temporarily restrict your account
                      from applying to new opportunities for a limited period.
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-7 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setWithdrawModal(null)}
                  className="flex items-center justify-center gap-2 h-12 rounded-2xl border border-purple-100 bg-white font-semibold text-secondary transition-all hover:border-primary hover:bg-purple-50"
                >
                  <Icon icon="solar:close-circle-linear" className="text-lg" />
                  Cancel
                </button>

                <button
                  onClick={() => {
                    handleWithdraw(withdrawModal._id);
                    setWithdrawModal(null);
                  }}
                  className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 font-bold text-white transition-all hover:shadow-lg hover:shadow-purple-300/30 hover:-translate-y-0.5"
                >
                  <Icon icon="solar:logout-2-bold" className="text-lg" />
                  Withdraw
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-200">
            <Icon
              icon="solar:clipboard-list-bold"
              className="text-white text-xl"
            />
          </div>

          <div>
            <h1 className="text-2xl font-black text-secondary">
              My Applications
            </h1>

            <p className="text-muted text-sm">
              Track all your opportunity applications.
            </p>
          </div>
        </div>

        {/* ✅ Withdraw warning */}
        {withdrawnCount > 0 && (
          <div
            className={`mt-3 px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${
              withdrawnCount >= 2
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-yellow-50 border border-yellow-200 text-yellow-700"
            }`}
          >
            <Icon
              icon="solar:danger-triangle-bold"
              className="text-lg flex-shrink-0"
            />
            <span>
              You have withdrawn <strong>{withdrawnCount}</strong>{" "}
              application(s).
              {withdrawnCount >= 2
                ? " Next withdrawal will ban you from applying for 7 days!"
                : ` ${3 - withdrawnCount} more allowed before temporary ban.`}
            </span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-3 mt-6 mb-6">
          <div className="relative flex-1">
            <Icon
              icon="mynaui:search"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 text-lg"
            />

            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
w-full
pl-11
pr-4
py-3
text-sm
bg-white
border
border-gray-200
rounded-[22px]
shadow-sm
focus:outline-none
focus:border-purple-500
hover:border-primary
focus:ring-4
focus:ring-purple-100
transition-all
"
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {statusFilters.map((item) => (
              <button
                key={item}
                onClick={() => setStatus(item)}
                className={`whitespace-nowrap px-6 py-3 text-xs font-bold rounded-2xl transition-all ${
                  status === item
                    ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-200"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
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
      ) : filteredApplications.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center py-16">
          <div className="text-5xl mb-3">
            <div className="w-20 h-20 rounded-3xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <Icon
                icon="solar:document-bold"
                className="text-5xl text-purple-300"
              />
            </div>
          </div>
          <p className="font-medium text-secondary">No applications yet</p>
          <p className="text-muted text-sm mt-1">
            Browse opportunities and start applying!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredApplications.map((app) => (
            <div
              key={app._id}
              className="
group

bg-white
rounded-[28px]
border
border-purple-100
shadow-sm
hover:shadow-xl
hover:shadow-purple-100/50
hover:border-primary
transition-all
duration-300
overflow-hidden
h-full
flex
flex-col
"
            >
              <div className="p-5 flex flex-col h-full">
                {/* Header */}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${statusColors[app.status]}`}
                      >
                        <Icon
                          icon={statusIcons[app.status]}
                          className="text-xs"
                        />
                        {statusLabels[app.status]}
                      </span>
                    </div>

                    <h3 className="font-black text-xl text-secondary leading-snug line-clamp-2">
                      {app.opportunityId?.title}
                    </h3>

                    {app.note && (
                      <p className="mt-2 text-sm text-muted line-clamp-2">
                        "{app.note}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Information */}

                <div className="space-y-3 mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted">
                      <Icon
                        icon="solar:wallet-money-bold"
                        className="text-green-500"
                      />
                      Your Offer
                    </div>

                    <span className="font-black text-primary">
                      PKR {app.counterAmount?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted">
                      <Icon
                        icon="solar:wallet-bold"
                        className="text-orange-500"
                      />
                      Budget
                    </div>

                    <span className="font-bold">
                      PKR {app.opportunityId?.budget?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted">
                      <Icon
                        icon="solar:smartphone-bold"
                        className="text-violet-500"
                      />
                      Platform
                    </div>

                    <span className="font-bold">
                      {app.opportunityId?.platform}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted">
                      <Icon
                        icon="solar:calendar-bold"
                        className="text-blue-500"
                      />
                      Applied
                    </div>

                    <span className="font-bold">
                      {new Date(app.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>

                {/* Counter */}

                {app.status === "countered" &&
                  app.lastCounterBy === "brand" && (
                    <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon
                          icon="solar:refresh-circle-bold"
                          className="text-blue-600"
                        />

                        <span className="font-bold text-blue-700">
                          Brand Counter Offer
                        </span>
                      </div>

                      <p className="font-black text-blue-800">
                        PKR {app.lastCounterAmount?.toLocaleString()}
                      </p>

                      {app.lastCounterNote && (
                        <p className="text-sm text-blue-600 mt-2">
                          "{app.lastCounterNote}"
                        </p>
                      )}
                    </div>
                  )}

                <div className="mt-auto pt-5">
                  <div className="flex gap-3">
                    {app.status === "countered" &&
                      app.lastCounterBy === "brand" && (
                        <button
                          onClick={() => setCounterModal(app)}
                          className="flex-1 h-11 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all"
                        >
                          Respond
                        </button>
                      )}

                    {app.status === "pending" && (
                      <button
                        onClick={() => handleEditOpen(app)}
                        className="flex-1 h-11 rounded-2xl border-2 border-primary text-primary font-bold hover:bg-primary-light transition-all flex items-center justify-center gap-2"
                      >
                        <Icon icon="solar:pen-bold" />
                        Edit
                      </button>
                    )}

                    {["pending", "countered"].includes(app.status) && (
                      <button
                        onClick={() => setWithdrawModal(app)}
                        className="flex-1 h-11 rounded-2xl border-2 border-red-200 text-red-500 font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Icon icon="solar:logout-2-bold" />
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// import { useState, useEffect } from 'react'
// import DashboardLayout from '../shared/DashboardLayout'
// import axios from '../../../utils/axios'

// const creatorLinks = [
//   { to: '/creator/dashboard',      icon: '📊', label: 'Dashboard' },
//   { to: '/creator/opportunities',  icon: '🔍', label: 'Browse Opportunities' },
//   { to: '/creator/applications',   icon: '📋', label: 'My Applications' },
//   { to: '/creator/collaborations', icon: '🤝', label: 'Active Collaborations' },
//   { to: '/creator/earnings',       icon: '💰', label: 'Earnings' },
//   { to: '/creator/profile',        icon: '👤', label: 'Profile Settings' },
// ]

// const statusColors = {
//   pending:   'bg-yellow-50 text-yellow-700',
//   accepted:  'bg-green-50 text-green-700',
//   rejected:  'bg-red-50 text-red-600',
//   countered: 'bg-blue-50 text-blue-700',
//   withdrawn: 'bg-gray-100 text-gray-500',
// }

// const statusLabels = {
//   pending:   '⏳ Pending',
//   accepted:  '✅ Accepted',
//   rejected:  '❌ Rejected',
//   countered: '🔄 Counter Offer',
//   withdrawn: '↩️ Withdrawn',
// }

// export default function MyApplications() {
//   const [applications, setApplications] = useState([])
//   const [loading, setLoading]           = useState(true)
//   const [toast, setToast]               = useState('')
//   const [counterModal, setCounterModal] = useState(null)
//   const [counterAmount, setCounterAmount] = useState('')
//   const [counterNote, setCounterNote]   = useState('')

//   useEffect(() => { fetchApplications() }, [])

//   const fetchApplications = async () => {
//     try {
//       const res = await axios.get('/applications/my')
//       setApplications(res.data)
//     } catch {
//       setApplications([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const showToast = (msg) => {
//     setToast(msg)
//     setTimeout(() => setToast(''), 3000)
//   }

//   const handleWithdraw = async (id) => {
//     try {
//       await axios.delete(`/applications/${id}`)
//       setApplications(prev => prev.map(a =>
//         a._id === id ? { ...a, status: 'withdrawn' } : a
//       ))
//       showToast('Application withdrawn successfully')
//     } catch (err) {
//       showToast(err.response?.data?.message || 'Failed to withdraw')
//     }
//   }

//   const handleCreatorRespond = async (action) => {
//     if (action === 'counter' && !counterAmount) return
//     try {
//       await axios.put(`/applications/${counterModal._id}/creator-respond`, {
//         action,
//         counterAmount: Number(counterAmount),
//         note: counterNote,
//       })
//       setApplications(prev => prev.map(a =>
//         a._id === counterModal._id ? { ...a, status: action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'countered' } : a
//       ))
//       showToast(
//         action === 'accept' ? 'Counter offer accepted!'
//         : action === 'reject' ? 'Counter offer rejected'
//         : 'New counter offer sent!'
//       )
//       setCounterModal(null)
//       setCounterAmount('')
//       setCounterNote('')
//     } catch (err) {
//       showToast(err.response?.data?.message || 'Failed')
//     }
//   }

//   return (
//     <DashboardLayout links={creatorLinks}>

//       {/* Toast */}
//       {toast && (
//         <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
//           {toast}
//         </div>
//       )}

//       {/* Counter Response Modal */}
//       {counterModal && (
//         <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-purple">
//             <h3 className="font-bold text-secondary text-lg mb-1">Brand Counter Offer</h3>
//             <p className="text-sm text-muted mb-2">
//               Brand offered: <span className="font-bold text-primary">
//                 PKR {counterModal.lastCounterAmount?.toLocaleString()}
//               </span>
//             </p>
//             {counterModal.lastCounterNote && (
//               <p className="text-xs text-muted bg-surface rounded-lg px-3 py-2 mb-4">
//                 "{counterModal.lastCounterNote}"
//               </p>
//             )}

//             <div className="mb-4">
//               <label className="block text-sm font-semibold text-secondary mb-1.5">
//                 Your Counter Amount (PKR) — optional
//               </label>
//               <input
//                 type="number" placeholder="Leave empty to accept brand amount"
//                 value={counterAmount} onChange={e => setCounterAmount(e.target.value)}
//                 className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
//               />
//             </div>
//             <div className="mb-5">
//               <label className="block text-sm font-semibold text-secondary mb-1.5">Note (Optional)</label>
//               <textarea
//                 rows={2} placeholder="Add a note..."
//                 value={counterNote} onChange={e => setCounterNote(e.target.value)}
//                 className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
//               />
//             </div>

//             <div className="grid grid-cols-3 gap-2">
//               <button
//                 onClick={() => handleCreatorRespond('accept')}
//                 className="py-2.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-colors"
//               >
//                 ✓ Accept
//               </button>
//               <button
//                 onClick={() => handleCreatorRespond('counter')}
//                 className="py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-colors"
//               >
//                 Counter
//               </button>
//               <button
//                 onClick={() => handleCreatorRespond('reject')}
//                 className="py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors"
//               >
//                 ✕ Reject
//               </button>
//             </div>
//             <button
//               onClick={() => setCounterModal(null)}
//               className="w-full mt-2 py-2 text-xs text-muted hover:text-secondary transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="mb-6">
//         <h1 className="text-2xl font-black text-secondary">My Applications</h1>
//         <p className="text-muted text-sm mt-1">Track all your opportunity applications.</p>
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
//       ) : applications.length === 0 ? (
//         <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center py-16">
//           <div className="text-5xl mb-3">📋</div>
//           <p className="font-medium text-secondary">No applications yet</p>
//           <p className="text-muted text-sm mt-1">Browse opportunities and start applying!</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {applications.map(app => (
//             <div key={app._id} className="bg-card rounded-2xl border border-border shadow-card p-6 hover:border-primary transition-all">
//               <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//                 <div className="flex-1 min-w-0">

//                   {/* Title + Status */}
//                   <div className="flex items-center gap-3 flex-wrap mb-2">
//                     <h3 className="font-bold text-secondary">
//                       {app.opportunityId?.title || 'Opportunity'}
//                     </h3>
//                     <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[app.status]}`}>
//                       {statusLabels[app.status]}
//                     </span>
//                   </div>

//                   {/* Details */}
//                   <div className="flex flex-wrap gap-4 text-xs text-muted mb-3">
//                     <span>💰 Your Offer: <span className="font-bold text-primary">PKR {app.counterAmount?.toLocaleString()}</span></span>
//                     <span>📱 {app.opportunityId?.platform}</span>
//                     <span>📁 {app.opportunityId?.category}</span>
//                     <span>🕐 {new Date(app.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
//                   </div>

//                   {/* Note */}
//                   {app.note && (
//                     <p className="text-xs text-muted bg-surface rounded-lg px-3 py-2 mb-3">
//                       Your note: "{app.note}"
//                     </p>
//                   )}

//                   {/* Brand Counter */}
//                   {app.status === 'countered' && app.lastCounterBy === 'brand' && (
//                     <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-3">
//                       <p className="text-xs font-bold text-blue-700 mb-1">Brand sent a counter offer!</p>
//                       <p className="text-sm font-bold text-blue-800">
//                         PKR {app.lastCounterAmount?.toLocaleString()}
//                       </p>
//                       {app.lastCounterNote && (
//                         <p className="text-xs text-blue-600 mt-1">"{app.lastCounterNote}"</p>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-2 flex-shrink-0">
//                   {app.status === 'countered' && app.lastCounterBy === 'brand' && (
//                     <button
//                       onClick={() => setCounterModal(app)}
//                       className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors"
//                     >
//                       Respond
//                     </button>
//                   )}
//                   {app.status === 'pending' && (
//                     <button
//                       onClick={() => handleWithdraw(app._id)}
//                       className="px-4 py-2 border border-red-200 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 transition-colors"
//                     >
//                       Withdraw
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </DashboardLayout>
//   )
// }
