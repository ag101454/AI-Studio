import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { hoverScale } from '@/utils/animations'

/**
 * AnimatedCard Component
 * 
 * A card with hover animation and optional glow effect.
 * 
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional classes
 * @param {boolean} glow - Add glow effect on hover
 */
export function AnimatedCard({ children, className, glow = false }) {
  return (
    <motion.div
      {...hoverScale}
      className={cn(
        'relative rounded-xl border border-border bg-card p-6 transition-shadow duration-300',
        'hover:shadow-xl hover:border-primary/20',
        glow && 'hover:shadow-primary/10 hover:shadow-2xl',
        className
      )}
    >
      {/* Glow Effect */}
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}