/**
 * Animation Variants & Utilities
 * 
 * Centralized animation configurations for consistency.
 * Using Framer Motion variants for reusable animations.
 * 
 * Why centralized:
 * - Consistent timing across the app
 * - Easy to update all animations at once
 * - Prevents magic numbers scattered in components
 */

// Timing constants
export const DURATION = {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 0.7,
  }
  
  export const EASE = {
    smooth: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    easeOut: [0.0, 0.0, 0.2, 1],
    easeInOut: [0.4, 0.0, 0.2, 1],
  }
  
  /**
   * Fade in from bottom
   */
  export const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.normal, ease: EASE.easeOut },
    },
  }
  
  /**
   * Fade in from left
   */
  export const fadeInLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: DURATION.normal, ease: EASE.easeOut },
    },
  }
  
  /**
   * Fade in from right
   */
  export const fadeInRight = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: DURATION.normal, ease: EASE.easeOut },
    },
  }
  
  /**
   * Scale in
   */
  export const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: DURATION.normal, ease: EASE.easeOut },
    },
  }
  
  /**
   * Stagger children animation
   * Parent container applies this, children get staggered
   */
  export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }
  
  /**
   * Stagger item (use with staggerContainer)
   */
  export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.normal, ease: EASE.easeOut },
    },
  }
  
  /**
   * Page transition (for route changes)
   */
  export const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: DURATION.fast, ease: EASE.easeOut },
  }
  
  /**
   * Hover scale (for cards, buttons)
   */
  export const hoverScale = {
    whileHover: { scale: 1.02, transition: { duration: DURATION.fast } },
    whileTap: { scale: 0.98, transition: { duration: DURATION.fast } },
  }
  
  /**
   * Slide in from right (for side panels)
   */
  export const slideInRight = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: DURATION.slow, ease: EASE.smooth },
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: { duration: DURATION.normal, ease: EASE.easeOut },
    },
  }