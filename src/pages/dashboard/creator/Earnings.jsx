import { useState, useEffect } from "react";
// import DashboardLayout from "../shared/DashboardLayout";
// import { creatorLinks } from './CreatorDashboard'
// import { creatorLinks } from "../dashboardLinks";
import { Icon } from "@iconify/react";
import axios from "../../../utils/axios";

const statusColors = {
  pending: "bg-gray-100 text-gray-600",
  screenshot_uploaded: "bg-yellow-50 text-yellow-700",
  verified: "bg-blue-50 text-blue-700",
  released: "bg-green-50 text-green-700",
  refunded: "bg-red-50 text-red-600",
};

const statusLabels = {
  pending: "Pending",
  screenshot_uploaded: "Verification Pending",
  verified: "Verified",
  released: "Released",
  refunded: "Refunded",
};
const statusIcons = {
  pending: "solar:clock-circle-bold",
  screenshot_uploaded: "solar:gallery-bold",
  verified: "solar:verified-check-bold",
  released: "solar:wallet-money-bold",
  refunded: "solar:refresh-circle-bold",
};
export default function Earnings() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("/payments/creator");
      setPayments(res.data);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const totalEarned = payments
    .filter((p) => p.status === "released")
    .reduce((a, p) => a + (p.creatorAmount || 0), 0);
  const totalPending = payments
    .filter((p) => p.status === "verified")
    .reduce((a, p) => a + (p.creatorAmount || 0), 0);
  const totalCommission = payments.reduce(
    (a, p) => a + (p.platformCommission || 0),
    0,
  );
  const thisMonth = payments
    .filter((p) => {
      const d = new Date(p.createdAt);
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear() &&
        p.status === "released"
      );
    })
    .reduce((a, p) => a + (p.creatorAmount || 0), 0);

  return (
    <>
      <div className="mb-8 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-purple-200">
          <Icon
            icon="solar:wallet-money-bold"
            className="text-white text-3xl"
          />
        </div>

        <div>
          <h1 className="text-4xl font-black text-secondary">Earnings</h1>

          <p className="text-muted text-lg mt-1">
            Track your income and payment history.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Earned",
            value: `PKR ${totalEarned.toLocaleString()}`,
            icon: "solar:wallet-money-bold",
            color: "bg-green-50 text-green-700",
          },
          {
            label: "This Month",
            value: `PKR ${thisMonth.toLocaleString()}`,
            icon: "solar:calendar-bold",
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "Pending Release",
            value: `PKR ${totalPending.toLocaleString()}`,
            icon: "solar:clock-circle-bold",
            color: "bg-yellow-50 text-yellow-700",
          },
          {
            label: "Commission Paid",
            value: `PKR ${totalCommission.toLocaleString()}`,
            icon: "solar:chart-square-bold",
            color: "bg-purple-50 text-primary",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-[30px] p-6 border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-purple-100 hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${s.color}`}
            >
              <Icon icon={s.icon} className="text-2xl" />
            </div>
            <div className="text-xl font-black text-secondary">{s.value}</div>
            <div className="text-xs text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-[32px] border border-purple-100 shadow-sm p-7">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
              <Icon
                icon="solar:card-transfer-bold"
                className="text-2xl text-primary"
              />
            </div>

            <div>
              <h2 className="text-2xl font-black text-secondary">
                Payment History
              </h2>

              <p className="text-sm text-muted">All creator payouts</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <Icon
                icon="solar:wallet-money-bold"
                className="text-5xl text-primary"
              />
            </div>
            <p className="font-medium text-secondary">No payments yet</p>
            <p className="text-muted text-sm mt-1">
              Complete collaborations to earn money.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {payments.map((p) => (
              <div
                key={p._id}
                className="
      bg-white
      rounded-[30px]
      border
      border-purple-100
      shadow-sm
      hover:shadow-xl
      hover:shadow-purple-100
      hover:-translate-y-1
      transition-all
      duration-300
      overflow-hidden
    "
              >
                <div className="p-6">
                  {/* Top */}

                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-secondary leading-tight">
                        {p.collaborationId?.opportunityId?.title ||
                          "Collaboration Payment"}
                      </h3>

                      <p className="text-sm text-muted mt-2">
                        {p.brandId?.brandName || p.brandId?.fullName}
                      </p>
                    </div>

                    <span
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusColors[p.status]}`}
                    >
                      <Icon icon={statusIcons[p.status]} className="text-sm" />

                      {statusLabels[p.status]}
                    </span>
                  </div>

                  {/* Grid */}

                  <div className="grid grid-cols-2 gap-5 mb-6">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Icon
                          icon="solar:wallet-money-bold"
                          className="text-green-500"
                        />
                        Creator Earned
                      </div>

                      <p className="font-black text-primary mt-1">
                        PKR {p.creatorAmount?.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Icon
                          icon="solar:chart-square-bold"
                          className="text-violet-500"
                        />
                        Commission
                      </div>

                      <p className="font-bold mt-1">
                        PKR {p.platformCommission?.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Icon
                          icon="solar:calendar-bold"
                          className="text-blue-500"
                        />
                        Date
                      </div>

                      <p className="font-bold mt-1">
                        {new Date(p.createdAt).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Icon
                          icon="solar:user-bold"
                          className="text-orange-500"
                        />
                        Brand
                      </div>

                      <p className="font-bold mt-1 truncate">
                        {p.brandId?.brandName || p.brandId?.fullName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
