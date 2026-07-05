import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Loader2, Shield } from 'lucide-react'

export function AdminRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin_authenticated')
    const loginTime = sessionStorage.getItem('admin_login_time')

    if (adminAuth === 'true' && loginTime) {
      const hoursDiff = (new Date() - new Date(loginTime)) / (1000 * 60 * 60)
      if (hoursDiff < 4) setIsAdmin(true)
    }
    setIsChecking(false)
  }, [])

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4 px-4">
          <Shield size={48} className="text-red-400 mx-auto" />
          <h1 className="font-heading text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">Admin authentication required.</p>
          <a href="/" className="inline-flex px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #c8870a, #9e6b08)' }}>
            Go to Homepage
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
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
      <div className="pt-6">{children}</div>
    </>
  )
}
