import { createContext, useContext, useState, useEffect } from 'react'

/**
 * Theme Context
 * 
 * Provides theme state and toggle function to the entire app.
 * 
 * Why Context API instead of prop drilling:
 * - Navbar needs the toggle button
 * - Sidebar needs current theme for icons
 * - Every page needs to know the theme for styling
 * - 50+ components would need to receive theme as props
 * 
 * Three sources of truth (in priority order):
 * 1. localStorage (user explicitly chose a theme)
 * 2. System preference (OS dark mode setting)
 * 3. Default (light mode)
 */
const ThemeContext = createContext(null)

/**
 * Custom hook to access theme context.
 * Throws an error if used outside ThemeProvider.
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

/**
 * ThemeProvider Component
 * 
 * Wraps the app and provides theme state.
 * Handles:
 * - Initial theme detection
 * - localStorage persistence
 * - System preference changes
 * - Class toggling on document.documentElement
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') {
      return stored
    }
    
    // Fall back to system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    
    // Default to light
    return 'light'
  })

  /**
   * Toggle between light and dark themes.
   * Updates state, localStorage, and DOM.
   */
  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', newTheme)
      return newTheme
    })
  }

  /**
   * Set a specific theme.
   */
  const setThemeMode = (mode) => {
    if (mode === 'light' || mode === 'dark') {
      setTheme(mode)
      localStorage.setItem('theme', mode)
    }
  }

  /**
   * Apply theme class to <html> element.
   * This is how Tailwind's dark mode works.
   */
  useEffect(() => {
    const root = document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  /**
   * Listen for system preference changes.
   * Only applies if user hasn't manually set a preference.
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      const stored = localStorage.getItem('theme')
      // Only auto-switch if user hasn't explicitly chosen
      if (!stored) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const value = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme: setThemeMode,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}