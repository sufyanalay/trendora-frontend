import { useState } from "react";
// import DashboardLayout from '../shared/DashboardLayout'
import { brandLinks } from "./BrandDashboard";
import { useAuth } from "../../../context/AuthContext";
import axios from "../../../utils/axios";

export default function BrandProfile() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    brandName: user?.brandName || "",
    websiteUrl: user?.websiteUrl || "",
    brandAddress: user?.brandAddress || "",
    jazzCashNumber: user?.jazzCashNumber || "",
  });

  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");

  const update = (f, v) => setForm((p) => ({ ...p, [f]: v }));
  const updatePass = (f, v) => setPassForm((p) => ({ ...p, [f]: v }));

  const showToast = (msg, type = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(""), 3000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/auth/profile", form);
      showToast("✅ Profile updated successfully!");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword)
      return showToast("Passwords do not match", "error");
    if (passForm.newPassword.length < 6)
      return showToast("Minimum 6 characters", "error");
    setPassLoading(true);
    try {
      await axios.put("/auth/change-password", {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      showToast("✅ Password changed!");
      setPassForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      showToast(err.response?.data?.message || "Failed", "error");
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 text-white text-sm font-semibold rounded-xl shadow-purple ${
            toastType === "error" ? "bg-red-500" : "bg-primary"
          }`}
        >
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">Profile Settings</h1>
        <p className="text-muted text-sm mt-1">
          Manage your brand profile and account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brand Card */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-black text-3xl mx-auto mb-4">
              {user?.brandName?.[0] || user?.fullName?.[0] || "B"}
            </div>
            <h3 className="font-bold text-secondary text-lg">
              {user?.brandName || user?.fullName}
            </h3>
            <p className="text-sm text-muted mt-1">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full">
              Brand
            </span>

            <div className="mt-5 pt-5 border-t border-border space-y-2 text-left">
              {user?.websiteUrl && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span>🌐</span>
                  <a
                    href={user.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {user.websiteUrl}
                  </a>
                </div>
              )}
              {user?.brandAddress && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span>📍</span>
                  <span>{user.brandAddress}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Brand Info */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <h2 className="font-bold text-secondary mb-5">Brand Information</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl bg-surface text-muted cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your brand name"
                    value={form.brandName}
                    onChange={(e) => update("brandName", e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    Website URL
                  </label>
                  <input
                    type="text"
                    placeholder="yourwebsite.com"
                    value={form.websiteUrl}
                    onChange={(e) => update("websiteUrl", e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Brand Address
                </label>
                <input
                  type="text"
                  placeholder="Brand address"
                  value={form.brandAddress}
                  onChange={(e) => update("brandAddress", e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>

              {/* Payment */}
              <div className="pt-4 border-t border-border">
                <h3 className="font-bold text-secondary mb-3 text-sm">
                  Payment Information
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    JazzCash Number
                  </label>
                  <input
                    type="text"
                    placeholder="03XX-XXXXXXX"
                    value={form.jazzCashNumber}
                    onChange={(e) => update("jazzCashNumber", e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors text-sm disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <h2 className="font-bold text-secondary mb-5">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Current password"
                  value={passForm.currentPassword}
                  onChange={(e) =>
                    updatePass("currentPassword", e.target.value)
                  }
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="New password"
                    value={passForm.newPassword}
                    onChange={(e) => updatePass("newPassword", e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={passForm.confirmPassword}
                    onChange={(e) =>
                      updatePass("confirmPassword", e.target.value)
                    }
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={passLoading}
                className="w-full py-3 bg-secondary hover:bg-gray-800 text-white font-bold rounded-xl transition-colors text-sm disabled:opacity-60"
              >
                {passLoading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
