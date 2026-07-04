import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * TypingText Component
 * 
 * Creates a stunning 3D letter-by-letter typing animation.
 * 
 * Features:
 * - Letters fly in from random directions
 * - 3D perspective effect
 * - Gradient text color
 * - Glowing cursor
 * - Configurable speed
 * 
 * @param {string} text - Text to animate
 * @param {string} className - Additional classes
 * @param {number} speed - Typing speed in ms per character
 * @param {boolean} showCursor - Show blinking cursor
 * @param {function} onComplete - Callback when typing finishes
 */
export function TypingText({
  text = '',
  className,
  speed = 80,
  showCursor = true,
  onComplete,
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const indexRef = useRef(0)
  const timeoutRef = useRef(null)

  useEffect(() => {
    // Reset on text change
    setDisplayedText('')
    setIsComplete(false)
    indexRef.current = 0

    if (!text) return

    const typeNextChar = () => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1))
        indexRef.current++
        
        // Randomize speed slightly for natural feel
        const randomSpeed = speed + Math.random() * 40 - 20
        timeoutRef.current = setTimeout(typeNextChar, randomSpeed)
      } else {
        setIsComplete(true)
        onComplete?.()
      }
    }

    // Small initial delay
    timeoutRef.current = setTimeout(typeNextChar, 300)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, speed, onComplete])

  return (
    <div className={cn('relative inline-block', className)}>
      {/* Text with 3D effect */}
      <div className="relative">
        {/* Shadow layer for 3D depth */}
        <span
          className="absolute inset-0 text-transparent"
          style={{
            textShadow: '0 1px 0 rgba(0,0,0,0.1), 0 2px 0 rgba(0,0,0,0.1), 0 3px 0 rgba(0,0,0,0.1), 0 4px 5px rgba(0,0,0,0.15)',
            WebkitTextStroke: '2px rgba(0,0,0,0.05)',
          }}
          aria-hidden="true"
        >
          {displayedText}
        </span>

        {/* Main text with gradient */}
        <span className="relative bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {displayedText}
        </span>
      </div>

      {/* Blinking Cursor */}
      {showCursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-[3px] h-[1em] bg-primary ml-0.5 align-middle rounded-full"
        />
      )}

      {/* Letter-by-letter flying animation */}
      <AnimatePresence>
        {displayedText.split('').map((char, index) => {
          // Only animate the last few characters
          if (index < displayedText.length - 3) return null
          
          const isLast = index === displayedText.length - 1
          return (
            <motion.span
              key={index}
              initial={{
                opacity: 0,
                y: Math.random() * 40 - 20,
                x: Math.random() * 30 - 15,
                rotateX: Math.random() * 90 - 45,
                scale: 0.5,
              }}
              animate={{
                opacity: 1,
                y: 0,
                x: 0,
                rotateX: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
              }}
              className="absolute"
              style={{
                left: `${index * 0.6}em`,
                color: 'transparent',
              }}
              aria-hidden="true"
            >
              {char}
            </motion.span>
          )
        })}
      </AnimatePresence>
    </div>
  )
}