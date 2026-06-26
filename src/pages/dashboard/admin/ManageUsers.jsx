import { useState, useEffect } from "react";
// import DashboardLayout from '../shared/DashboardLayout'
import { adminLinks } from "./AdminDashboard";
import axios from "../../../utils/axios";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
const roleColors = {
  creator: "bg-blue-50 text-blue-700",
  brand: "bg-yellow-50 text-yellow-700",
  admin: "bg-purple-50 text-primary",
};

const avatarColors = [
  "from-purple-400 to-purple-700",
  "from-blue-400 to-blue-700",
  "from-green-400 to-green-700",
  "from-pink-400 to-pink-700",
];

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState("");
  const [banModal, setBanModal] = useState(null);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleBan = async (userId, isBanned) => {
    try {
      await axios.put(`/admin/users/${userId}/ban`, { isBanned: !isBanned });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: !isBanned } : u)),
      );
      showToast(
        isBanned ? "User unbanned successfully" : "User banned successfully",
      );
    } catch {
      showToast("Action failed. Please try again.");
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.role === filter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">All Users</h1>
        <p className="text-muted text-sm mt-1">
          Manage creators, brands, and admins.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-white"
        />
        <div className="flex gap-2">
          {["all", "creator", "brand", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg capitalize transition-colors ${
                filter === r
                  ? "bg-primary text-white"
                  : "bg-white border border-border text-muted hover:border-primary hover:text-primary"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-gray-200" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">👥</div>
            <p className="font-medium text-secondary">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-surface text-xs font-bold text-muted uppercase tracking-wide">
              <div className="col-span-4">User</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-3">Joined</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Action</div>
            </div>

            {filtered.map((u, i) => (
              <div
                key={u._id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-surface transition-colors items-center"
              >
                {/* User */}
                <div className="md:col-span-4 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                  >
                    {u.fullName?.[0] || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-secondary truncate">
                      {u.fullName}
                    </p>
                    <p className="text-xs text-muted truncate">{u.email}</p>
                  </div>
                </div>

                {/* Role */}
                <div className="md:col-span-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${roleColors[u.role]}`}
                  >
                    {u.role}
                  </span>
                </div>

                {/* Joined */}
                <div className="md:col-span-3 text-xs text-muted">
                  {new Date(u.createdAt).toLocaleDateString("en-PK", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      u.isBanned
                        ? "bg-red-50 text-red-600"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {u.isBanned ? "Banned" : "Active"}
                  </span>
                </div>

                {/* Action */}
                <div className="md:col-span-1">
                  {u.role !== "admin" && (
                    <button
                      onClick={() => setBanModal(u)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        u.isBanned
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      {u.isBanned ? "Unban" : "Ban"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 🚫 Ban / Unban Confirmation */}
      <AnimatePresence>
        {banModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-purple-200">
              {/* Header */}

              <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <Icon
                      icon={
                        banModal.isBanned
                          ? "solar:user-check-bold"
                          : "solar:user-block-bold"
                      }
                      className="text-white text-2xl"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">
                      {banModal.isBanned ? "Unban User" : "Ban User"}
                    </h3>

                    <p className="text-sm text-purple-100 mt-1">
                      Please review before continuing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}

              <div className="p-6 space-y-4">
                {/* User Info */}

                <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4">
                  <p className="text-sm font-bold text-secondary">
                    {banModal.fullName}
                  </p>

                  <p className="text-xs text-muted mt-1">{banModal.email}</p>

                  <p className="text-xs text-primary font-semibold mt-2 capitalize">
                    {banModal.role}
                  </p>
                </div>

                {/* Note */}

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-3">
                  <Icon
                    icon="solar:info-circle-bold"
                    className="text-yellow-500 text-xl flex-shrink-0 mt-0.5"
                  />

                  <p className="text-xs text-yellow-800 leading-6">
                    <strong>Note:</strong>{" "}
                    {banModal.isBanned
                      ? "Unbanning will immediately restore this user's access to Trendora."
                      : "Only ban this user if they have violated platform rules or abused the system. Banned users cannot access their account until manually restored."}
                  </p>
                </div>

                {/* Important Notice */}

                {/* <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      icon="solar:danger-triangle-bold"
                      className="text-red-500"
                    />

                    <span className="font-bold text-red-600">
                      Important Notice
                    </span>
                  </div>

                  <p className="text-xs text-red-600 leading-6">
                    {banModal.isBanned
                      ? "The user will regain access immediately after confirmation."
                      : "The user won't be able to log in until the account is manually unbanned by an administrator."}
                  </p>
                </div> */}

                {/* Buttons */}

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setBanModal(null)}
                    className="flex-1 py-3 rounded-2xl border border-border bg-white font-bold text-secondary hover:border-purple-400 hover:text-purple-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Icon icon="solar:close-circle-linear" />
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      handleBan(banModal._id, banModal.isBanned);
                      setBanModal(null);
                    }}
                    className={`flex-1 py-3 rounded-2xl text-white font-bold transition-all flex items-center justify-center gap-2 ${
                      banModal.isBanned
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gradient-to-r from-purple-600 to-violet-600 hover:shadow-lg hover:shadow-purple-300/30"
                    }`}
                  >
                    <Icon
                      icon={
                        banModal.isBanned
                          ? "solar:user-check-bold"
                          : "solar:user-block-bold"
                      }
                    />

                    {banModal.isBanned ? "Unban User" : "Ban User"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
