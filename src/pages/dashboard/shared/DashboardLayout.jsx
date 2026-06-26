// import { useState, useEffect, useRef } from 'react'
// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { useAuth } from '../../../context/AuthContext'
// import axios from '../../../utils/axios'
// import socket from '../../../utils/socket'
// import { showPushNotification } from '../../../utils/pushNotifications'

// export default function DashboardLayout({ children, links }) {
//   const [sidebarOpen, setSidebarOpen]     = useState(false)
//   const [notifications, setNotifications] = useState([])
//   const [notifOpen, setNotifOpen]         = useState(false)
//   const [unreadCount, setUnreadCount]     = useState(0)
//   const notifRef                          = useRef(null)

//   const { user, logout } = useAuth()
//   const location         = useLocation()
//   const navigate         = useNavigate()

//   // ─── Fetch + Socket Setup ─────────────────────────
//   useEffect(() => {
//     fetchNotifications()

//     // Real time notification
//     socket.on('new_notification', (notif) => {
//       setNotifications(prev => [notif, ...prev])
//       setUnreadCount(prev => prev + 1)
//        playNotificationSound()
//          showPushNotification(notif.title, notif.message, notif.link)

//     })

//     return () => {
//       socket.off('new_notification')
//     }
//   }, [])

//   // ─── Outside Click Close ──────────────────────────
//   useEffect(() => {
//     const handleClick = (e) => {
//       if (notifRef.current && !notifRef.current.contains(e.target)) {
//         setNotifOpen(false)
//       }
//     }
//     document.addEventListener('mousedown', handleClick)
//     return () => document.removeEventListener('mousedown', handleClick)
//   }, [])

//   const fetchNotifications = async () => {
//     try {
//       const res = await axios.get('/notifications')
//       setNotifications(res.data)
//       setUnreadCount(res.data.filter(n => !n.isRead).length)
//     } catch {
//       setNotifications([])
//     }
//   }

//   const handleMarkAllRead = async () => {
//     try {
//       await axios.put('/notifications/read-all')
//       setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
//       setUnreadCount(0)
//     } catch {}
//   }

//   const handleNotifClick = async (notif) => {
//     try {
//       if (!notif.isRead) {
//         await axios.put(`/notifications/${notif._id}/read`)
//         setNotifications(prev => prev.map(n =>
//           n._id === notif._id ? { ...n, isRead: true } : n
//         ))
//         setUnreadCount(prev => Math.max(0, prev - 1))
//       }
//       setNotifOpen(false)
//       if (notif.link) navigate(notif.link)
//     } catch {}
//   }
// // Sound function add karo — component ke bahar
// const playNotificationSound = () => {
//   try {
//     const audio = new Audio('/notification.wav')
//     audio.volume = 0.5
//     audio.play().catch(() => {})
//   } catch {}
// }
//   const handleLogout = () => {
//     logout()
//     navigate('/login')
//   }

//   const notifIcons = {
//     application:   '📋',
//     collaboration: '🤝',
//     payment:       '💰',
//     message:       '💬',
//     system:        '🔔',
//   }

//   return (
//     <div className="min-h-screen bg-surface flex">

//       {/* Sidebar */}
//       <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border flex flex-col transition-transform duration-300 ${
//         sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//       } lg:translate-x-0 lg:static lg:flex`}>

//         {/* Logo */}
//         <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
//           <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
//             <span className="text-white font-black text-sm">T</span>
//           </div>
//           <span className="text-primary font-black text-lg">TRENDORA</span>
//         </div>

//         {/* User Info */}
//         <div className="px-6 py-4 border-b border-border">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold flex-shrink-0">
//               {user?.fullName?.[0] || 'U'}
//             </div>
//             <div className="min-w-0">
//               <p className="text-sm font-bold text-secondary truncate">{user?.fullName}</p>
//               <p className="text-xs text-muted capitalize">{user?.role}</p>
//             </div>
//           </div>
//         </div>

//         {/* Nav Links */}
//         <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
//           {links.map(link => (
//             <Link
//               key={link.to}
//               to={link.to}
//               onClick={() => setSidebarOpen(false)}
//               className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
//                 location.pathname === link.to
//                   ? 'bg-primary text-white shadow-purple'
//                   : 'text-muted hover:bg-primary-light hover:text-primary'
//               }`}
//             >
//               <span>{link.icon}</span>
//               {link.label}
//             </Link>
//           ))}
//         </nav>

//         {/* Logout */}
//         <div className="px-4 py-4 border-t border-border">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
//           >
//             <span>🚪</span> Logout
//           </button>
//         </div>
//       </aside>

//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black/40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col min-w-0">

//         {/* Top Bar */}
//         <header className="sticky top-0 z-30 bg-white border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="lg:hidden p-2 rounded-lg text-muted hover:bg-surface"
//           >
//             ☰
//           </button>

//           <div className="flex items-center gap-3 ml-auto">

//             {/* Notification Bell */}
//             <div className="relative" ref={notifRef}>
//               <button
//                 onClick={() => setNotifOpen(!notifOpen)}
//                 className="relative p-2 rounded-xl hover:bg-surface text-xl transition-colors"
//               >
//                 🔔
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
//                     {unreadCount > 9 ? '9+' : unreadCount}
//                   </span>
//                 )}
//               </button>

//               {/* Dropdown */}
//               {notifOpen && (
//                 <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-purple border border-border z-50 overflow-hidden">

//                   {/* Header */}
//                   <div className="flex items-center justify-between px-4 py-3 border-b border-border">
//                     <div className="flex items-center gap-2">
//                       <h3 className="font-bold text-secondary text-sm">Notifications</h3>
//                       {unreadCount > 0 && (
//                         <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
//                           {unreadCount}
//                         </span>
//                       )}
//                     </div>
//                     {unreadCount > 0 && (
//                       <button
//                         onClick={handleMarkAllRead}
//                         className="text-xs text-primary font-semibold hover:underline"
//                       >
//                         Mark all read
//                       </button>
//                     )}
//                   </div>

//                   {/* List */}
//                   <div className="max-h-96 overflow-y-auto divide-y divide-border">
//                     {notifications.length === 0 ? (
//                       <div className="text-center py-10 text-muted">
//                         <div className="text-3xl mb-2">🔔</div>
//                         <p className="text-sm font-medium">No notifications yet</p>
//                         <p className="text-xs mt-1">We'll notify you when something happens</p>
//                       </div>
//                     ) : (
//                       notifications.map(n => (
//                         <div
//                           key={n._id}
//                           onClick={() => handleNotifClick(n)}
//                           className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-surface transition-colors ${
//                             !n.isRead ? 'bg-primary-light' : ''
//                           }`}
//                         >
//                           {/* Icon */}
//                           <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${
//                             n.type === 'payment'       ? 'bg-green-50'
//                             : n.type === 'collaboration' ? 'bg-blue-50'
//                             : n.type === 'application'   ? 'bg-yellow-50'
//                             : n.type === 'message'       ? 'bg-purple-50'
//                             : 'bg-surface'
//                           }`}>
//                             {notifIcons[n.type] || '🔔'}
//                           </div>

//                           {/* Content */}
//                           <div className="flex-1 min-w-0">
//                             <p className="text-xs font-bold text-secondary line-clamp-1">
//                               {n.title}
//                             </p>
//                             <p className="text-xs text-muted mt-0.5 line-clamp-2">
//                               {n.message}
//                             </p>
//                             <p className="text-xs text-muted mt-1">
//                               {new Date(n.createdAt).toLocaleDateString('en-PK', {
//                                 day: 'numeric',
//                                 month: 'short',
//                                 hour: '2-digit',
//                                 minute: '2-digit',
//                               })}
//                             </p>
//                           </div>

//                           {/* Unread dot */}
//                           {!n.isRead && (
//                             <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
//                           )}
//                         </div>
//                       ))
//                     )}
//                   </div>

//                   {/* Footer */}
//                   {notifications.length > 0 && (
//                     <div className="px-4 py-2.5 border-t border-border bg-surface text-center">
//                       <p className="text-xs text-muted">
//                         {unreadCount > 0
//                           ? `${unreadCount} unread · ${notifications.length} total`
//                           : `${notifications.length} notifications — all read`}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* User Avatar + Name */}
//             <div className="flex items-center gap-2 pl-1">
//               <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
//                 {user?.fullName?.[0] || 'U'}
//               </div>
//               <div className="hidden sm:block min-w-0">
//                 <p className="text-xs font-bold text-secondary truncate max-w-[120px]">
//                   {user?.fullName}
//                 </p>
//                 <p className="text-xs text-muted capitalize">{user?.role}</p>
//               </div>
//             </div>

//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   )
// }

import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "../../../utils/axios";
import socket from "../../../utils/socket";
import { showPushNotification } from "../../../utils/pushNotifications";
import navbarLogo from "../../../assets/navbar-logo.png";
import { Icon } from "@iconify/react";
import { Outlet } from "react-router-dom";
const playNotificationSound = () => {
  try {
    const audio = new Audio("/notification.wav");
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch {}
};

export default function DashboardLayout({ children, links }) {
  // useEffect(() => {
  //   console.log("DashboardLayout Mounted");

  //   return () => {
  //     console.log("DashboardLayout Unmounted");
  //   };
  // }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [msgToast, setMsgToast] = useState(null); // ← WhatsApp toast
  const notifRef = useRef(null);

  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  useEffect(() => {
    fetchNotifications();

    // Regular notifications
    socket.on("new_notification", (notif) => {
      // Message notification alag handle karo
      if (notif.type === "message") return;

      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      playNotificationSound();
      showPushNotification(notif.title, notif.message, notif.link);
    });

    // ✅ WhatsApp style message notification
    socket.on("message_notification", (data) => {
      // ✅ Hamesha show karo — chat page pe bhi
      // Sirf agar same collaboration mein nahi hai
      setMsgToast(data);
      playNotificationSound();
      setTimeout(() => setMsgToast(null), 5000);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off("new_notification");
      socket.off("message_notification");
    };
  }, []);
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/notifications");
      setNotifications(res.data.filter((n) => n.type !== "message")); // message wali alag
      setUnreadCount(res.data.filter((n) => !n.isRead).length);
    } catch {
      setNotifications([]);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleNotifClick = async (notif) => {
    try {
      if (!notif.isRead) {
        await axios.put(`/notifications/${notif._id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      setNotifOpen(false);
      if (notif.link) navigate(notif.link);
    } catch {}
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const notifIcons = {
    application: "solar:clipboard-text-bold",
    collaboration: "solar:users-group-rounded-bold",
    payment: "solar:wallet-money-bold",
    message: "solar:chat-round-dots-bold",
    system: "solar:bell-bold",
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* ✅ WhatsApp Style Message Toast */}
      {msgToast && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-secondary text-white px-5 py-3 rounded-2xl shadow-purple flex items-center gap-3 cursor-pointer max-w-sm w-full mx-4 animate-fade-in"
          onClick={() => {
            setMsgToast(null);
            navigate(
              user?.role === "brand"
                ? "/brand/collaborations"
                : "/creator/collaborations",
            );
          }}
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-lg flex-shrink-0">
            💬
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-purple-200">
              {msgToast.senderName}
            </p>
            <p className="text-sm font-semibold truncate">{msgToast.message}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMsgToast(null);
            }}
            className="text-gray-400 hover:text-white text-lg flex-shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen w-64 bg-white border-r border-border flex flex-col overflow-hidden overscroll-contain ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0`}
      >
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="flex items-center gap-1">
            <img
              src={navbarLogo}
              alt="Trendora Logo"
              className="object-contain w-12 h-12"
            />
            <span className="text-2xl font-extrabold tracking-tight text-purple-700">
              Trendora
            </span>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold flex-shrink-0">
              {user?.fullName?.[0] || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-secondary truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-muted capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav
          className="
    flex-1
    min-h-0
    overflow-y-auto
    overscroll-contain
    px-4
    py-4
    space-y-1
  "
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary text-white shadow-purple"
                  : "text-muted hover:bg-primary-light hover:text-primary"
              }`}
            >
              <Icon icon={link.icon} className="text-[22px] flex-shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div
          className="
    px-4
    py-4
    border-t
    border-border
    bg-white
    flex-shrink-0
    sticky
    bottom-0
    z-10
  "
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <Icon icon="circum:logout" className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-muted hover:bg-surface"
          >
            ☰
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white transition-all hover:border-primary hover:bg-primary-light"
              >
                <Icon
                  icon="carbon:notification"
                  className="text-[24px] text-primary"
                />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-purple border border-border z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-secondary text-sm">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto divide-y divide-border">
                    {notifications.length === 0 ? (
                      <div className="text-center py-10 text-muted">
                        <div className="text-3xl mb-2">
                          <Icon
                            icon="solar:bell-off-bold"
                            className="text-5xl text-primary mx-auto mb-3"
                          />
                        </div>
                        <p className="text-sm font-medium">
                          No notifications yet
                        </p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => handleNotifClick(n)}
                          className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-surface transition-colors ${
                            !n.isRead ? "bg-primary-light" : ""
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              n.type === "payment"
                                ? "bg-green-50"
                                : n.type === "collaboration"
                                  ? "bg-blue-50"
                                  : n.type === "application"
                                    ? "bg-yellow-50"
                                    : n.type === "message"
                                      ? "bg-purple-50"
                                      : "bg-surface"
                            }`}
                          >
                            <Icon
                              icon={notifIcons[n.type] || "carbon:notification"}
                              className="text-xl text-primary"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-secondary line-clamp-1">
                              {n.title}
                            </p>
                            <p className="text-xs text-muted mt-0.5 line-clamp-2">
                              {n.message}
                            </p>
                            <p className="text-xs text-muted mt-1">
                              {new Date(n.createdAt).toLocaleDateString(
                                "en-PK",
                                {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                          {!n.isRead && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-border bg-surface text-center">
                      <p className="text-xs text-muted">
                        {unreadCount > 0
                          ? `${unreadCount} unread · ${notifications.length} total`
                          : `${notifications.length} notifications — all read`}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1 rounded-2xl px-2 py-1 hover:bg-surface transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user?.fullName?.[0] || "U"}
                </div>

                <div className="hidden sm:block min-w-0 text-left">
                  <p className="text-xs font-bold text-secondary truncate max-w-[120px]">
                    {user?.fullName}
                  </p>

                  <p className="text-xs text-muted capitalize">{user?.role}</p>
                </div>

                <Icon
                  icon={
                    profileOpen
                      ? "solar:alt-arrow-up-bold"
                      : "solar:alt-arrow-down-bold"
                  }
                  className="hidden sm:block text-lg text-muted"
                />
              </button>

              {profileOpen && (
                <div
                  className="
      absolute
      right-0
      top-14
      w-64
      overflow-hidden
      rounded-3xl
      border
      border-purple-100
      bg-white
      shadow-[0_20px_60px_rgba(124,58,237,.15)]
      z-50
    "
                >
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold">
                        {user?.fullName?.[0] || "U"}
                      </div>

                      <div>
                        <h4 className="font-bold text-secondary">
                          {user?.fullName}
                        </h4>

                        <p className="text-xs text-muted capitalize">
                          {user?.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}

                  {(user?.role === "creator" || user?.role === "brand") && (
                    <button
                      onClick={() => {
                        setProfileOpen(false);

                        navigate(
                          user.role === "creator"
                            ? "/creator/profile"
                            : "/brand/profile",
                        );
                      }}
                      className="
          flex
          w-full
          items-center
          gap-3
          px-5
          py-3.5
          text-sm
          font-semibold
          text-secondary
          transition-all
          hover:bg-primary-light
          hover:text-primary
        "
                    >
                      <Icon icon="solar:user-id-bold" className="text-xl" />
                      Profile Settings
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="
        flex
        w-full
        items-center
        gap-3
        px-5
        py-3.5
        text-sm
        font-semibold
        text-red-500
        transition-all
        hover:bg-red-50
      "
                  >
                    <Icon icon="solar:logout-2-bold" className="text-xl" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
