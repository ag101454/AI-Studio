/**
 * AI Voice Generator Service
 * Powered by Google Gemini + Web Speech API
 */

const GEMINI_API_KEY = 'AQ.Ab8RN6J3hmZ13NY7egPRwMKKWHj7HQTU57oZvLDbxrCS4Z_ZYA'  // ← Your Gemini API key

/**
 * Voice options
 */
export const VOICES = [
  { id: 'natural-male', label: 'James', gender: 'male', icon: '👨', description: 'Natural male voice' },
  { id: 'natural-female', label: 'Emma', gender: 'female', icon: '👩', description: 'Natural female voice' },
  { id: 'deep-male', label: 'Michael', gender: 'male', icon: '🧔', description: 'Deep authoritative voice' },
  { id: 'warm-female', label: 'Sophia', gender: 'female', icon: '👩‍💼', description: 'Warm professional voice' },
  { id: 'british-male', label: 'William', gender: 'male', icon: '🎩', description: 'British English voice' },
  { id: 'british-female', label: 'Charlotte', gender: 'female', icon: '👑', description: 'British English voice' },
]

/**
 * Speed options
 */
export const SPEEDS = [
  { id: 'slow', label: 'Slow', value: 0.7, icon: '🐢' },
  { id: 'normal', label: 'Normal', value: 1.0, icon: '🚶' },
  { id: 'fast', label: 'Fast', value: 1.3, icon: '🏃' },
]

/**
 * Use cases / templates
 */
export const TEMPLATES = [
  { id: 'podcast', label: 'Podcast Intro', icon: '🎙️', text: 'Welcome to our show! Today we are going to explore the fascinating world of artificial intelligence and how it is transforming our daily lives.' },
  { id: 'presentation', label: 'Presentation', icon: '📊', text: 'Good morning everyone. Thank you for joining me today. I am excited to present our quarterly results and share our vision for the upcoming year.' },
  { id: 'story', label: 'Storytelling', icon: '📖', text: 'Once upon a time, in a world not so different from our own, there lived a curious inventor who dreamed of changing the world with technology.' },
  { id: 'greeting', label: 'Greeting', icon: '👋', text: 'Hello and welcome! We are thrilled to have you here. Our team has been working hard to create something special just for you.' },
  { id: 'meditation', label: 'Meditation', icon: '🧘', text: 'Close your eyes and take a deep breath. Feel the tension leaving your body as you relax into this moment of peace and tranquility.' },
  { id: 'commercial', label: 'Commercial', icon: '📢', text: 'Introducing the all-new AI Studio - your complete creative platform. Generate images, write code, create documents, and now, produce professional voiceovers in seconds.' },
]

/**
 * Generate text content using Gemini for voiceover scripts
 */
export async function generateVoiceScript({ topic, style = 'professional', length = 'medium' }) {
  const lengthGuide = {
    short: 'Keep it around 100 words.',
    medium: 'Write around 200 words.',
    long: 'Write around 400 words.',
  }

  const prompt = `Write a ${style} voiceover script about: "${topic}"
${lengthGuide[length]}
Make it engaging, natural-sounding, and perfect for text-to-speech.
Use natural pauses, emphasis, and conversational language.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      }
    )

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    return {
      success: true,
      content: text || topic,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Generate voiceover script for specific use case
 */
export async function generateVoiceForTemplate({ templateId, customText, additionalInstructions }) {
  if (customText) {
    return { success: true, content: customText }
  }

  const template = TEMPLATES.find(t => t.id === templateId)
  if (template) {
    return { success: true, content: template.text }
  }

  return { success: false, error: 'No template or text provided' }
}
