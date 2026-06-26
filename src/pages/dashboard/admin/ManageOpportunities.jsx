import { useState, useEffect, useMemo } from "react";
// import DashboardLayout from '../shared/DashboardLayout'
import { adminLinks } from "./AdminDashboard";
import axios from "../../../utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

const ITEMS_PER_PAGE = 10;

export default function ManageOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");
  const [confirmModal, setConfirmModal] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await axios.get("/admin/opportunities");
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

  // ✅ Admin sirf brand ki REQUEST pe close kare — confirmation modal
  const handleClose = async () => {
    if (!confirmModal) return;
    try {
      await axios.put(`/admin/opportunities/${confirmModal._id}/close`);
      setOpportunities((prev) =>
        prev.map((o) =>
          o._id === confirmModal._id ? { ...o, status: "closed" } : o,
        ),
      );
      showToast("✅ Opportunity closed");
      setConfirmModal(null);
    } catch {
      showToast("Action failed.");
    }
  };

  // ✅ Dynamic platforms from data
  const platforms = useMemo(() => {
    const all = [
      ...new Set(opportunities.map((o) => o.platform).filter(Boolean)),
    ];
    return ["all", ...all];
  }, [opportunities]);

  // ✅ Filter + Sort + Search
  const filtered = useMemo(() => {
    let data = [...opportunities];

    if (search) {
      data = data.filter(
        (o) =>
          o.title?.toLowerCase().includes(search.toLowerCase()) ||
          o.brandName?.toLowerCase().includes(search.toLowerCase()) ||
          o.category?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((o) => o.status === statusFilter);
    }

    if (platformFilter !== "all") {
      data = data.filter((o) => o.platform === platformFilter);
    }

    switch (sortBy) {
      case "newest":
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "budget_hi":
        data.sort((a, b) => b.budget - a.budget);
        break;
      case "budget_lo":
        data.sort((a, b) => a.budget - b.budget);
        break;
      case "title":
        data.sort((a, b) => a.title?.localeCompare(b.title));
        break;
    }

    return data;
  }, [opportunities, search, statusFilter, platformFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const statusColors = {
    active: "bg-green-50 text-green-700 border-green-200",
    closed: "bg-gray-100 text-gray-500 border-gray-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const stats = [
    {
      label: "Total",
      value: opportunities.length,
      icon: "solar:list-bold",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Active",
      value: opportunities.filter((o) => o.status === "active").length,
      icon: "solar:check-circle-bold",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Closed",
      value: opportunities.filter((o) => o.status === "closed").length,
      icon: "solar:close-circle-bold",
      color: "text-gray-500",
      bg: "bg-gray-100",
    },
    {
      label: "Completed",
      value: opportunities.filter((o) => o.status === "completed").length,
      icon: "solar:medal-bold",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-semibold rounded-2xl shadow-lg flex items-center gap-2">
          <Icon icon="solar:check-circle-bold" className="text-lg" />
          {toast}
        </div>
      )}

      {/* ✅ Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl shadow-purple-200 overflow-hidden"
            >
              <div className="bg-primary p-5">
                <h3 className="font-black text-white text-lg flex items-center gap-2">
                  <Icon
                    icon="solar:danger-triangle-bold"
                    className="text-2xl"
                  />
                  Close Opportunity?
                </h3>
                <p className="text-red-100 text-sm mt-1">
                  This action cannot be undone
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-800 mb-1">
                    {confirmModal.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Brand: {confirmModal.brandName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Budget: PKR {confirmModal.budget?.toLocaleString()}
                  </p>
                </div>

                {/* ✅ Warning about brand's right */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-3">
                  <Icon
                    icon="solar:info-circle-bold"
                    className="text-yellow-500 text-xl flex-shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Only close this opportunity if the
                    brand has specifically requested it, or if it violates
                    platform policies. Closing prematurely may harm the brand.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmModal(null)}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-500 rounded-2xl text-sm font-semibold hover:border-purple-400 hover:text-purple-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 bg-primary text-white rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-red-200 transition-all"
                  >
                    Yes, Close It
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">All Opportunities</h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor and manage all posted campaigns.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-4 border border-purple-50 shadow-sm flex items-center gap-3"
          >
            <div
              className={`w-10 h-10 rounded-2xl ${s.bg} flex items-center justify-center flex-shrink-0`}
            >
              <Icon icon={s.icon} className={`${s.color} text-xl`} />
            </div>
            <div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="bg-white rounded-2xl border border-purple-50 shadow-sm p-4 mb-6 space-y-3">
        {/* Search */}
        <div className="relative">
          <Icon
            icon="solar:magnifer-bold"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
          />
          <input
            type="text"
            placeholder="Search by title, brand, or category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 bg-gray-50"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Icon
              icon="solar:filter-bold"
              className="text-purple-500 text-sm"
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs font-semibold border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 bg-gray-50 text-gray-600"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-2">
            <Icon
              icon="solar:smartphone-bold"
              className="text-purple-500 text-sm"
            />
            <select
              value={platformFilter}
              onChange={(e) => {
                setPlatformFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs font-semibold border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 bg-gray-50 text-gray-600"
            >
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p === "all" ? "All Platforms" : p}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Icon icon="solar:sort-bold" className="text-purple-500 text-sm" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="text-xs font-semibold border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 bg-gray-50 text-gray-600"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="budget_hi">Budget: High → Low</option>
              <option value="budget_lo">Budget: Low → High</option>
              <option value="title">Title A → Z</option>
            </select>
          </div>

          {/* Results count */}
          <span className="ml-auto text-xs text-gray-400">
            {filtered.length} results
          </span>

          {/* Reset filters */}
          {(search ||
            statusFilter !== "all" ||
            platformFilter !== "all" ||
            sortBy !== "newest") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setPlatformFilter("all");
                setSortBy("newest");
                setPage(1);
              }}
              className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
            >
              <Icon icon="solar:close-circle-bold" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-purple-50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-gray-50 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Icon
                icon="solar:magnifer-bold"
                className="text-3xl text-purple-300"
              />
            </div>
            <p className="font-bold text-gray-700">No opportunities found</p>
            <p className="text-gray-400 text-sm mt-1">Try different filters</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-purple-50/50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-purple-50">
              <div className="col-span-4">Title / Category</div>
              <div className="col-span-2">Brand</div>
              <div className="col-span-1 text-right">Budget</div>
              <div className="col-span-2">Platform</div>
              <div className="col-span-1">Deadline</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            <div className="divide-y divide-purple-50">
              {paginated.map((op, i) => (
                <motion.div
                  key={op._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-purple-50/30 transition-colors items-center"
                >
                  <div className="md:col-span-4">
                    <p className="text-sm font-bold text-gray-800 line-clamp-1">
                      {op.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {op.category}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 font-medium">
                      {op.brandName}
                    </p>
                  </div>
                  <div className="md:col-span-1 text-right">
                    <span className="text-sm font-black text-purple-700">
                      {op.budget >= 1000
                        ? `${(op.budget / 1000).toFixed(0)}K`
                        : op.budget}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg font-medium">
                      {op.platform}
                    </span>
                  </div>
                  <div className="md:col-span-1">
                    <span
                      className={`text-xs font-semibold ${op.deadline <= 3 ? "text-red-600" : "text-gray-500"}`}
                    >
                      {op.deadline}d
                    </span>
                  </div>
                  <div className="md:col-span-1">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColors[op.status] || "bg-gray-100 text-gray-500"}`}
                    >
                      {op.status}
                    </span>
                  </div>
                  <div className="md:col-span-1 flex justify-center">
                    {/* ✅ Only show Close for active — with confirmation */}
                    {op.status === "active" && (
                      <button
                        onClick={() => setConfirmModal(op)}
                        className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-1"
                      >
                        <Icon
                          icon="solar:close-circle-bold"
                          className="text-sm"
                        />
                        Close
                      </button>
                    )}
                    {op.status === "closed" && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Icon icon="solar:lock-bold" className="text-sm" />
                        Closed
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ✅ Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-purple-50 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Page {page} of {totalPages} · {filtered.length} total
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-600 disabled:opacity-40 transition-colors"
                  >
                    <Icon icon="solar:arrow-left-bold" className="text-sm" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                    )
                    .map((p, idx, arr) => (
                      <>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span
                            key={`dots-${p}`}
                            className="w-8 h-8 flex items-center justify-center text-gray-300 text-xs"
                          >
                            ...
                          </span>
                        )}
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                            page === p
                              ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-200"
                              : "border border-gray-200 text-gray-500 hover:border-purple-400 hover:text-purple-600"
                          }`}
                        >
                          {p}
                        </button>
                      </>
                    ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-600 disabled:opacity-40 transition-colors"
                  >
                    <Icon icon="solar:arrow-right-bold" className="text-sm" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
