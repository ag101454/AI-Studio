import { Routes, Route } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LandingLayout } from '@/layouts/LandingLayout'
import { LandingPage } from '@/features/landing/pages/LandingPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ChatPage } from '@/features/chat/pages/ChatPage'
import { ImagePage } from '@/features/image/pages/ImagePage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'
import { VerifyOTPPage } from '@/features/auth/pages/VerifyOTPPage'
import { CodePage } from '@/features/code/pages/CodePage'
import { DocumentPage } from '@/features/document/pages/DocumentPage'
import { VoicePage } from '@/features/voice/pages/VoicePage'
import { ResumePage } from '@/features/resume/pages/ResumePage'
import { TranslatorPage } from '@/features/translator/pages/TranslatorPage'
import { EmailPage } from '@/features/email/pages/EmailPage'
import { ProfilePage } from '@/features/profile/pages/ProfilePage'
import { AdminPage } from '@/features/admin/pages/AdminPage'
import { APIKeysPage } from '@/features/apikeys/pages/APIKeysPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'


/**
 * Application Routes
 * 
 * Complete route configuration for AI Studio.
 * 
 * Structure:
 * - /                    → Public landing page
 * - /auth/*              → Authentication pages
 * - /dashboard/*         → Authenticated dashboard pages
 * 
 * Route protection (future):
 * - Dashboard routes will be wrapped in a ProtectedRoute component
 * - Auth routes will redirect to dashboard if already logged in
 * - Role-based access for admin routes
 * 
 * Lazy loading (future optimization):
 * - Each page can be lazy loaded with React.lazy()
 * - Reduces initial bundle size
 * - Improves page load performance
 */
function AppRoutes() {
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      
      {/* Landing Page */}
      <Route path="/" element={<LandingLayout />}>
        <Route index element={<LandingPage />} />
      </Route>

      {/* ==================== AUTH ROUTES ==================== */}
      
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-otp" element={<VerifyOTPPage />} />
      </Route>

      {/* ==================== DASHBOARD ROUTES ==================== */}
      
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* Main Dashboard */}
        <Route index element={<DashboardPage />} />
        
        {/* AI Tools */}
        <Route path="chat" element={<ChatPage />} />
        <Route path="image" element={<ImagePage />} />
        <Route path="code" element={<CodePage />} />
        <Route path="document" element={<DocumentPage />} />
        <Route path="voice" element={<VoicePage />} />
        <Route path="resume" element={<ResumePage />} />
        <Route path="translator" element={<TranslatorPage />} />
        <Route path="email" element={<EmailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="api-keys" element={<APIKeysPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* ==================== ADMIN ROUTES (Future) ==================== */}
      
      {/* <Route path="/admin" element={<AdminLayout />}> */}
      {/*   <Route index element={<AdminOverview />} /> */}
      {/*   <Route path="users" element={<AdminUsers />} /> */}
      {/*   <Route path="subscriptions" element={<AdminSubscriptions />} /> */}
      {/*   <Route path="analytics" element={<AdminAnalytics />} /> */}
      {/*   <Route path="settings" element={<AdminSettings />} /> */}
      {/* </Route> */}

      {/* ==================== PROFILE ROUTES (Future) ==================== */}
      
      {/* <Route path="/profile" element={<DashboardLayout />}> */}
      {/*   <Route index element={<ProfilePage />} /> */}
      {/*   <Route path="settings" element={<SettingsPage />} /> */}
      {/*   <Route path="billing" element={<BillingPage />} /> */}
      {/*   <Route path="api-keys" element={<APIKeysPage />} /> */}
      {/* </Route> */}

      {/* ==================== 404 CATCH-ALL (Future) ==================== */}
      
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  )
}

export default AppRoutes

