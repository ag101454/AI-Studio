import { useState, useEffect } from 'react'

/**
 * useWelcome Hook
 * 
 * Manages whether to show the welcome screen.
 * Only shows on first visit (uses sessionStorage).
 * 
 * sessionStorage vs localStorage:
 * - sessionStorage: Shows welcome once per browser session
 * - localStorage: Shows welcome once ever (until cleared)
 * 
 * We use sessionStorage so returning users in a new session
 * still get the welcome experience.
 */
export function useWelcome() {
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome')
    
    if (!hasSeenWelcome) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        setShowWelcome(true)
      }, 300)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const dismissWelcome = () => {
    sessionStorage.setItem('hasSeenWelcome', 'true')
    setShowWelcome(false)
  }

  return {
    showWelcome,
    dismissWelcome,
  }
}