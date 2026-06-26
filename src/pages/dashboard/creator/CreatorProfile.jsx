import { useState, useEffect } from "react";
// import DashboardLayout from "../shared/DashboardLayout";
// import { creatorLinks } from './CreatorDashboard'
// import { creatorLinks } from "../dashboardLinks";
import { Icon } from "@iconify/react";

import { useAuth } from "../../../context/AuthContext";
import axios from "../../../utils/axios";

export default function CreatorProfile() {
  const { user, login } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [myReviews, setMyReviews] = useState({
    reviews: [],
    avgRating: 0,
    total: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/reviews/my");
      setMyReviews(res.data);
    } catch {}
  };

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    socialPlatform: user?.socialPlatform || "",
    socialProfileUrl: user?.socialProfileUrl || "",
    address: user?.address || "",
    jazzCashNumber: user?.jazzCashNumber || "",
    easypaisaNumber: user?.easypaisaNumber || "",
    bankName: user?.bankName || "",
    bankAccountNumber: user?.bankAccountNumber || "",
    bankAccountTitle: user?.bankAccountTitle || "",
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

  const update = (field, val) => setForm((prev) => ({ ...prev, [field]: val }));
  const updatePass = (field, val) =>
    setPassForm((prev) => ({ ...prev, [field]: val }));

  const showToast = (msg, type = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(""), 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/auth/profile", form);
      showToast("✅ Profile updated successfully!");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update profile",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return showToast("Passwords do not match", "error");
    }
    if (passForm.newPassword.length < 6) {
      return showToast("Password must be at least 6 characters", "error");
    }
    setPassLoading(true);
    try {
      await axios.put("/auth/change-password", {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      showToast("✅ Password changed successfully!");
      setPassForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to change password",
        "error",
      );
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 text-white text-sm font-semibold rounded-xl shadow-purple ${
            toastType === "error" ? "bg-red-500" : "bg-primary"
          }`}
        >
          {toast}
        </div>
      )}

      <div className="mb-7 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-purple-600 to-violet-600 shadow-lg shadow-purple-200">
          <Icon icon="solar:user-id-bold" className="text-[32px] text-white" />
        </div>

        <div>
          <h1 className="text-[30px] font-black leading-none text-secondary">
            Profile Settings
          </h1>

          <p className="mt-2 text-[17px] text-muted">
            Update your personal and payment information.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center">
            <div className="relative mx-auto mb-5 w-fit">
              <div className="flex h-28 w-28 items-center justify-center rounded-[32px] bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 text-5xl font-black text-white shadow-[0_20px_50px_rgba(124,58,237,.35)]">
                {user?.fullName?.[0] || "C"}
              </div>

              <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-green-500 shadow-lg">
                <Icon
                  icon="solar:verified-check-bold"
                  className="text-lg text-white"
                />
              </div>
            </div>
            <h3 className="text-[30px] font-black text-secondary">
              {user?.fullName}
            </h3>
            <p className="mt-2 flex items-center justify-center gap-2 text-[15px] text-muted">
              <Icon icon="solar:letter-bold" className="text-primary" />
              {user?.email}
            </p>
            <span className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-full bg-purple-50 text-primary font-bold text-sm border border-purple-100">
              <>
                <Icon icon="solar:user-rounded-bold" className="text-base" />

                {user?.role}
              </>
            </span>

            <div className="mt-5 pt-5 border-t border-purple-100 space-y-2 text-left">
              {user?.socialPlatform && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span>
                    <Icon
                      icon="solar:user-circle-bold"
                      className="text-xl text-primary"
                    />
                  </span>
                  <span>{user.socialPlatform}</span>
                </div>
              )}
              {user?.socialProfileUrl && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span>
                    <Icon
                      icon="solar:link-bold"
                      className="text-xl text-primary"
                    />
                  </span>
                  <a
                    href={user.socialProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    Profile Link
                  </a>
                </div>
              )}
              {user?.address && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span>
                    <Icon
                      icon="solar:map-point-bold"
                      className="text-xl text-primary"
                    />
                  </span>
                  <span>{user.address}</span>
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="mt-4 pt-4 border-t border-purple-100 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Icon
                    key={s}
                    icon="solar:star-bold"
                    className={`text-xl ${
                      s <= Math.round(myReviews.avgRating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xl font-black text-secondary">
                {myReviews.avgRating} / 5
              </p>
              <p className="text-xs text-muted">{myReviews.total} reviews</p>
            </div>

            {/* Reviews List */}
            {myReviews.reviews.length > 0 && (
              <div className="mt-4 pt-4 border-t border-purple-100">
                <h4 className="text-sm font-bold text-secondary mb-3">
                  Recent Reviews
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {myReviews.reviews.map((r) => (
                    <div key={r._id} className="bg-surface rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-secondary">
                          {r.brandId?.brandName || r.brandId?.fullName}
                        </p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              className={`text-sm ${s <= r.rating ? "text-yellow-400" : "text-gray-300"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted">{r.review}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Forms — col-span-2 */}
        <div className="lg:col-span-2 space-y-6">
          {/* ── Personal Info + Payment ── */}
          <div className="bg-white rounded-[32px] border border-purple-100 shadow-[0_20px_60px_rgba(124,58,237,.08)] p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Icon
                  icon="solar:user-id-bold"
                  className="text-2xl text-primary"
                />
              </div>

              <div>
                <h2 className="text-2xl font-black text-secondary">
                  Personal Information
                </h2>

                <p className="text-sm text-muted">
                  Update your profile information.
                </p>
              </div>
            </div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-2">
                    <Icon icon="solar:user-bold" className="text-primary" />
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
                  <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-2">
                    <Icon icon="solar:letter-bold" className="text-primary" />
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
                  <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-2">
                    <Icon
                      icon="solar:user-circle-bold"
                      className="text-primary"
                    />
                    Social Account
                  </label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={form.socialPlatform}
                    onChange={(e) => update("socialPlatform", e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-2">
                    <Icon icon="solar:link-bold" className="text-primary" />
                    Profile URL
                  </label>
                  <input
                    type="text"
                    placeholder="instagram.com/username"
                    value={form.socialProfileUrl}
                    onChange={(e) => update("socialProfileUrl", e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-2">
                  <Icon icon="solar:map-point-bold" className="text-primary" />
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Your address"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>

              {/* Payment Info */}
              <div className="pt-4 border-t border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center">
                    <Icon
                      icon="solar:wallet-money-bold"
                      className="text-2xl text-green-600"
                    />
                  </div>

                  <div>
                    <h3 className="font-black text-xl text-secondary">
                      Payment Information
                    </h3>

                    <p className="text-sm text-muted">
                      Admin will use these details after approval.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* JazzCash / Easypaisa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary mb-1.5">
                        JazzCash Number
                      </label>
                      <input
                        type="text"
                        placeholder="03XX-XXXXXXX"
                        value={form.jazzCashNumber}
                        onChange={(e) =>
                          update("jazzCashNumber", e.target.value)
                        }
                        className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary mb-1.5">
                        Easypaisa Number
                      </label>
                      <input
                        type="text"
                        placeholder="03XX-XXXXXXX"
                        value={form.easypaisaNumber}
                        onChange={(e) =>
                          update("easypaisaNumber", e.target.value)
                        }
                        className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                  </div>

                  {/* Bank */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1.5">
                      Bank Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HBL, UBL, Meezan"
                      value={form.bankName}
                      onChange={(e) => update("bankName", e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary mb-1.5">
                        Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="Bank account number"
                        value={form.bankAccountNumber}
                        onChange={(e) =>
                          update("bankAccountNumber", e.target.value)
                        }
                        className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary mb-1.5">
                        Account Title
                      </label>
                      <input
                        type="text"
                        placeholder="Account holder name"
                        value={form.bankAccountTitle}
                        onChange={(e) =>
                          update("bankAccountTitle", e.target.value)
                        }
                        className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Profile Button */}
              <button
                type="submit"
                disabled={loading}
                className="
    w-full
    h-14
    rounded-2xl
    bg-gradient-to-r
    from-purple-600
    to-violet-600
    text-white
    font-black
    text-base
    transition-all
    hover:-translate-y-0.5
    hover:shadow-xl
    hover:shadow-purple-300/30
    disabled:opacity-60
  "
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Icon icon="solar:diskette-bold" className="text-xl" />
                    <span>Save Changes</span>
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* ── Change Password ── */}
          <div className="bg-white rounded-[32px] border border-purple-100 shadow-[0_20px_60px_rgba(124,58,237,.08)] p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                <Icon
                  icon="solar:lock-password-bold"
                  className="text-2xl text-red-500"
                />
              </div>

              <div>
                <h2 className="text-2xl font-black text-secondary">
                  Change Password
                </h2>

                <p className="text-sm text-muted">
                  Keep your account secure with a strong password.
                </p>
              </div>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-2">
                  <Icon icon="solar:key-bold" className="text-primary" />
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={passForm.currentPassword}
                    onChange={(e) =>
                      updatePass("currentPassword", e.target.value)
                    }
                    className="
      w-full
      h-14
      rounded-2xl
      border
      border-purple-100
      bg-white
      px-5
      pr-14
      text-sm
      font-medium
      transition-all
      focus:outline-none
      focus:border-primary
      focus:ring-4
      focus:ring-purple-100
    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition"
                  >
                    <Icon
                      icon={
                        showCurrentPassword
                          ? "mdi:eye-off-outline"
                          : "mdi:eye-outline"
                      }
                      className="text-[22px]"
                    />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-2">
                    <Icon
                      icon="solar:lock-password-bold"
                      className="text-primary"
                    />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New password"
                      value={passForm.newPassword}
                      onChange={(e) =>
                        updatePass("newPassword", e.target.value)
                      }
                      className="
      w-full
      h-14
      rounded-2xl
      border
      border-purple-100
      bg-white
      px-5
      pr-14
      text-sm
      font-medium
      transition-all
      focus:outline-none
      focus:border-primary
      focus:ring-4
      focus:ring-purple-100
    "
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition"
                    >
                      <Icon
                        icon={
                          showNewPassword
                            ? "mdi:eye-off-outline"
                            : "mdi:eye-outline"
                        }
                        className="text-[22px]"
                      />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-2">
                    <Icon
                      icon="solar:shield-check-bold"
                      className="text-primary"
                    />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={passForm.confirmPassword}
                      onChange={(e) =>
                        updatePass("confirmPassword", e.target.value)
                      }
                      className="
      w-full
      h-14
      rounded-2xl
      border
      border-purple-100
      bg-white
      px-5
      pr-14
      text-sm
      font-medium
      transition-all
      focus:outline-none
      focus:border-primary
      focus:ring-4
      focus:ring-purple-100
    "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition"
                    >
                      <Icon
                        icon={
                          showConfirmPassword
                            ? "mdi:eye-off-outline"
                            : "mdi:eye-outline"
                        }
                        className="text-[22px]"
                      />
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={passLoading}
                className="
flex
items-center
justify-center
gap-2
w-full
h-14
rounded-2xl
bg-gradient-to-r
from-purple-600
to-violet-600
text-white
font-bold
transition-all
duration-300
hover:-translate-y-0.5
hover:shadow-lg
hover:shadow-purple-300/30
disabled:opacity-60
disabled:cursor-not-allowed
"
              >
                {passLoading ? (
                  <>
                    <Icon
                      icon="svg-spinners:90-ring-with-bg"
                      className="text-xl"
                    />
                    Changing...
                  </>
                ) : (
                  <>
                    <Icon icon="solar:lock-password-bold" className="text-xl" />
                    Change Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        {/* end lg:col-span-2 */}
      </div>
      {/* end grid */}
    </>
  );
}
