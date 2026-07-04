import { motion } from 'framer-motion'
import { pageTransition } from '@/utils/animations'

/**
 * PageTransition Component
 * 
 * Wraps page content with smooth enter/exit animations.
 * Use this on every page for consistent transitions.
 * 
 * @param {React.ReactNode} children - Page content
 */
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
    >
      {children}
    </motion.div>
  )
}