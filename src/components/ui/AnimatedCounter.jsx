import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * AnimatedCounter Component
 * 
 * Counts up from 0 to the target number when scrolled into view.
 * Used for statistics on the landing page and dashboard.
 * 
 * @param {number} value - Target number to count to
 * @param {string} suffix - Text after the number (e.g., "K+", "%")
 * @param {number} duration - Animation duration in ms
 */
export function AnimatedCounter({ value, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true
      
      let startTime = null
      const startValue = 0
      const endValue = typeof value === 'string' ? parseFloat(value) : value

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = Math.floor(startValue + (endValue - startValue) * eased)
        
        setCount(current)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(endValue)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [isInView, value, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}