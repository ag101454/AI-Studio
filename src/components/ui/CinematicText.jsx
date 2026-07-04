import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * CinematicText Component
 * 
 * Premium text animation with:
 * - Letter-by-letter reveal with 3D depth
 * - Cinematic glow effect
 * - Smooth fade-in with stagger
 * - Gradient shimmer on complete
 * 
 * @param {string} text - Text to animate
 * @param {string} className - Additional classes
 * @param {number} speed - Speed per character in ms
 * @param {boolean} isActive - Whether to start animation
 * @param {function} onComplete - Callback when done
 */
export function CinematicText({
  text = '',
  className,
  speed = 80,
  isActive = true,
  onComplete,
}) {
  const [visibleChars, setVisibleChars] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const chars = text.split('')
  
  useEffect(() => {
    if (!isActive || !text) return
    
    setVisibleChars(0)
    setIsDone(false)
    
    let index = 0
    const interval = setInterval(() => {
      index++
      setVisibleChars(index)
      
      if (index >= chars.length) {
        clearInterval(interval)
        setTimeout(() => {
          setIsDone(true)
          onComplete?.()
        }, 300)
      }
    }, speed)
    
    return () => clearInterval(interval)
  }, [text, speed, isActive, onComplete, chars.length])

  return (
    <div className={cn('relative inline-block', className)}>
      {/* Ambient glow behind text */}
      {isDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
          className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl"
        />
      )}

      {/* Text container with perspective */}
      <div className="relative perspective-1000">
        {chars.map((char, index) => {
          const isVisible = index < visibleChars
          const isSpace = char === ' '
          
          return (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : 20,
                rotateX: isVisible ? 0 : 45,
                scale: isVisible ? 1 : 0.8,
                filter: isVisible 
                  ? 'blur(0px) brightness(1)' 
                  : 'blur(4px) brightness(0.5)',
              }}
              transition={{
                duration: 0.4,
                delay: 0,
                ease: [0.4, 0, 0.2, 1],
              }}
              className={cn(
                'inline-block',
                isSpace ? 'w-[0.3em]' : '',
                isVisible && 'animate-in'
              )}
              style={{
                transformStyle: 'preserve-3d',
                textShadow: isVisible 
                  ? '0 2px 10px rgba(99, 102, 241, 0.3), 0 0 40px rgba(139, 92, 246, 0.15)' 
                  : 'none',
              }}
            >
              {/* 3D Shadow layer */}
              <span
                className="absolute inset-0 text-transparent"
                style={{
                  textShadow: isVisible
                    ? '0 1px 0 rgba(0,0,0,0.08), 0 2px 0 rgba(0,0,0,0.06), 0 3px 5px rgba(0,0,0,0.1)'
                    : 'none',
                }}
                aria-hidden="true"
              >
                {char}
              </span>

              {/* Main character with gradient */}
              <span className={cn(
                'relative bg-gradient-to-br from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent',
                isDone && 'animate-shimmer bg-[length:200%_auto]'
              )}>
                {char}
              </span>
            </motion.span>
          )
        })}

        {/* Blinking cursor while typing */}
        {!isDone && (
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-[3px] h-[0.9em] bg-primary ml-1 align-middle rounded-full"
            style={{
              boxShadow: '0 0 10px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.3)',
            }}
          />
        )}
      </div>
    </div>
  )
}