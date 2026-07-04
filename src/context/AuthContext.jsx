import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Listen for auth state changes
   * This runs on page load and when user signs in/out
   */
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  /**
   * Sign up with email and password
   */
  const signUp = useCallback(async (email, password, name) => {
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) throw error

      return { 
        success: true, 
        user: data.user,
        message: 'Check your email for verification link!'
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(async (email, password) => {
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { success: true, user: data.user }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  /**
   * Sign in with Google
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err.message)
    }
  }, [])

  /**
   * Sign in with GitHub
   */
  const signInWithGitHub = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err.message)
    }
  }, [])

  /**
   * Send password reset email
   */
  const resetPassword = useCallback(async (email) => {
    setError(null)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset-password',
      })

      if (error) throw error

      return { 
        success: true, 
        message: 'Password reset link sent to your email!'
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  /**
   * Update password (after reset)
   */
  const updatePassword = useCallback(async (newPassword) => {
    setError(null)
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      return { success: true, message: 'Password updated successfully!' }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  /**
   * Sign out
   */
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }, [])

  const isAuthenticated = !!user

  const value = {
    user,
    session,
    isAuthenticated,
    isLoading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGitHub,
    resetPassword,
    updatePassword,
    signOut,
    setError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}