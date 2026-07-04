import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

/**
 * AuthLayout Component
 * 
 * Layout for authentication pages (login, register, etc.)
 * 
 * Differences from DashboardLayout:
 * - No sidebar or navbar
 * - Centered card layout
 * - Theme toggle in top corner
 * - Clean, minimal design
 * 
 * Why a separate layout:
 * - Auth pages have completely different UI needs
 * - No navigation elements needed
 * - Focused on the form, not dashboard features
 */
export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar with logo and theme toggle */}
      <div className="flex items-center justify-between p-4 lg:p-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">AI</span>
          </div>
          <span className="font-heading text-lg font-semibold text-foreground">
            AI Studio
          </span>
        </a>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 AI Studio. All rights reserved.
        </p>
      </div>
    </div>
  )
}