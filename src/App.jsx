import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Public Pages
import Home             from './pages/Home'
import Opportunities    from './pages/Opportunities'
import HowItWorks       from './pages/HowItWorks'
import Features         from './pages/Features'
import Pricing          from './pages/Pricing'
import TrendingCreators from './pages/TrendingCreators'
import About            from './pages/About'
import Contact          from './pages/Contact'
import PrivacyPolicy    from './pages/PrivacyPolicy'
import Terms            from './pages/Terms'

// Auth
import Login          from './pages/auth/Login'
import Signup         from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'

// Creator Dashboard
import CreatorDashboard     from './pages/dashboard/creator/CreatorDashboard'
import BrowseOpportunities  from './pages/dashboard/creator/BrowseOpportunities'
import MyApplications       from './pages/dashboard/creator/MyApplications'
import ActiveCollaborations from './pages/dashboard/creator/ActiveCollaborations'
import Earnings             from './pages/dashboard/creator/Earnings'
import CreatorProfile       from './pages/dashboard/creator/CreatorProfile'

// Brand Dashboard
import BrandDashboard       from './pages/dashboard/brand/BrandDashboard'
import PostOpportunity      from './pages/dashboard/brand/PostOpportunity'
import MyOpportunities      from './pages/dashboard/brand/MyOpportunities'
import ApplicationsReceived from './pages/dashboard/brand/ApplicationsReceived'
import BrandCollaborations  from './pages/dashboard/brand/BrandCollaborations'
import BrandPayments        from './pages/dashboard/brand/BrandPayments'
import BrandProfile         from './pages/dashboard/brand/BrandProfile'

// Admin Dashboard
import AdminDashboard       from './pages/dashboard/admin/AdminDashboard'
import ManageUsers          from './pages/dashboard/admin/ManageUsers'
import ManageOpportunities  from './pages/dashboard/admin/ManageOpportunities'
import ManageCollaborations from './pages/dashboard/admin/ManageCollaborations'
import ManagePayments       from './pages/dashboard/admin/ManagePayments'
import Disputes             from './pages/dashboard/admin/Disputes'

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  // ✅ Loading ke dauran kuch mat karo — spinner dikhao
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted text-sm">Loading...</p>
      </div>
    </div>
  )

  // ✅ Loading khatam hone ke baad check karo
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/"                  element={<Home />} />
        <Route path="/opportunities"     element={<Opportunities />} />
        <Route path="/how-it-works"      element={<HowItWorks />} />
        <Route path="/features"          element={<Features />} />
        <Route path="/pricing"           element={<Pricing />} />
        <Route path="/trending-creators" element={<TrendingCreators />} />
        <Route path="/about"             element={<About />} />
        <Route path="/contact"           element={<Contact />} />
        <Route path="/privacy-policy"    element={<PrivacyPolicy />} />
        <Route path="/terms"             element={<Terms />} />

        {/* Auth */}
        <Route path="/login"           element={<Login />} />
        <Route path="/signup"          element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Creator */}
        <Route path="/creator/dashboard"      element={<ProtectedRoute allowedRoles={['creator']}><CreatorDashboard /></ProtectedRoute>} />
        <Route path="/creator/opportunities"  element={<ProtectedRoute allowedRoles={['creator']}><BrowseOpportunities /></ProtectedRoute>} />
        <Route path="/creator/applications"   element={<ProtectedRoute allowedRoles={['creator']}><MyApplications /></ProtectedRoute>} />
        <Route path="/creator/collaborations" element={<ProtectedRoute allowedRoles={['creator']}><ActiveCollaborations /></ProtectedRoute>} />
        <Route path="/creator/earnings"       element={<ProtectedRoute allowedRoles={['creator']}><Earnings /></ProtectedRoute>} />
        <Route path="/creator/profile"        element={<ProtectedRoute allowedRoles={['creator']}><CreatorProfile /></ProtectedRoute>} />

        {/* Brand */}
        <Route path="/brand/dashboard"        element={<ProtectedRoute allowedRoles={['brand']}><BrandDashboard /></ProtectedRoute>} />
        <Route path="/brand/post-opportunity" element={<ProtectedRoute allowedRoles={['brand']}><PostOpportunity /></ProtectedRoute>} />
        <Route path="/brand/opportunities"    element={<ProtectedRoute allowedRoles={['brand']}><MyOpportunities /></ProtectedRoute>} />
        <Route path="/brand/applications"     element={<ProtectedRoute allowedRoles={['brand']}><ApplicationsReceived /></ProtectedRoute>} />
        <Route path="/brand/collaborations"   element={<ProtectedRoute allowedRoles={['brand']}><BrandCollaborations /></ProtectedRoute>} />
        <Route path="/brand/payments"         element={<ProtectedRoute allowedRoles={['brand']}><BrandPayments /></ProtectedRoute>} />
        <Route path="/brand/profile"          element={<ProtectedRoute allowedRoles={['brand']}><BrandProfile /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard"       element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users"           element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/opportunities"   element={<ProtectedRoute allowedRoles={['admin']}><ManageOpportunities /></ProtectedRoute>} />
        <Route path="/admin/collaborations"  element={<ProtectedRoute allowedRoles={['admin']}><ManageCollaborations /></ProtectedRoute>} />
        <Route path="/admin/payments"        element={<ProtectedRoute allowedRoles={['admin']}><ManagePayments /></ProtectedRoute>} />
        <Route path="/admin/disputes"        element={<ProtectedRoute allowedRoles={['admin']}><Disputes /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App