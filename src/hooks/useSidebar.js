import { useState, useCallback } from 'react'

/**
 * Custom hook for sidebar state management.
 * 
 * Why this is a custom hook:
 * 1. Reusability: Any component can access sidebar state
 * 2. Separation of concerns: State logic separate from UI
 * 3. Testability: Can test sidebar logic without rendering components
 * 4. Consistency: Same behavior everywhere
 * 
 * In the future, this could sync with localStorage to remember
 * the user's sidebar preference across sessions.
 */
export function useSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  /**
   * Toggle desktop sidebar.
   * useCallback prevents unnecessary re-renders of child components
   * that receive this function as a prop.
   */
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  /**
   * Toggle mobile sidebar.
   */
  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev)
  }, [])

  /**
   * Close mobile sidebar (used when navigating).
   */
  const closeMobile = useCallback(() => {
    setIsMobileOpen(false)
  }, [])

  return {
    isOpen,
    isMobileOpen,
    toggle,
    toggleMobile,
    closeMobile,
  }
}