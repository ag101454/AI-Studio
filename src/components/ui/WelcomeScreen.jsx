import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function WelcomeScreen({ onComplete }) {
  const [visibleLetters, setVisibleLetters] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const [showTagline, setShowTagline] = useState(false)
  const audioContextRef = useRef(null)

  const fullText = 'AI Studio'
  const letters = fullText.split('')

  /**
   * Play authentic mechanical keyboard sound
   * 5-layer Cherry MX Blue switch simulation
   */
  const playKeySound = (index) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }

      const ctx = audioContextRef.current
      const now = ctx.currentTime
      const isSpace = letters[index] === ' '

      const randomFreq = 500 + Math.random() * 600
      const randomVol = 0.04 + Math.random() * 0.03

      // Layer 1: Deep thud (key bottoming out)
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'triangle'
      osc1.frequency.setValueAtTime(randomFreq * 0.25, now)
      osc1.frequency.exponentialRampToValueAtTime(30, now + 0.04)
      gain1.gain.setValueAtTime(randomVol * 0.7, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.05)

      // Layer 2: High click (switch actuation)
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'square'
      osc2.frequency.setValueAtTime(randomFreq * 1.8, now)
      osc2.frequency.exponentialRampToValueAtTime(randomFreq * 0.6, now + 0.015)
      gain2.gain.setValueAtTime(randomVol * 0.35, now)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.025)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(now)
      osc2.stop(now + 0.025)

      // Layer 3: Tactile bump
      const osc3 = ctx.createOscillator()
      const gain3 = ctx.createGain()
      osc3.type = 'sine'
      osc3.frequency.setValueAtTime(randomFreq * 1.2, now)
      osc3.frequency.exponentialRampToValueAtTime(randomFreq * 0.3, now + 0.02)
      gain3.gain.setValueAtTime(randomVol * 0.25, now)
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
      osc3.connect(gain3)
      gain3.connect(ctx.destination)
      osc3.start(now)
      osc3.stop(now + 0.03)

      // Layer 4: White noise rattle
      const bufferSize = ctx.sampleRate * 0.035
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.004))
      }
      const noise = ctx.createBufferSource()
      const gain4 = ctx.createGain()
      noise.buffer = buffer
      gain4.gain.setValueAtTime(randomVol * 0.2, now)
      gain4.gain.exponentialRampToValueAtTime(0.001, now + 0.035)
      noise.connect(gain4)
      gain4.connect(ctx.destination)
      noise.start(now)
      noise.stop(now + 0.035)

      // Layer 5: Keycap resonance
      const osc5 = ctx.createOscillator()
      const gain5 = ctx.createGain()
      osc5.type = 'sine'
      osc5.frequency.setValueAtTime(2800, now)
      osc5.frequency.exponentialRampToValueAtTime(1200, now + 0.01)
      gain5.gain.setValueAtTime(randomVol * 0.12, now)
      gain5.gain.exponentialRampToValueAtTime(0.001, now + 0.015)
      osc5.connect(gain5)
      gain5.connect(ctx.destination)
      osc5.start(now)
      osc5.stop(now + 0.015)

      // Space bar - deeper sound
      if (isSpace) {
        const oscSpace = ctx.createOscillator()
        const gainSpace = ctx.createGain()
        oscSpace.type = 'triangle'
        oscSpace.frequency.setValueAtTime(90, now)
        oscSpace.frequency.exponentialRampToValueAtTime(25, now + 0.08)
        gainSpace.gain.setValueAtTime(0.1, now)
        gainSpace.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
        oscSpace.connect(gainSpace)
        gainSpace.connect(ctx.destination)
        oscSpace.start(now)
        oscSpace.stop(now + 0.1)

        const bufferSizeSpace = ctx.sampleRate * 0.06
        const bufferSpace = ctx.createBuffer(1, bufferSizeSpace, ctx.sampleRate)
        const dataSpace = bufferSpace.getChannelData(0)
        for (let i = 0; i < bufferSizeSpace; i++) {
          dataSpace[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008))
        }
        const noiseSpace = ctx.createBufferSource()
        const gainSpaceNoise = ctx.createGain()
        noiseSpace.buffer = bufferSpace
        gainSpaceNoise.gain.setValueAtTime(0.06, now)
        gainSpaceNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
        noiseSpace.connect(gainSpaceNoise)
        gainSpaceNoise.connect(ctx.destination)
        noiseSpace.start(now)
        noiseSpace.stop(now + 0.06)
      }
    } catch (e) {
      // Silently fail
    }
  }

  /**
   * Play enter key sound
   */
  const playEnterSound = () => {
    try {
      const ctx = audioContextRef.current
      if (!ctx) return
      const now = ctx.currentTime

      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'triangle'
      osc1.frequency.setValueAtTime(140, now)
      osc1.frequency.exponentialRampToValueAtTime(20, now + 0.2)
      gain1.gain.setValueAtTime(0.15, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.25)

      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'square'
      osc2.frequency.setValueAtTime(800, now + 0.05)
      osc2.frequency.exponentialRampToValueAtTime(200, now + 0.1)
      gain2.gain.setValueAtTime(0.04, now + 0.05)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(now + 0.05)
      osc2.stop(now + 0.12)

      const bufferSize = ctx.sampleRate * 0.15
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02))
      }
      const noise = ctx.createBufferSource()
      const gain3 = ctx.createGain()
      noise.buffer = buffer
      gain3.gain.setValueAtTime(0.05, now)
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
      noise.connect(gain3)
      gain3.connect(ctx.destination)
      noise.start(now)
      noise.stop(now + 0.15)
    } catch (e) {}
  }

  /**
   * Play startup chime
   */
  const playStartupChime = () => {
    try {
      const ctx = audioContextRef.current
      if (!ctx) return
      const now = ctx.currentTime

      const notes = [523.25, 659.25, 783.99]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.15)
        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(0.06, now + i * 0.15 + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.5)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.15)
        osc.stop(now + i * 0.15 + 0.5)
      })
    } catch (e) {}
  }

  /**
   * Start typing animation
   */
  useEffect(() => {
    const startTimer = setTimeout(() => {
      playStartupChime()

      let index = 0
      const typingSpeed = 160

      const typeInterval = setInterval(() => {
        playKeySound(index)
        index++
        setVisibleLetters(index)

        if (index >= letters.length) {
          clearInterval(typeInterval)
          setShowCursor(false)
          setIsComplete(true)

          setTimeout(() => playEnterSound(), 300)
          setTimeout(() => setShowTagline(true), 600)
          setTimeout(() => onComplete?.(), 2500)
        }
      }, typingSpeed)

      return () => clearInterval(typeInterval)
    }, 600)

    return () => {
      clearTimeout(startTimer)
      if (audioContextRef.current) audioContextRef.current.close()
    }
  }, [onComplete, letters.length])

  const handleSkip = () => {
    if (audioContextRef.current) audioContextRef.current.close()
    onComplete?.()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #faf6ed 0%, #f5ecd7 30%, #e8d9b0 60%, #fdfaf2 100%)',
        }}
      >
        {/* Malt texture pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #9e6b08 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Warm honey light orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-300/15 blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-yellow-200/20 blur-[120px]" />
        <div className="absolute top-2/3 left-1/3 w-[300px] h-[300px] rounded-full bg-orange-200/15 blur-[100px]" />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, scale: 0 }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0, 1.2, 0],
                y: [`${Math.random() * 100}%`, `${Math.random() * 100 - 20}%`],
              }}
              transition={{
                duration: 3 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: 'easeInOut',
              }}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: `hsl(${38 + Math.random() * 10}, ${60 + Math.random() * 30}%, ${55 + Math.random() * 25}%)`,
                boxShadow: '0 0 8px currentColor',
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-4">
          {/* Logo Mark */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
            className="inline-flex items-center justify-center mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-turmeric-500/20 blur-xl"
              />
              <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-turmeric-500 to-turmeric-600 shadow-2xl shadow-turmeric-500/30 border border-turmeric-400/30">
                <span className="font-heading text-2xl font-bold text-malt-50">AI</span>
              </div>
            </div>
          </motion.div>

          {/* Typing Text */}
          <div className="relative">
            <h1
              className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight"
              style={{
                color: '#3d2e14',
                textShadow: '0 2px 4px rgba(61, 46, 20, 0.08)',
              }}
            >
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: index < visibleLetters ? 1 : 0,
                    y: index < visibleLetters ? 0 : 10,
                  }}
                  transition={{ duration: 0.08 }}
                  className="inline-block"
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}

              {/* Blinking Cursor */}
              {showCursor && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                  className="inline-block w-[4px] h-[0.75em] ml-1 align-middle rounded-full"
                  style={{ backgroundColor: '#c8870a' }}
                />
              )}
            </h1>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: showTagline ? 0.65 : 0, y: showTagline ? 0 : 15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mt-6 text-xl sm:text-2xl font-medium"
            style={{ color: '#9c8c62' }}
          >
            Your AI Creative Platform
          </motion.p>

          {/* Progress Bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: visibleLetters / letters.length }}
            transition={{ duration: 0.1 }}
            className="mt-8 mx-auto w-40 h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: '#f5ecd7' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #c8870a, #e6a817, #f0c75e)' }}
            />
          </motion.div>

          {/* Hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ delay: 1.5 }}
            className="mt-6 text-sm"
            style={{ color: '#b8a87e' }}
          >
            {isComplete ? 'Launching your studio...' : 'Initializing...'}
          </motion.p>
        </div>

        {/* Skip Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2 }}
          onClick={handleSkip}
          className="absolute bottom-8 right-8 text-sm font-medium transition-all hover:opacity-60"
          style={{ color: '#b8a87e' }}
        >
          Skip intro
        </motion.button>

        {/* Sound Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-8 flex items-center gap-2 text-xs"
          style={{ color: '#d4c9a8' }}
        >
          <span>⌨️</span>
          <span>Mechanical keyboard sound</span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}