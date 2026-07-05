import { useState, useCallback } from 'react'

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
  const toggleMobile = useCallback(() => setIsMobileOpen((prev) => !prev), [])
  const closeMobile = useCallback(() => setIsMobileOpen(false), [])
  const setMobileOpen = useCallback((open) => setIsMobileOpen(open), [])

  return {
    isOpen,
    isMobileOpen,
    toggle,
    toggleMobile,
    closeMobile,
    setIsMobileOpen: setMobileOpen,
  }
}