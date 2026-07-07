/**
 * AI Document Generator Service
 * Powered by Google Gemini - 100% Free
 */

const GEMINI_API_KEY = 'AQ.Ab8RN6IxcKAe0_sz_bnxXxcg97Sj3jZEgSjfYNQTzU4LuXYlSQ'  // ← Your Gemini API key

/**
 * Document types and their templates
 */
export const DOCUMENT_TYPES = [
  { id: 'article', label: 'Article', icon: '📄', description: 'Blog posts & articles' },
  { id: 'report', label: 'Report', icon: '📊', description: 'Business & research reports' },
  { id: 'proposal', label: 'Proposal', icon: '📋', description: 'Project & business proposals' },
  { id: 'email', label: 'Email', icon: '✉️', description: 'Professional emails' },
  { id: 'letter', label: 'Letter', icon: '💌', description: 'Cover letters & formal letters' },
  { id: 'guide', label: 'Guide', icon: '📖', description: 'How-to guides & tutorials' },
  { id: 'summary', label: 'Summary', icon: '📝', description: 'Summaries & briefs' },
  { id: 'social', label: 'Social Media', icon: '📱', description: 'Social media posts' },
]

/**
 * Tone options
 */
export const TONES = [
  { id: 'professional', label: 'Professional', icon: '👔' },
  { id: 'casual', label: 'Casual', icon: '😊' },
  { id: 'persuasive', label: 'Persuasive', icon: '🎯' },
  { id: 'informative', label: 'Informative', icon: '📚' },
  { id: 'creative', label: 'Creative', icon: '🎨' },
]

/**
 * Length options
 */
export const LENGTHS = [
  { id: 'short', label: 'Short', desc: '~300 words' },
  { id: 'medium', label: 'Medium', desc: '~600 words' },
  { id: 'long', label: 'Long', desc: '~1000 words' },
  { id: 'detailed', label: 'Detailed', desc: '~2000 words' },
]

/**
 * Generate document
 */
export async function generateDocument({
  topic,
  type = 'article',
  tone = 'professional',
  length = 'medium',
  additionalInstructions = '',
}) {
  const lengthGuide = {
    short: 'Keep it concise, around 300 words.',
    medium: 'Write about 600 words.',
    long: 'Write about 1000 words.',
    detailed: 'Write a comprehensive document of about 2000 words.',
  }

  const typeInstructions = {
    article: 'Write a well-structured article with an engaging title, introduction, body paragraphs with subheadings, and a conclusion.',
    report: 'Write a formal report with an executive summary, introduction, findings, analysis, and recommendations.',
    proposal: 'Write a persuasive proposal with an executive summary, problem statement, proposed solution, timeline, and budget.',
    email: 'Write a professional email with a clear subject line, greeting, body, and signature.',
    letter: 'Write a formal letter with proper formatting, date, address, salutation, body, and closing.',
    guide: 'Write a step-by-step guide with clear instructions, tips, and examples.',
    summary: 'Create a concise summary with key points and main takeaways.',
    social: 'Write engaging social media content with hashtags and call-to-action.',
  }

  const prompt = `Create a ${type} about: "${topic}"

Requirements:
- Tone: ${tone}
- Length: ${lengthGuide[length]}
- Format: ${typeInstructions[type]}
${additionalInstructions ? `- Additional instructions: ${additionalInstructions}` : ''}

Make it professional, well-structured, and ready to use. Use markdown formatting for headers, lists, and emphasis.`

  const systemInstruction = `You are an expert content writer and document creator. 
Create high-quality, professional documents that are ready to use.
Use proper formatting with headings, paragraphs, lists, and emphasis.
Make the content engaging, well-researched, and valuable.
Always deliver complete, polished documents.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: prompt }]
          }],
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Generation failed')
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error('No content generated')
    }

    return {
      success: true,
      content: text,
      model: 'Gemini 2.5 Flash',
    }
  } catch (error) {
    console.error('Document generation error:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate document',
    }
  }
}
