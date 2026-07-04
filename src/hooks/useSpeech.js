import { useCallback, useEffect, useState } from 'react'

/**
 * useSpeech Hook
 * 
 * Premium text-to-speech with deep, mature voice selection.
 * 
 * Voice selection priority:
 * 1. Google UK Male (deep, authoritative)
 * 2. Daniel (British English, mature)
 * 3. Google US Male
 * 4. Any deep-pitched male voice
 */
export function useSpeech() {
  const [voices, setVoices] = useState([])

  // Load available voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) return

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
    }

    // Voices load asynchronously in Chrome
    window.speechSynthesis.onvoiceschanged = loadVoices
    loadVoices()

    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  /**
   * Find the best deep, mature voice available.
   * Priority order for premium sound.
   */
  const findBestVoice = useCallback(() => {
    const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices()

    // Priority list of deep, mature voices
    const preferredVoices = [
      // Google voices (deepest, most natural)
      { name: 'Google UK Male', priority: 1 },
      { name: 'Google US English Male', priority: 2 },
      { name: 'Daniel', priority: 3 },           // macOS British male
      { name: 'Alex', priority: 4 },              // macOS US male
      { name: 'Fred', priority: 5 },              // macOS deep male
      // Windows voices
      { name: 'Microsoft David', priority: 6 },
      { name: 'Microsoft Mark', priority: 7 },
    ]

    // Try to find a preferred voice
    for (const preferred of preferredVoices) {
      const found = currentVoices.find((v) => 
        v.name.includes(preferred.name) || 
        v.name.toLowerCase().includes(preferred.name.toLowerCase())
      )
      if (found) return found
    }

    // Fallback: Find any English male voice with deep pitch
    const englishMale = currentVoices.find(
      (v) => v.lang.startsWith('en') && 
      (v.name.toLowerCase().includes('male') || 
       v.name.toLowerCase().includes('david') ||
       v.name.toLowerCase().includes('james'))
    )
    if (englishMale) return englishMale

    // Last resort: any English voice
    return currentVoices.find((v) => v.lang.startsWith('en')) || null
  }, [voices])

  /**
   * Speak text with deep, mature voice configuration.
   * 
   * @param {string} text - Text to speak
   * @param {object} options - Override default options
   * @returns {Promise} - Resolves when speech completes
   */
  const speak = useCallback((text, options = {}) => {
    return new Promise((resolve) => {
      // Check browser support
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported')
        resolve()
        return
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      
      // Premium deep voice settings
      utterance.rate = options.rate || 0.8        // Slower = more authoritative
      utterance.pitch = options.pitch || 0.75     // Lower pitch = deeper voice
      utterance.volume = options.volume || 0.9    // Slightly louder for impact

      // Add emphasis and pauses
      utterance.rate = text.includes('Welcome') ? 0.75 : 0.85
      utterance.pitch = text.includes('Welcome') ? 0.7 : 0.8

      // Select the best deep voice
      const bestVoice = findBestVoice()
      if (bestVoice) {
        utterance.voice = bestVoice
        console.log('🎤 Using voice:', bestVoice.name)
      }

      // Handle events
      utterance.onend = () => {
        // Small pause between phrases for dramatic effect
        setTimeout(() => resolve(), 200)
      }
      
      utterance.onerror = (error) => {
        console.warn('Speech error:', error)
        resolve()
      }

      window.speechSynthesis.speak(utterance)
    })
  }, [findBestVoice])

  return { speak, voices }
}