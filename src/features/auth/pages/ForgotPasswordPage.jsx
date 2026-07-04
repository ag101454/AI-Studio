import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Loader2, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormInput } from '@/components/ui/FormInput'
import { forgotPasswordSchema } from '@/features/auth/validation'
import { mockForgotPassword } from '@/mock/auth'

/**
 * ForgotPasswordPage Component
 * 
 * Allows users to request a password reset link.
 * 
 * Security best practices implemented:
 * - Generic success message (prevents email enumeration)
 * - Rate limiting (simulated with delay)
 * - No indication if email exists or not
 * 
 * States:
 * - idle: Form ready for input
 * - loading: Sending reset email
 * - success: Email sent confirmation
 * - error: Network or server error
 */
export function ForgotPasswordPage() {
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  /**
   * Handle form submission.
   * 
   * Future API Integration:
   * POST /api/auth/forgot-password
   * Body: { email }
   * Response: { message: "If account exists, reset link sent" }
   */
  const onSubmit = async (data) => {
    setServerError('')
    setIsLoading(true)

    try {
      await mockForgotPassword({ email: data.email })
      setIsSuccess(true)
    } catch (error) {
      setServerError(error.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
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
            Check your email
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            If an account exists with that email address, we've sent a password reset link. 
            Please check your inbox and spam folder.
          </p>
        </div>

        <div className="text-center space-y-4">
          <Button
            variant="outline"
            onClick={() => setIsSuccess(false)}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Try another email
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Didn't receive the email?{' '}
            <button
              onClick={() => onSubmit({ email: 'resend' })}
              className="text-primary hover:underline"
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    )
  }

  // Form State
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Forgot password?
        </h1>
        <p className="text-muted-foreground">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>
            We'll send a password reset link to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Alert */}
          {serverError && (
            <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Email address"
              name="email"
              type="email"
              placeholder="name@example.com"
              registration={register('email')}
              error={errors.email?.message}
              required
              disabled={isLoading}
              helperText="Enter the email address you used to register"
            />

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                <>
                  <Mail size={18} className="mr-2" />
                  Send reset link
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Back to Login */}
      <div className="text-center">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}