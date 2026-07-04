import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Loader2, Shield, Lock } from 'lucide-react'

/**
 * AdminRoute Component
 * 
 * Protects admin routes with session-based authentication.
 * Checks for valid admin session in sessionStorage.
 * Session expires after 4 hours.
 * Redirects to landing page if not authenticated.
 */
export function AdminRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkAdminSession()
  }, [])

  const checkAdminSession = () => {
    try {
      const adminAuth = sessionStorage.getItem('admin_authenticated')
      const loginTime = sessionStorage.getItem('admin_login_time')

      if (adminAuth === 'true' && loginTime) {
        // Check if session is still valid (4 hours max)
        const loginDate = new Date(loginTime)
        const now = new Date()
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60)

        if (hoursDiff < 4) {
          // Valid session
          setIsAdmin(true)
        } else {
          // Session expired - clear it
          sessionStorage.removeItem('admin_authenticated')
          sessionStorage.removeItem('admin_login_time')
          setError('Admin session expired. Please login again.')
        }
      } else {
        setError('Admin authentication required.')
      }
    } catch (err) {
      setError('Authentication check failed.')
    }

    setIsChecking(false)
  }

  // Loading state
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 size={40} className="animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground text-sm">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center max-w-md px-6 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-2">
            <Lock size={28} className="text-red-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            {error || 'You need admin credentials to access this page.'}
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #c8870a, #9e6b08)',
              }}
            >
              Go to Homepage
            </a>
            <a
              href="/#footer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 transition-all"
              style={{
                borderColor: '#d4c9a8',
                color: '#3d2e14',
              }}
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated - render children
  return (
    <>
      {/* Admin session indicator */}
      <div className="fixed top-0 left-0 right-0 z-[200] bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-1 text-xs font-medium">
        <Shield size={10} className="inline mr-1" />
        Admin Session Active —{' '}
        <button
          onClick={() => {
            sessionStorage.removeItem('admin_authenticated')
            sessionStorage.removeItem('admin_login_time')
            window.location.href = '/'
          }}
          className="underline hover:text-white/80"
        >
          Logout
        </button>
      </div>
      <div className="pt-6">
        {children}
      </div>
    </>
  )
}