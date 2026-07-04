import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormInput } from '@/components/ui/FormInput'
import { PasswordStrength } from '@/features/auth/components/PasswordStrength'
import { resetPasswordSchema } from '@/features/auth/validation'
import { mockResetPassword } from '@/mock/auth'

/**
 * ResetPasswordPage Component
 * 
 * Allows users to set a new password using a reset token.
 * 
 * The token typically comes from the email link:
 * /auth/reset-password?token=abc123
 * 
 * Security measures:
 * - Token validation
 * - Strong password requirements
 * - Password confirmation
 * - Auto-redirect after success
 */
export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password')

  /**
   * Handle form submission.
   * 
   * Future API Integration:
   * POST /api/auth/reset-password
   * Body: { token, password }
   * Response: { message: "Password reset successful" }
   */
  const onSubmit = async (data) => {
    if (!token) {
      setServerError('Invalid or missing reset token. Please request a new password reset link.')
      return
    }

    setServerError('')
    setIsLoading(true)

    try {
      await mockResetPassword({
        token,
        password: data.password,
      })
      setIsSuccess(true)
    } catch (error) {
      setServerError(error.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Invalid Token State
  if (!token) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <AlertTriangle size={32} className="text-destructive" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Invalid reset link
          </h1>
          <p className="text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
        </div>

        <div className="text-center">
          <Link
            to="/auth/forgot-password"
            className="text-primary hover:underline"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    )
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
            Password reset!
          </h1>
          <p className="text-muted-foreground">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
        </div>

        <div className="text-center">
          <Link to="/auth/login">
            <Button className="gap-2">
              <Lock size={16} />
              Sign in with new password
            </Button>
          </Link>
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
          Set new password
        </h1>
        <p className="text-muted-foreground">
          Create a strong password for your account
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl">New password</CardTitle>
          <CardDescription>
            Choose a password you haven't used before
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
            <div className="space-y-2">
              <FormInput
                label="New Password"
                name="password"
                type="password"
                placeholder="Enter new password"
                registration={register('password')}
                error={errors.password?.message}
                required
                disabled={isLoading}
              />
              <PasswordStrength password={password || ''} />
            </div>

            <FormInput
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              registration={register('confirmPassword')}
              error={errors.confirmPassword?.message}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Resetting password...
                </>
              ) : (
                'Reset password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}