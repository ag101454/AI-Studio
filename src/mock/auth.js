/**
 * Authentication Mock Data & API Handlers
 * 
 * Simulates backend authentication responses.
 * 
 * Future API Endpoints:
 * - POST /api/auth/login        → { user, token }
 * - POST /api/auth/register     → { user, token }
 * - POST /api/auth/forgot-password → { message }
 * - POST /api/auth/reset-password  → { message }
 * - POST /api/auth/verify-otp      → { verified: true }
 * - POST /api/auth/logout          → { message }
 * - GET  /api/auth/me              → { user }
 */

/**
 * Simulated network delay for realistic UX testing
 */
const simulateDelay = (ms = 1500) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Mock user database
 */
const mockUsers = [
  {
    id: 'user_1',
    email: 'demo@aistudio.com',
    password: 'Password123!',
    name: 'Alex Johnson',
    avatar: null,
    plan: 'pro',
    emailVerified: true,
  },
]

/**
 * Mock login API call.
 * Validates credentials and returns user + token.
 */
export async function mockLogin({ email, password }) {
  await simulateDelay(1500)

  // Find user by email
  const user = mockUsers.find((u) => u.email === email)

  // Check credentials
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password')
  }

  // Return success response
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      plan: user.plan,
    },
    token: 'mock_jwt_token_' + Date.now(),
    expiresIn: 3600,
  }
}

/**
 * Mock registration API call.
 * Validates input and creates user.
 */
export async function mockRegister({ name, email, password }) {
  await simulateDelay(1500)

  // Check if email already exists
  const existingUser = mockUsers.find((u) => u.email === email)
  if (existingUser) {
    throw new Error('An account with this email already exists')
  }

  // Create new user
  const newUser = {
    id: 'user_' + Date.now(),
    email,
    password,
    name,
    avatar: null,
    plan: 'free',
    emailVerified: false,
  }

  mockUsers.push(newUser)

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar,
      plan: newUser.plan,
    },
    token: 'mock_jwt_token_' + Date.now(),
    message: 'Registration successful! Please verify your email.',
  }
}

/**
 * Mock forgot password API call.
 * Sends reset link to email.
 */
export async function mockForgotPassword({ email }) {
  await simulateDelay(1500)

  // Check if email exists
  const user = mockUsers.find((u) => u.email === email)
  
  // Always return success to prevent email enumeration
  return {
    message: 'If an account exists with this email, we have sent a password reset link.',
  }
}

/**
 * Mock reset password API call.
 * Validates token and updates password.
 */
export async function mockResetPassword({ token, password }) {
  await simulateDelay(1500)

  // In production, validate token from email link
  if (!token || token.length < 10) {
    throw new Error('Invalid or expired reset token')
  }

  return {
    message: 'Password has been reset successfully.',
  }
}

/**
 * Mock OTP verification API call.
 */
export async function mockVerifyOTP({ email, code }) {
  await simulateDelay(1000)

  // Simulate OTP validation
  if (code !== '123456') {
    throw new Error('Invalid verification code')
  }

  return {
    verified: true,
    message: 'Email verified successfully.',
  }
}

/**
 * Mock social login API call.
 */
export async function mockSocialLogin({ provider, token }) {
  await simulateDelay(1000)

  return {
    user: {
      id: 'user_' + Date.now(),
      email: `${provider}_user@example.com`,
      name: `${provider} User`,
      avatar: null,
      plan: 'free',
    },
    token: 'mock_jwt_token_' + Date.now(),
  }
}