import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * PasswordStrength Component
 * 
 * Shows real-time password requirements and strength indicator.
 * 
 * Features:
 * - Visual checklist of requirements
 * - Color-coded strength bar
 * - Real-time feedback as user types
 * 
 * @param {string} password - Current password value
 */
export function PasswordStrength({ password }) {
  /**
   * Check individual password requirements
   */
  const requirements = [
    {
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      label: 'One uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      label: 'One lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      label: 'One number',
      met: /[0-9]/.test(password),
    },
    {
      label: 'One special character',
      met: /[^A-Za-z0-9]/.test(password),
    },
  ]

  const metCount = requirements.filter((r) => r.met).length
  const strengthPercent = (metCount / requirements.length) * 100

  /**
   * Determine strength color and label
   */
  const getStrengthInfo = () => {
    if (metCount <= 2) return { color: 'bg-destructive', label: 'Weak' }
    if (metCount <= 3) return { color: 'bg-yellow-500', label: 'Fair' }
    if (metCount <= 4) return { color: 'bg-blue-500', label: 'Good' }
    return { color: 'bg-green-500', label: 'Strong' }
  }

  const strength = getStrengthInfo()

  return (
    <div className="space-y-2">
      {/* Strength Bar */}
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              i < metCount ? strength.color : 'bg-muted'
            )}
          />
        ))}
      </div>

      {/* Strength Label */}
      {password.length > 0 && (
        <p
          className={cn(
            'text-xs font-medium',
            metCount <= 2 && 'text-destructive',
            metCount === 3 && 'text-yellow-500',
            metCount === 4 && 'text-blue-500',
            metCount === 5 && 'text-green-500'
          )}
        >
          Password strength: {strength.label}
        </p>
      )}

      {/* Requirements Checklist */}
      <div className="space-y-1.5">
        {requirements.map((req, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center gap-2 text-xs transition-colors',
              req.met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
            )}
          >
            {req.met ? (
              <Check size={12} className="shrink-0" />
            ) : (
              <X size={12} className="shrink-0" />
            )}
            {req.label}
          </div>
        ))}
      </div>
    </div>
  )
}