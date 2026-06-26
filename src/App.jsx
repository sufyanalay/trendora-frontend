import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Public Pages
import Home from "./pages/Home";
import Opportunities from "./pages/Opportunities";
import HowItWorks from "./pages/HowItWorks";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import TrendingCreators from "./pages/TrendingCreators";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

// Auth
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import {
  creatorLinks,
  brandLinks,
  adminLinks,
} from "./pages/dashboard/dashboardLinks";
// Creator Dashboard
import CreatorDashboard from "./pages/dashboard/creator/CreatorDashboard";
import BrowseOpportunities from "./pages/dashboard/creator/BrowseOpportunities";
import MyApplications from "./pages/dashboard/creator/MyApplications";
import ActiveCollaborations from "./pages/dashboard/creator/ActiveCollaborations";
import Earnings from "./pages/dashboard/creator/Earnings";
import CreatorProfile from "./pages/dashboard/creator/CreatorProfile";
import DashboardLayout from "./pages/dashboard/shared/DashboardLayout";

// Brand Dashboard
import BrandDashboard from "./pages/dashboard/brand/BrandDashboard";
import PostOpportunity from "./pages/dashboard/brand/PostOpportunity";
import MyOpportunities from "./pages/dashboard/brand/MyOpportunities";
import ApplicationsReceived from "./pages/dashboard/brand/ApplicationsReceived";
import BrandCollaborations from "./pages/dashboard/brand/BrandCollaborations";
import BrandPayments from "./pages/dashboard/brand/BrandPayments";
import BrandProfile from "./pages/dashboard/brand/BrandProfile";

// Admin Dashboard
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import ManageUsers from "./pages/dashboard/admin/ManageUsers";
import ManageOpportunities from "./pages/dashboard/admin/ManageOpportunities";
import ManageCollaborations from "./pages/dashboard/admin/ManageCollaborations";
import ManagePayments from "./pages/dashboard/admin/ManagePayments";
import Disputes from "./pages/dashboard/admin/Disputes";
import ScrollToTop from "./components/ScrollToTop";
// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // ✅ Loading ke dauran kuch mat karo — spinner dikhao
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    );

  // ✅ Loading khatam hone ke baad check karo
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <>
        <ScrollToTop />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/trending-creators" element={<TrendingCreators />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Creator */}
          <Route
            path="/creator"
            element={
              <ProtectedRoute allowedRoles={["creator"]}>
                <DashboardLayout links={creatorLinks} />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CreatorDashboard />} />
            <Route path="opportunities" element={<BrowseOpportunities />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="collaborations" element={<ActiveCollaborations />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="profile" element={<CreatorProfile />} />
          </Route>

          {/* Brand */}
          <Route
            path="/brand"
            element={
              <ProtectedRoute allowedRoles={["brand"]}>
                <DashboardLayout links={brandLinks} />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<BrandDashboard />} />
            <Route path="post-opportunity" element={<PostOpportunity />} />
            <Route path="opportunities" element={<MyOpportunities />} />
            <Route path="applications" element={<ApplicationsReceived />} />
            <Route path="collaborations" element={<BrandCollaborations />} />
            <Route path="payments" element={<BrandPayments />} />
            <Route path="profile" element={<BrandProfile />} />
          </Route>

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout links={adminLinks} />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="opportunities" element={<ManageOpportunities />} />
            <Route path="collaborations" element={<ManageCollaborations />} />
            <Route path="payments" element={<ManagePayments />} />
            <Route path="disputes" element={<Disputes />} />
          </Route>
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;
