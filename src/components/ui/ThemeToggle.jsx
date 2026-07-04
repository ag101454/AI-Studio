import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext'

/**
 * ThemeToggle Component
 * 
 * A button that toggles between light and dark mode.
 * 
 * Features:
 * - Animated sun/moon icon transition
 * - Accessible label
 * - Uses theme context
 * 
 * This is a reusable component - it can be placed anywhere:
 * - Navbar
 * - Settings page
 * - Mobile menu
 * - Any future location
 */
export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative text-muted-foreground hover:text-foreground"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sun icon */}
      <Sun
        size={18}
        className={`
          absolute transition-all duration-300
          ${isDark
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
          }
        `}
      />
      
      {/* Moon icon */}
      <Moon
        size={18}
        className={`
          absolute transition-all duration-300
          ${isDark
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0'
          }
        `}
      />
    </Button>
  )
}