import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, AlertTriangle, CheckCircle2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * VerifyOTPPage Component
 * 
 * OTP (One-Time Password) verification page.
 * 
 * Features:
 * - 6 individual digit inputs
 * - Auto-focus between inputs
 * - Paste support for the full code
 * - Backspace deletes and moves to previous input
 * - Resend timer (60 seconds)
 * - Success/error states
 * 
 * UX patterns:
 * - Auto-advances to next input on digit entry
 * - Auto-submits when all 6 digits entered
 * - Visual feedback on each input
 */
export function VerifyOTPPage() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  
  const inputRefs = useRef([])

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0 && !canResend) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else if (resendTimer === 0) {
      setCanResend(true)
    }
  }, [resendTimer, canResend])

  /**
   * Handle input change for a single digit.
   */
  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^[0-9]$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError('')

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits entered
    if (value && index === 5) {
      const fullCode = newCode.join('')
      if (fullCode.length === 6) {
        handleVerify(fullCode)
      }
    }
  }

  /**
   * Handle backspace - move to previous input.
   */
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  /**
   * Handle paste event for the full code.
   */
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    // Check if pasted content is a 6-digit number
    if (/^[0-9]{6}$/.test(pastedData)) {
      const digits = pastedData.split('')
      setCode(digits)
      handleVerify(pastedData)
    }
  }

  /**
   * Verify the OTP code.
   * 
   * Future API Integration:
   * POST /api/auth/verify-otp
   * Body: { email, code }
   * Response: { verified: true }
   */
  const handleVerify = async (verifyCode) => {
    const fullCode = verifyCode || code.join('')
    
    if (fullCode.length !== 6) return

    setError('')
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (fullCode === '123456') {
            resolve()
          } else {
            reject(new Error('Invalid verification code'))
          }
        }, 1000)
      })

      setIsSuccess(true)
    } catch (err) {
      setError(err.message)
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Resend OTP code.
   */
  const handleResend = () => {
    setCanResend(false)
    setResendTimer(60)
    setCode(['', '', '', '', '', ''])
    setError('')
    inputRefs.current[0]?.focus()
    // Future: POST /api/auth/resend-otp
  }

  // Success State
  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Email verified!
          </h1>
          <p className="text-muted-foreground">
            Your email has been successfully verified. You can now access all features.
          </p>
        </div>

        <div className="text-center">
          <Link to="/dashboard">
            <Button>
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Mail size={32} className="text-primary" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Verify your email
        </h1>
        <p className="text-muted-foreground">
          We've sent a 6-digit code to{' '}
          <span className="font-medium text-foreground">demo@aistudio.com</span>
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl">Enter verification code</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* OTP Input Fields */}
          <div className="flex justify-center gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={isLoading}
                className={cn(
                  'w-12 h-14 text-center text-xl font-bold rounded-lg border-2 transition-all',
                  'bg-card text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                  error
                    ? 'border-destructive'
                    : digit
                      ? 'border-primary'
                      : 'border-border hover:border-muted-foreground/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              Verifying...
            </div>
          )}

          {/* Resend Section */}
          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-sm text-primary hover:underline"
              >
                Resend code
              </button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Resend code in {resendTimer}s
              </p>
            )}
          </div>

          {/* Manual Submit (fallback) */}
          <Button
            onClick={() => handleVerify()}
            disabled={code.join('').length !== 6 || isLoading}
            className="w-full"
            variant="outline"
          >
            Verify manually
          </Button>
        </CardContent>
      </Card>

      {/* Demo Hint */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Demo: Use code <span className="font-mono font-bold text-foreground">123456</span>
        </p>
      </div>
    </div>
  )
}