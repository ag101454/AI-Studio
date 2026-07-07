/**
 * AI Email Writer Service
 * Powered by Google Gemini - Professional email generation
 */

const GEMINI_API_KEY = 'AQ.Ab8RN6IxcKAe0_sz_bnxXxcg97Sj3jZEgSjfYNQTzU4LuXYlSQ'  // ← Your Gemini API key

/**
 * Email types
 */
export const EMAIL_TYPES = [
  { id: 'business', label: 'Business', icon: '💼', description: 'Professional business emails' },
  { id: 'cold-outreach', label: 'Cold Outreach', icon: '🎯', description: 'Sales & outreach emails' },
  { id: 'follow-up', label: 'Follow Up', icon: '📌', description: 'Follow-up after meetings' },
  { id: 'thank-you', label: 'Thank You', icon: '🙏', description: 'Thank you & appreciation' },
  { id: 'introduction', label: 'Introduction', icon: '🤝', description: 'Introduction emails' },
  { id: 'proposal', label: 'Proposal', icon: '📋', description: 'Project & business proposals' },
  { id: 'complaint', label: 'Complaint', icon: '⚡', description: 'Professional complaints' },
  { id: 'newsletter', label: 'Newsletter', icon: '📰', description: 'Newsletter content' },
]

/**
 * Email tones
 */
export const TONES = [
  { id: 'professional', label: 'Professional', icon: '👔' },
  { id: 'friendly', label: 'Friendly', icon: '😊' },
  { id: 'persuasive', label: 'Persuasive', icon: '🎯' },
  { id: 'formal', label: 'Formal', icon: '📋' },
  { id: 'casual', label: 'Casual', icon: '✌️' },
]

/**
 * Email lengths
 */
export const LENGTHS = [
  { id: 'short', label: 'Short', desc: '2-3 paragraphs' },
  { id: 'medium', label: 'Medium', desc: '4-5 paragraphs' },
  { id: 'long', label: 'Detailed', desc: '6+ paragraphs' },
]

/**
 * Generate email
 */
export async function generateEmail({
  type = 'business',
  tone = 'professional',
  length = 'medium',
  recipient = '',
  sender = '',
  subject = '',
  keyPoints = '',
  additionalInstructions = '',
}) {
  const lengthGuide = {
    short: 'Keep it concise, 2-3 short paragraphs.',
    medium: 'Write 4-5 paragraphs.',
    long: 'Write a detailed email with 6+ paragraphs.',
  }

  const typeInstructions = {
    'business': 'Write a professional business email.',
    'cold-outreach': 'Write a compelling cold outreach email that grabs attention and gets responses.',
    'follow-up': 'Write a polite follow-up email that reminds without being pushy.',
    'thank-you': 'Write a warm thank you email showing genuine appreciation.',
    'introduction': 'Write an introduction email that creates a great first impression.',
    'proposal': 'Write a persuasive proposal email that clearly outlines value and next steps.',
    'complaint': 'Write a professional complaint email that is firm but respectful.',
    'newsletter': 'Write an engaging newsletter email that informs and interests readers.',
  }

  const prompt = `Write a ${tone} ${type} email.

DETAILS:
- From: ${sender || '[Sender Name]'}
- To: ${recipient || '[Recipient]'}
- Subject: ${subject || '[Subject]'}
- Key Points: ${keyPoints || 'General email'}
- Length: ${lengthGuide[length]}
- Additional: ${additionalInstructions || 'None'}

FORMAT THE EMAIL WITH:
1. Subject line
2. Professional greeting
3. Well-structured body paragraphs
4. Clear call-to-action
5. Professional signature

${typeInstructions[type] || typeInstructions.business}

Make it ready to send. Use proper email formatting with line breaks between sections.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: {
            parts: [{
              text: 'You are an expert email writer. Create professional, effective emails that get results. Use proper formatting, clear language, and compelling calls-to-action.'
            }]
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    )

    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'Generation failed')

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('No email generated')

    return {
      success: true,
      content: text,
      model: 'Gemini 2.5 Flash',
    }
  } catch (error) {
    console.error('Email generation error:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate email',
    }
  }
}

/**
 * Improve existing email
 */
export async function improveEmail({ currentEmail, improvements = 'Make it more professional and engaging' }) {
  const prompt = `Improve this email. ${improvements}

CURRENT EMAIL:
${currentEmail}

Return the improved email with proper formatting.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 2048 },
        }),
      }
    )

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    return { success: true, content: text || currentEmail }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Quick templates
 */
export const TEMPLATES = [
  {
    id: 'meeting-request',
    label: 'Meeting Request',
    icon: '📅',
    subject: 'Meeting Request: [Topic]',
    points: 'Propose a meeting to discuss [topic]. Suggest 2-3 time slots.',
    type: 'business',
  },
  {
    id: 'job-application',
    label: 'Job Application',
    icon: '💪',
    subject: 'Application for [Position] - [Your Name]',
    points: 'Express interest in the position. Highlight relevant experience. Attach resume.',
    type: 'business',
  },
  {
    id: 'sales-pitch',
    label: 'Sales Pitch',
    icon: '🚀',
    subject: 'How we can help [Company] achieve [Goal]',
    points: 'Introduce your product/service. Highlight key benefits. Include a clear CTA.',
    type: 'cold-outreach',
  },
  {
    id: 'thank-you-interview',
    label: 'Post-Interview Thanks',
    icon: '🙏',
    subject: 'Thank You - [Position] Interview',
    points: 'Thank for the opportunity. Reiterate interest. Mention something specific from the interview.',
    type: 'thank-you',
  },
  {
    id: 'project-update',
    label: 'Project Update',
    icon: '📊',
    subject: 'Project Update: [Project Name] - [Date]',
    points: 'Share project progress. Highlight achievements. Mention next steps.',
    type: 'business',
  },
  {
    id: 'networking',
    label: 'Networking',
    icon: '🤝',
    subject: 'Great connecting at [Event]',
    points: 'Reference where you met. Express interest in staying connected. Suggest a follow-up.',
    type: 'introduction',
  },
]
