import { Routes, Route } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LandingLayout } from '@/layouts/LandingLayout'
import { LandingPage } from '@/features/landing/pages/LandingPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ChatPage } from '@/features/chat/pages/ChatPage'
import { ImagePage } from '@/features/image/pages/ImagePage'
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
import { BlogPage } from '@/features/blog/pages/BlogPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'
import { VerifyOTPPage } from '@/features/auth/pages/VerifyOTPPage'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PublicRoute } from '@/components/auth/PublicRoute'
import { AdminRoute } from '@/components/auth/AdminRoute'
import { SEO } from '@/components/SEO'

/**
 * Application Routes
 * 
 * Complete route configuration for AI Studio.
 * 
 * Protection:
 * - Public routes: Accessible by everyone
 * - Auth routes: Redirect to dashboard if logged in
 * - Protected routes: Redirect to login if not authenticated
 * - Admin routes: Require admin session
 */
function AppRoutes() {
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      
      {/* Landing Page */}
      <Route path="/" element={
        <>
          <SEO 
            title="Complete AI SaaS Platform" 
            description="Your all-in-one AI platform for chat, image generation, code writing, document creation, and more."
          />
          <LandingLayout />
        </>
      }>
        <Route index element={<LandingPage />} />
        <Route path="blog" element={<BlogPage />} />
      </Route>

      {/* ==================== AUTH ROUTES ==================== */}
      
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={
          <PublicRoute>
            <SEO title="Sign In" description="Sign in to your AI Studio account" />
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="register" element={
          <PublicRoute>
            <SEO title="Create Account" description="Create your free AI Studio account" />
            <RegisterPage />
          </PublicRoute>
        } />
        <Route path="forgot-password" element={
          <>
            <SEO title="Forgot Password" description="Reset your AI Studio password" />
            <ForgotPasswordPage />
          </>
        } />
        <Route path="reset-password" element={
          <>
            <SEO title="Reset Password" description="Set a new password for your account" />
            <ResetPasswordPage />
          </>
        } />
        <Route path="verify-otp" element={
          <>
            <SEO title="Verify Email" description="Verify your email address" />
            <VerifyOTPPage />
          </>
        } />
      </Route>

      {/* ==================== PROTECTED DASHBOARD ROUTES ==================== */}
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        {/* Main Dashboard */}
        <Route index element={
          <>
            <SEO title="Dashboard" description="Your AI Studio dashboard" />
            <DashboardPage />
          </>
        } />
        
        {/* AI Tools */}
        <Route path="chat" element={
          <>
            <SEO title="AI Chat" description="Chat with AI assistant" />
            <ChatPage />
          </>
        } />
        <Route path="image" element={
          <>
            <SEO title="Image Generator" description="Generate AI images from text" />
            <ImagePage />
          </>
        } />
        <Route path="code" element={
          <>
            <SEO title="Code Generator" description="Generate code with AI" />
            <CodePage />
          </>
        } />
        <Route path="document" element={
          <>
            <SEO title="Document Generator" description="Create documents with AI" />
            <DocumentPage />
          </>
        } />
        <Route path="voice" element={
          <>
            <SEO title="Voice Generator" description="Convert text to speech" />
            <VoicePage />
          </>
        } />
        <Route path="resume" element={
          <>
            <SEO title="Resume Builder" description="Build ATS-optimized resumes" />
            <ResumePage />
          </>
        } />
        <Route path="translator" element={
          <>
            <SEO title="Translator" description="Translate between 100+ languages" />
            <TranslatorPage />
          </>
        } />
        <Route path="email" element={
          <>
            <SEO title="Email Writer" description="Write professional emails with AI" />
            <EmailPage />
          </>
        } />

        {/* User Account */}
        <Route path="profile" element={
          <>
            <SEO title="Profile" description="Manage your profile" />
            <ProfilePage />
          </>
        } />
        <Route path="settings" element={
          <>
            <SEO title="Settings" description="Manage your settings" />
            <SettingsPage />
          </>
        } />
        <Route path="api-keys" element={
          <>
            <SEO title="API Keys" description="Manage your API keys" />
            <APIKeysPage />
          </>
        } />

        {/* Admin Panel */}
        <Route path="admin" element={
          <AdminRoute>
            <SEO title="Admin Panel" description="Admin dashboard" />
            <AdminPage />
          </AdminRoute>
        } />
      </Route>

      {/* ==================== 404 CATCH-ALL ==================== */}
      
      <Route path="*" element={
        <>
          <SEO title="404 - Page Not Found" description="The page you're looking for doesn't exist" />
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-6 px-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-4">
                <span className="text-5xl font-bold text-muted-foreground">404</span>
              </div>
              <h1 className="font-heading text-3xl font-bold text-foreground">
                Page Not Found
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #c8870a, #9e6b08)',
                  }}
                >
                  Go to Homepage
                </a>
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 transition-all hover:scale-105"
                  style={{
                    borderColor: '#d4c9a8',
                    color: '#3d2e14',
                  }}
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          </div>
        </>
      } />
    </Routes>
  )
}

export default AppRoutes