import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import StudentDashboard from './pages/StudentDashboard'
import StaffDashboard from './pages/StaffDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ReportIssuePage from './pages/ReportIssuePage'
import IssueDetailPage from './pages/IssueDetailPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, currentUser } = useApp()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && currentUser && !roles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

function DashboardRedirect() {
  const { currentUser } = useApp()
  if (!currentUser) return <Navigate to="/login" replace />
  if (currentUser.role === 'admin') return <Navigate to="/admin" replace />
  if (currentUser.role === 'staff') return <Navigate to="/staff" replace />
  return <Navigate to="/student" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* Auth redirect */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

      {/* Student / Faculty */}
      <Route path="/student" element={<ProtectedRoute roles={['student','faculty']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute><ReportIssuePage /></ProtectedRoute>} />
      <Route path="/issues/:id" element={<ProtectedRoute><IssueDetailPage /></ProtectedRoute>} />

      {/* Staff */}
      <Route path="/staff" element={<ProtectedRoute roles={['staff']}><StaffDashboard /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
