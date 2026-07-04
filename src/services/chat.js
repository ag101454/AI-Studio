/**
 * AI Chat Service - Google Gemini
 * Free AI chat using Google's Gemini API.
 * Model: gemini-2.5-flash (latest, fastest, free)
 */

// ⚠️ PASTE YOUR GEMINI API KEY HERE
const GEMINI_API_KEY = 'AQ.Ab8RN6IJ9ww78zUJyoyvVNFW9dxvhF2X5GxCzkVDGURCIEyAYw'  // ← Your API key

/**
 * Send message to Gemini AI and get response
 */
export async function sendMessage(messages) {
  try {
    // Build conversation
    const contents = []
    let systemText = ''

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemText = msg.content
      } else if (msg.role === 'user') {
        contents.push({
          role: 'user',
          parts: [{ text: msg.content }]
        })
      } else if (msg.role === 'assistant') {
        contents.push({
          role: 'model',
          parts: [{ text: msg.content }]
        })
      }
    }

    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    }

    if (systemText) {
      requestBody.systemInstruction = {
        parts: [{ text: systemText }]
      }
    }

    // Call Gemini API with the correct model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    )

    const data = await response.json()

    // Check for errors
    if (!response.ok) {
      throw new Error(data.error?.message || `API Error: ${response.status}`)
    }

    // Get the response text
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error('No response generated')
    }

    return {
      success: true,
      message: text,
    }
  } catch (error) {
    console.error('Gemini Error:', error)
    return {
      success: false,
      error: error.message || 'Failed to get AI response',
    }
  }
}