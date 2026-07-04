import { useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * FormInput Component
 * 
 * A reusable form input with built-in features:
 * - Label (optional)
 * - Error message display
 * - Password show/hide toggle
 * - Helper text
 * - Required indicator
 * - Accessible error announcements
 * 
 * Why this component exists:
 * - Every form needs consistent input styling
 * - Password fields need show/hide toggle everywhere
 * - Error states should look identical across the app
 * - Reduces code duplication by 80%+ in forms
 * 
 * @param {string} label - Input label text
 * @param {string} name - Input name (for form registration)
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {string} error - Error message to display
 * @param {string} helperText - Helper text below input
 * @param {boolean} required - Show required indicator
 * @param {object} registration - React Hook Form registration object
 * @param {string} className - Additional classes
 */
export function FormInput({
  label,
  name,
  type = 'text',
  error,
  helperText,
  required = false,
  registration,
  className,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            'text-sm font-medium',
            error ? 'text-destructive' : 'text-foreground'
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      {/* Input Container */}
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={inputType}
          {...registration}
          {...props}
          className={cn(
            'transition-all duration-200',
            error && 'border-destructive focus-visible:ring-destructive/20',
            isPassword && 'pr-10',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />

        {/* Password Toggle Button */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div
          id={`${name}-error`}
          className="flex items-center gap-1.5 text-xs text-destructive animate-in slide-in-from-top-1"
          role="alert"
        >
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text (only show when no error) */}
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
}