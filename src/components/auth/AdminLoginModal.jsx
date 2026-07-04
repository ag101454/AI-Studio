import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, User, Loader2, Eye, EyeOff, X, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

/**
 * Admin Login Modal
 * 
 * Secure admin authentication modal.
 * Validates credentials and creates admin session.
 */
export function AdminLoginModal({ isOpen, onClose }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Admin credentials
  // ⚠️ CHANGE THESE IN PRODUCTION
  const ADMIN_USERNAME = 'admin'
  const ADMIN_PASSWORD = 'aistudio2024'

  const handleLogin = async () => {
    setError('')

    if (!username.trim()) {
      setError('Please enter your username')
      return
    }

    if (!password) {
      setError('Please enter your password')
      return
    }

    setIsLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Store admin session
      sessionStorage.setItem('admin_authenticated', 'true')
      sessionStorage.setItem('admin_login_time', new Date().toISOString())

      setIsLoading(false)
      onClose()
      
      // Navigate to admin panel
      setTimeout(() => {
        navigate('/dashboard/admin')
      }, 200)
    } else {
      setIsLoading(false)
      setError('Invalid username or password. Access denied.')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  // Reset form on close
  const handleClose = () => {
    setUsername('')
    setPassword('')
    setError('')
    setShowPassword(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div
              className="p-8 text-center relative"
              style={{
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0d1b2a 100%)',
              }}
            >
              {/* Decorative circles */}
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/5" />
              <div className="absolute bottom-2 left-4 w-12 h-12 rounded-full bg-white/5" />

              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-5"
                >
                  <Shield size={36} className="text-white" />
                </motion.div>
                <h2 className="font-heading text-2xl font-bold text-white">
                  Admin Panel
                </h2>
                <p className="text-white/50 text-sm mt-2">
                  Secure authentication required
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-start gap-2"
                  >
                    <Lock size={14} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Username Field */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User size={12} />
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter admin username"
                  disabled={isLoading}
                  autoComplete="username"
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all disabled:opacity-50"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Lock size={12} />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter admin password"
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50/50 p-3 pr-12 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-12 gap-2 rounded-xl font-semibold text-base transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #1a1a3e, #0f0f23)',
                  color: '#ffffff',
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Key size={18} />
                    Access Admin Panel
                  </>
                )}
              </Button>

              {/* Footer Note */}
              <p className="text-xs text-gray-400 text-center">
                This area is restricted to authorized personnel only.
                Unauthorized access is prohibited.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}