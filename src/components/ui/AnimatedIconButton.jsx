import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * AnimatedIconButton Component
 * 
 * An icon button with press animation and ripple effect.
 * 
 * @param {React.ReactNode} icon - Icon component
 * @param {string} label - Aria label
 * @param {function} onClick - Click handler
 * @param {string} className - Additional classes
 */
export function AnimatedIconButton({ icon, label, onClick, className }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        className={cn('relative overflow-hidden', className)}
        aria-label={label}
      >
        {/* Ripple Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
        {icon}
      </Button>
    </motion.div>
  )
}