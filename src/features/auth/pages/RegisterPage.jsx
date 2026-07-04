import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FormInput } from '@/components/ui/FormInput'
import { PasswordStrength } from '@/features/auth/components/PasswordStrength'
import { registerSchema } from '@/features/auth/validation'
import { useAuth } from '@/context/AuthContext'

export function RegisterPage() {
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)
  
  const { signUp, signInWithGoogle, signInWithGitHub } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  })

  const password = watch('password')

  /**
   * Handle email/password registration
   */
  const onSubmit = async (data) => {
    setServerError('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      const result = await signUp(data.email, data.password, data.name)
      
      if (result.success) {
        setSuccessMessage(
          'Account created! Please check your email for a verification link. You can sign in after verifying.'
        )
        // Don't navigate - let user read the message
      } else {
        setServerError(result.error || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle Google sign up
   */
  const handleGoogleSignUp = async () => {
    setServerError('')
    setGoogleLoading(true)
    
    try {
      await signInWithGoogle()
    } catch (err) {
      setServerError('Google sign up failed. Please try again.')
      setGoogleLoading(false)
    }
  }

  /**
   * Handle GitHub sign up
   */
  const handleGithubSignUp = async () => {
    setServerError('')
    setGithubLoading(true)
    
    try {
      await signInWithGitHub()
    } catch (err) {
      setServerError('GitHub sign up failed. Please try again.')
      setGithubLoading(false)
    }
  }

  // Show success state
  if (successMessage) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Check your email!
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {successMessage}
          </p>
        </div>

        <div className="text-center space-y-4">
          <Button
            onClick={() => navigate('/auth/login')}
            className="gap-2"
          >
            Go to Sign In
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Didn't receive the email?{' '}
            <button
              onClick={() => setSuccessMessage('')}
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Create an account
        </h1>
        <p className="text-muted-foreground">
          Start your AI journey today
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl">Sign up</CardTitle>
          <CardDescription>
            Choose your preferred sign up method
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Error Message */}
          {serverError && (
            <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Social Sign Up Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-3 h-11 font-normal"
              onClick={handleGoogleSignUp}
              disabled={googleLoading || isLoading}
            >
              {googleLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full gap-3 h-11 font-normal"
              onClick={handleGithubSignUp}
              disabled={githubLoading || isLoading}
            >
              {githubLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              )}
              Continue with GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-4 text-muted-foreground">
                Or register with email
              </span>
            </div>
          </div>

          {/* Email Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Full Name"
              name="name"
              type="text"
              placeholder="John Doe"
              registration={register('name')}
              error={errors.name?.message}
              required
              disabled={isLoading}
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="name@example.com"
              registration={register('email')}
              error={errors.email?.message}
              required
              disabled={isLoading}
            />

            <div className="space-y-2">
              <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                registration={register('password')}
                error={errors.password?.message}
                required
                disabled={isLoading}
              />
              <PasswordStrength password={password || ''} />
            </div>

            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              registration={register('confirmPassword')}
              error={errors.confirmPassword?.message}
              required
              disabled={isLoading}
            />

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox
                {...register('agreeToTerms')}
                disabled={isLoading}
                className="mt-1"
              />
              <span className="text-sm text-muted-foreground">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-xs text-destructive flex items-center gap-1.5">
                <AlertTriangle size={12} />
                {errors.agreeToTerms.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Login Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}