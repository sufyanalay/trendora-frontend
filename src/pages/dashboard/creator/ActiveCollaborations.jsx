import { useState, useEffect, useRef } from "react";
// import DashboardLayout from "../shared/DashboardLayout";
// import { creatorLinks } from './CreatorDashboard'
// import { creatorLinks } from "../dashboardLinks";
import { Icon } from "@iconify/react";
import axios from "../../../utils/axios";
import socket from "../../../utils/socket";
import { useAuth } from "../../../context/AuthContext";

const statusColors = {
  payment_pending: "bg-gray-100 text-gray-600",
  active: "bg-blue-50 text-blue-700",
  submitted: "bg-yellow-50 text-yellow-700",
  completed: "bg-green-50 text-green-700",
  revision: "bg-orange-50 text-orange-700",
  cancelled: "bg-red-50 text-red-600",
  disputed: "bg-red-50 text-red-600",
};

export default function ActiveCollaborations() {
  const { user } = useAuth();
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [submitModal, setSubmitModal] = useState(null);
  const [workLink, setWorkLink] = useState("");
  const [disputeModal, setDisputeModal] = useState(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [toast, setToast] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchCollaborations();

    // ✅ Notification aaye to refresh karo
    socket.on("new_notification", () => {
      fetchCollaborations();
    });

    // ✅ Collaboration update — full refetch for latest data
    socket.on("collaboration_updated", (data) => {
      console.log("collaboration_updated received:", data);
      // Full refetch to ensure we have the latest data
      fetchCollaborations();
    });

    return () => {
      socket.off("new_notification");
      socket.off("collaboration_updated");
    };
  }, []);
  // ─── Selected Change ─────────────────────────────
  useEffect(() => {
    if (!selected) return;

    if (selected.chatUnlocked) {
      fetchMessages(selected._id);
    }

    socket.emit("join_collaboration", selected._id);

    // ✅ Remove old listener pehle
    socket.off("new_message");
    socket.on("new_message", (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id?.toString() === msg._id?.toString()))
          return prev;
        return [...prev, msg];
      });
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    });

    return () => {
      socket.off("new_message");
    };
  }, [selected?._id]); // ← selected._id pe depend karo, pura object nahi
  // ─── Auto Scroll ─────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchCollaborations = async () => {
    try {
      const res = await axios.get("/collaborations/creator");
      setCollaborations(res.data);
    } catch {
      setCollaborations([]);
    } finally {
      setLoading(false);
    }
  };

  // const fetchMessages = async (id) => {
  //   try {
  //     // ✅ Join collaboration room first
  //     await axios.post(`/messages/${id}/join`)

  //     // ✅ Fetch messages with pagination (page 1, 50 messages)
  //     const res = await axios.get(`/messages/${id}?page=1&limit=50`)
  //     setMessages(res.data.messages || res.data)
  //   } catch (err) {
  //     console.error('fetchMessages error:', err.message)
  //     setMessages([])
  //   }
  // }

  const fetchMessages = async (id) => {
    try {
      // ✅ Sirf ek call — no join needed
      const res = await axios.get(`/messages/${id}`);
      setMessages(Array.isArray(res.data) ? res.data : res.data.messages || []);
    } catch (err) {
      console.error("fetchMessages error:", err);
      setMessages([]);
    }
  };
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSelectCollaboration = (c) => {
    if (selected && selected._id !== c._id) {
      socket.emit("leave_collaboration", selected._id);
      socket.off("new_message");
    }
    setSelected(c);
    setMessages([]);
  };

  const handleSendMsg = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const msgText = newMsg;
    setNewMsg("");
    try {
      await axios.post(`/messages/${selected._id}`, { message: msgText });
      // Socket se message aayega — manually add mat karo
    } catch (err) {
      setNewMsg(msgText);
      showToast(err.response?.data?.message || "Failed to send message");
    }
  };
  const [deleteModal, setDeleteModal] = useState(null);
  const handleSubmitWork = async () => {
    if (!workLink.trim()) return;
    try {
      await axios.put(`/collaborations/${submitModal._id}/submit`, {
        submittedWork: workLink,
      });
      setCollaborations((prev) =>
        prev.map((c) =>
          c._id === submitModal._id ? { ...c, status: "submitted" } : c,
        ),
      );
      if (selected?._id === submitModal._id) {
        setSelected((prev) => ({ ...prev, status: "submitted" }));
      }
      showToast("✅ Work submitted successfully!");
      setSubmitModal(null);
      setWorkLink("");
    } catch {
      showToast("Failed to submit work");
    }
  };

  const handleDeleteCollaboration = async (id) => {
    try {
      await axios.delete(`/collaborations/${id}`);
      setCollaborations((prev) => prev.filter((c) => c._id !== id));
      if (selected?._id === id) {
        setSelected(null);
      }
      showToast("✅ Collaboration cancelled");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to cancel");
    }
  };

  const handleRaiseDispute = (c) => {
    setDisputeModal(c);
  };

  const handleDisputeSubmit = async () => {
    if (!disputeReason.trim()) return showToast("Please explain the issue");
    try {
      await axios.post("/disputes", {
        collaborationId: disputeModal._id,
        reason: disputeReason,
      });
      showToast("⚖️ Dispute filed. Admin will review shortly.");
      setDisputeModal(null);
      setDisputeReason("");
      fetchCollaborations();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to file dispute");
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          <div className="flex items-center gap-2">
            <Icon icon="solar:check-circle-bold" />
            {toast}
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg overflow-hidden rounded-[32px] border border-purple-100 bg-white shadow-[0_25px_80px_rgba(124,58,237,0.18)]">
            {/* Header */}

            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 px-7 py-6">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

              <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                  <Icon
                    icon="solar:trash-bin-trash-bold"
                    className="text-3xl text-white"
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white">
                    Delete Collaboration
                  </h2>

                  <p className="mt-1 text-sm text-purple-100">
                    Please review before continuing.
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}

            <div className="p-7">
              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    icon="solar:info-circle-bold"
                    className="text-primary"
                  />

                  <span className="font-bold text-secondary">
                    Are you sure?
                  </span>
                </div>

                <p className="text-muted leading-7 text-sm">
                  This collaboration will be permanently deleted and cannot be
                  recovered later.
                </p>
              </div>

              <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    icon="solar:danger-triangle-bold"
                    className="text-red-500"
                  />

                  <span className="font-bold text-red-600">
                    Important Notice
                  </span>
                </div>

                <p className="text-sm leading-7 text-red-500">
                  All collaboration data and related information will be removed
                  permanently.
                </p>
              </div>

              <div className="mt-7 flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="
            flex
            flex-1
            items-center
            justify-center
            gap-2
            h-12
            rounded-2xl
            border
            border-purple-100
            font-semibold
            text-secondary
            hover:bg-purple-50
            hover:border-primary
            transition-all
          "
                >
                  <Icon icon="solar:close-circle-linear" className="text-lg" />
                  Cancel
                </button>

                <button
                  onClick={() => {
                    handleDeleteCollaboration(deleteModal._id);
                    setDeleteModal(null);
                  }}
                  className="
            flex
            flex-1
            items-center
            justify-center
            gap-2
            h-12
            rounded-2xl
            bg-gradient-to-r
            from-purple-600
            to-violet-600
            text-white
            font-bold
            hover:-translate-y-0.5
            hover:shadow-lg
            hover:shadow-purple-300/30
            transition-all
          "
                >
                  <Icon icon="solar:trash-bin-trash-bold" className="text-lg" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Submit Work Modal */}
      {submitModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-purple">
            <h3 className="font-bold text-secondary text-lg mb-1">
              Submit Work
            </h3>
            <p className="text-sm text-muted mb-5">
              for: {submitModal.opportunityId?.title}
            </p>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-secondary mb-1.5">
                Work Link / Description
              </label>
              <textarea
                rows={4}
                placeholder="Paste your work link (Google Drive, YouTube, etc.) or describe the work done..."
                value={workLink}
                onChange={(e) => setWorkLink(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSubmitModal(null)}
                className="flex-1 py-2.5 border-2 border-border text-muted rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitWork}
                className="flex flex-1 items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
              >
                <Icon icon="solar:upload-bold" className="text-lg" />
                <span>Submit Work</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⚖️ Dispute Modal */}

      {disputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg overflow-hidden rounded-[32px] border border-purple-100 bg-white shadow-[0_25px_80px_rgba(124,58,237,0.18)]">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 px-7 py-6">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

              <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                  <Icon
                    icon="solar:danger-bold"
                    className="text-3xl text-white"
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white">
                    Raise Dispute
                  </h2>

                  <p className="mt-1 text-sm text-purple-100">
                    Please explain the issue clearly.
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-7">
              <div className="mb-5 rounded-2xl bg-purple-50 border border-purple-100 p-5">
                <p className="font-bold text-secondary mb-2">Opportunity</p>

                <p className="text-sm text-muted leading-6">
                  {disputeModal.opportunityId?.title}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Reason
                </label>

                <textarea
                  rows={5}
                  placeholder="Explain the issue clearly. Admin will review your dispute and make a fair decision..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="
              w-full
              rounded-2xl
              border
              border-purple-100
              px-5
              py-4
              text-sm
              resize-none
              focus:outline-none
              focus:border-primary
              focus:ring-4
              focus:ring-purple-100
              transition-all
            "
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setDisputeModal(null);
                    setDisputeReason("");
                  }}
                  className="
              flex
              flex-1
              items-center
              justify-center
              gap-2
              h-12
              rounded-2xl
              border
              border-purple-100
              font-semibold
              text-secondary
              hover:bg-purple-50
              hover:border-primary
              transition-all
            "
                >
                  <Icon icon="solar:close-circle-linear" className="text-lg" />
                  Cancel
                </button>

                <button
                  onClick={handleDisputeSubmit}
                  className="
              flex
              flex-1
              items-center
              justify-center
              gap-2
              h-12
              rounded-2xl
              bg-gradient-to-r
              from-purple-600
              to-violet-600
              text-white
              font-bold
              hover:-translate-y-0.5
              hover:shadow-lg
              hover:shadow-purple-300/30
              transition-all
            "
                >
                  <Icon icon="solar:danger-bold" className="text-lg" />
                  File Dispute
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mb-8 flex items-start gap-4">
        <div
          className="
      w-14
      h-14
      rounded-2xl
      bg-gradient-to-br
      from-primary
      to-primary-dark
      flex
      items-center
      justify-center
      shadow-lg
      shadow-purple-200
      shrink-0
    "
        >
          <Icon
            icon="solar:users-group-rounded-bold"
            className="text-white text-3xl"
          />
        </div>

        <div>
          <h1 className="text-3xl font-black text-secondary">
            Active Collaborations
          </h1>

          <p className="text-muted text-lg mt-1">
            Manage your ongoing projects and chat with brands.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-card rounded-2xl border border-border animate-pulse"
            />
          ))}
        </div>
      ) : collaborations.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center py-16">
          <div className="text-5xl mb-3">
            <Icon
              icon="solar:hand-shake-bold"
              className="text-5xl text-primary"
            />
          </div>
          <p className="font-medium text-secondary">No collaborations yet</p>
          <p className="text-muted text-sm mt-1">
            Apply to opportunities to start collaborating.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="space-y-4">
            {collaborations.map((c) => (
              <div
                key={c._id}
                onClick={() => handleSelectCollaboration(c)}
                className={`bg-card rounded-2xl border shadow-card p-5 cursor-pointer transition-all hover:shadow-purple ${
                  selected?._id === c._id ? "border-primary" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-secondary text-sm line-clamp-1">
                      {c.opportunityId?.title}
                    </h3>
                    <p className="text-xs text-muted mt-0.5">
                      {c.brandId?.brandName || c.brandId?.fullName}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ml-2 ${statusColors[c.status]}`}
                  >
                    {c.status === "payment_pending" ? (
                      <>
                        <Icon
                          icon="solar:wallet-money-bold"
                          className="text-sm"
                        />
                        Payment Pending
                      </>
                    ) : c.status === "active" ? (
                      <>
                        <Icon
                          icon="solar:play-circle-bold"
                          className="text-sm"
                        />
                        In Progress
                      </>
                    ) : c.status === "submitted" ? (
                      <>
                        <Icon icon="solar:eye-bold" className="text-sm" />
                        Under Review
                      </>
                    ) : c.status === "revision" ? (
                      <>
                        <Icon
                          icon="solar:refresh-circle-bold"
                          className="text-sm"
                        />
                        Revision
                      </>
                    ) : c.status === "completed" ? (
                      <>
                        <Icon
                          icon="solar:check-circle-bold"
                          className="text-sm"
                        />
                        Completed
                      </>
                    ) : (
                      c.status
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted mb-3">
                  <div className="flex items-center gap-1">
                    <Icon
                      icon="solar:wallet-money-bold"
                      className="text-green-500"
                    />
                    PKR {c.agreedAmount?.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon
                      icon="solar:clock-circle-bold"
                      className="text-orange-500"
                    />
                    {c.deadline} days
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon
                      icon="solar:smartphone-bold"
                      className="text-violet-500"
                    />
                    {c.opportunityId?.platform}
                  </div>
                </div>

                {/* Payment Pending Notice */}
                {c.status === "payment_pending" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 mb-3">
                    <p className="text-xs font-bold text-yellow-700">
                      <div className="flex items-center gap-2 font-bold text-yellow-700">
                        <Icon icon="solar:clock-circle-bold" />
                        Waiting for Brand Payment
                      </div>
                    </p>
                    <p className="text-xs text-yellow-600 mt-0.5">
                      Chat will unlock after admin verifies payment.
                    </p>
                  </div>
                )}

                {/* Revision Note */}
                {c.status === "revision" && c.revisionNote && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 mb-3">
                    <p className="text-xs font-bold text-orange-700">
                      <div className="flex items-center gap-2 font-bold text-orange-700">
                        <Icon icon="solar:refresh-circle-bold" />
                        Revision Request
                      </div>
                    </p>
                    <p className="text-xs text-orange-600 mt-0.5">
                      {c.revisionNote}
                    </p>
                  </div>
                )}

                {/* Payment released */}
                {c.status === "completed" && (
                  <div
                    className={`rounded-lg px-3 py-2 mb-3 ${
                      c.paymentStatus === "released"
                        ? "bg-green-50 border border-green-200"
                        : "bg-yellow-50 border border-yellow-200"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 text-xs font-bold ${
                        c.paymentStatus === "released"
                          ? "text-green-700"
                          : "text-yellow-700"
                      }`}
                    >
                      <Icon
                        icon={
                          c.paymentStatus === "released"
                            ? "solar:wallet-money-bold"
                            : "solar:clock-circle-bold"
                        }
                        className="text-base"
                      />

                      <span>
                        {c.paymentStatus === "released"
                          ? "Payment Released"
                          : "Payment Pending Release"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCollaboration(c);
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 py-2 text-sm font-bold rounded-xl transition-colors ${
                      c.chatUnlocked
                        ? "bg-primary-light text-primary hover:bg-primary hover:text-white"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {c.chatUnlocked ? (
                      <>
                        <Icon icon="quill:chat" className="text-base" />
                        <span>Chat</span>
                      </>
                    ) : (
                      <>
                        <Icon
                          icon="material-symbols:lock-outline"
                          className="text-base"
                        />
                        <span>Chat Locked</span>
                      </>
                    )}
                  </button>
                  {(c.status === "active" || c.status === "revision") && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSubmitModal(c);
                      }}
                      className="flex-1 py-2 bg-primary text-white md:text-[17px] text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <>
                        <Icon
                          className="md:text-[20px]"
                          icon="solar:upload-bold"
                        />
                        Submit Work
                      </>
                    </button>
                  )}
                  {(c.status === "payment_pending" ||
                    c.status === "active" ||
                    c.status === "revision" ||
                    c.status === "completed") && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModal(c);
                      }}
                      className="py-2 px-3 bg-red-50 text-red-600 md:text-[25px] text-[20px] font-bold rounded-xl hover:bg-red-100 transition-colors"
                      title="Delete collaboration"
                    >
                      <Icon icon="solar:trash-bin-trash-bold" />
                    </button>
                  )}
                  {(c.status === "active" || c.status === "submitted") && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRaiseDispute(c);
                      }}
                      className="py-2 px-3 bg-red-50 text-red-600 md:text-[25px] text-[20px] font-bold rounded-xl hover:bg-red-100 transition-colors"
                      title="Raise Dispute"
                    >
                      <Icon icon="solar:scale-bold" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Panel */}
          {selected ? (
            <div className="bg-card rounded-2xl border border-border shadow-card flex flex-col h-[600px] sticky top-24">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold flex-shrink-0">
                  {selected.brandId?.brandName?.[0] ||
                    selected.brandId?.fullName?.[0] ||
                    "B"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-secondary text-sm truncate">
                    {selected.brandId?.brandName || selected.brandId?.fullName}
                  </p>
                  <p className="text-xs text-muted truncate">
                    {selected.opportunityId?.title}
                  </p>
                </div>
                <span
                  className={`flex flex-shrink-0 items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[selected.status]}`}
                >
                  {selected.status === "payment_pending" ? (
                    <>
                      <Icon
                        icon="solar:wallet-money-bold"
                        className="text-sm"
                      />
                      Payment Pending
                    </>
                  ) : selected.status === "active" ? (
                    <>
                      <Icon icon="solar:play-circle-bold" className="text-sm" />
                      In Progress
                    </>
                  ) : selected.status === "submitted" ? (
                    <>
                      <Icon
                        icon="solar:clipboard-check-bold"
                        className="text-sm"
                      />
                      Under Review
                    </>
                  ) : selected.status === "revision" ? (
                    <>
                      <Icon
                        icon="solar:refresh-circle-bold"
                        className="text-sm"
                      />
                      Revision
                    </>
                  ) : selected.status === "completed" ? (
                    <>
                      <Icon
                        icon="solar:check-circle-bold"
                        className="text-sm"
                      />
                      Completed
                    </>
                  ) : (
                    selected.status
                  )}
                </span>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Chat Locked */}
                {!selected.chatUnlocked ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="text-5xl mb-3">
                      <Icon
                        icon="material-symbols:lock-outline"
                        className="text-5xl text-orange-500"
                      />
                    </div>
                    <p className="font-bold text-secondary">Chat Locked</p>
                    <p className="text-xs text-muted mt-2 max-w-xs">
                      Waiting for brand to complete payment. Chat will unlock
                      after admin verifies payment.
                    </p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-muted">
                    <div className="text-4xl mb-2">
                      <Icon
                        icon="quill:chat"
                        className="text-5xl text-primary"
                      />
                    </div>
                    <p className="text-sm">
                      No conversation yet. Start chatting with the
                      brand.essage...
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe =
                      msg.senderId?._id?.toString() === user?._id?.toString();
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                            isMe
                              ? "bg-primary text-white rounded-br-sm"
                              : "bg-surface text-secondary rounded-bl-sm border border-border"
                          }`}
                        >
                          <p className="break-words">{msg.message}</p>
                          <p
                            className={`text-xs mt-1 ${isMe ? "text-purple-200" : "text-muted"}`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString(
                              "en-PK",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input — locked ya unlocked */}
              {!selected.chatUnlocked ? (
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-border">
                    <span>
                      <Icon
                        icon="material-symbols:lock-outline"
                        className="text-5xl text-orange-500"
                      />
                    </span>
                    <p className="text-sm text-muted">
                      Chat will unlock after payment is verified by admin
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSendMsg}
                  className="p-4 border-t border-border flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Write your message..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                  <button
                    type="submit"
                    disabled={!newMsg.trim()}
                    className="flex items-center gap-2 justify-center px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <>
                      <Icon icon="solar:plain-bold" />
                      Send
                    </>
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border shadow-card flex items-center justify-center h-[600px] sticky top-24">
              <div className="text-center text-muted">
                <div className="text-5xl mb-3">
                  <Icon icon="quill:chat" className="text-5xl text-primary" />
                </div>
                <p className="font-medium">Select a collaboration</p>
                <p className="text-sm mt-1">to open the chat</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
