/**
 * AI Translator Service
 * Powered by Google Gemini - Supports 100+ languages
 */

const GEMINI_API_KEY = 'AQ.Ab8RN6IxcKAe0_sz_bnxXxcg97Sj3jZEgSjfYNQTzU4LuXYlSQ'  // ← Your Gemini API key

/**
 * Supported languages
 */
export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸', popular: true },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', popular: true },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', popular: true },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', popular: true },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹', popular: true },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹', popular: true },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺', popular: true },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵', popular: true },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷', popular: true },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳', popular: true },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', popular: true },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', popular: true },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷', popular: false },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱', popular: false },
  { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱', popular: false },
  { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪', popular: false },
  { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭', popular: false },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳', popular: false },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩', popular: false },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷', popular: false },
]

/**
 * Translation tones
 */
export const TONES = [
  { id: 'neutral', label: 'Neutral', icon: '😊' },
  { id: 'formal', label: 'Formal', icon: '👔' },
  { id: 'casual', label: 'Casual', icon: '😎' },
  { id: 'professional', label: 'Professional', icon: '💼' },
  { id: 'friendly', label: 'Friendly', icon: '🤝' },
]

/**
 * Quick phrases for demo
 */
export const QUICK_PHRASES = [
  { text: 'Hello, how are you today?', label: 'Greeting' },
  { text: 'Thank you for your help!', label: 'Gratitude' },
  { text: 'Where is the nearest restaurant?', label: 'Travel' },
  { text: 'I would like to schedule a meeting.', label: 'Business' },
  { text: 'Could you please repeat that?', label: 'Conversation' },
  { text: 'Have a wonderful day!', label: 'Farewell' },
]

/**
 * Translate text
 */
export async function translateText({
  text,
  sourceLanguage = 'auto',
  targetLanguage = 'es',
  tone = 'neutral',
}) {
  const sourceLang = sourceLanguage === 'auto' 
    ? 'auto-detect' 
    : LANGUAGES.find(l => l.code === sourceLanguage)?.name || 'auto-detect'
  
  const targetLang = LANGUAGES.find(l => l.code === targetLanguage)?.name || targetLanguage

  const toneInstructions = {
    neutral: 'Keep the translation neutral and accurate.',
    formal: 'Make the translation formal and polite.',
    casual: 'Make the translation casual and conversational.',
    professional: 'Make the translation professional and business-appropriate.',
    friendly: 'Make the translation warm and friendly.',
  }

  const prompt = `Translate the following text from ${sourceLang} to ${targetLang}.
${toneInstructions[tone] || toneInstructions.neutral}

Text to translate:
"${text}"

Return ONLY the translated text. Do not include explanations, quotes, or the original text.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    )

    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'Translation failed')

    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!translatedText) throw new Error('No translation generated')

    return {
      success: true,
      translatedText: translatedText.trim(),
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    }
  } catch (error) {
    console.error('Translation error:', error)
    return {
      success: false,
      error: error.message || 'Translation failed',
    }
  }
}

/**
 * Detect language of text
 */
export async function detectLanguage(text) {
  const prompt = `Detect the language of this text and return ONLY the language name in English:\n\n"${text}"`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0, maxOutputTokens: 50 },
        }),
      }
    )

    const data = await response.json()
    const language = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    return { success: true, language }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
