import { cn } from '@/lib/utils'

/**
 * Shimmer Component
 * 
 * A loading placeholder with a shimmer animation.
 * Used for skeleton screens while content loads.
 * 
 * @param {string} className - Additional classes for sizing
 */
export function Shimmer({ className }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-muted',
        'before:absolute before:inset-0',
        'before:animate-shimmer',
        'before:bg-gradient-to-r',
        'before:from-transparent before:via-white/10 before:to-transparent',
        className
      )}
    />
  )
}

// Add this to your tailwind.config.js or index.css:
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
// .animate-shimmer {
//   animation: shimmer 2s infinite;
// }