/**
 * AI Resume Builder Service
 * Powered by Google Gemini - Creates ATS-optimized resumes
 */

const GEMINI_API_KEY = 'AQ.Ab8RN6IJ9ww78zUJyoyvVNFW9dxvhF2X5GxCzkVDGURCIEyAYw'  // ← Your Gemini API key

/**
 * Resume sections
 */
export const RESUME_SECTIONS = [
  { id: 'summary', label: 'Professional Summary', icon: '📝', required: true },
  { id: 'experience', label: 'Work Experience', icon: '💼', required: true },
  { id: 'education', label: 'Education', icon: '🎓', required: true },
  { id: 'skills', label: 'Skills', icon: '⚡', required: true },
  { id: 'projects', label: 'Projects', icon: '🚀', required: false },
  { id: 'certifications', label: 'Certifications', icon: '🏆', required: false },
  { id: 'achievements', label: 'Achievements', icon: '🌟', required: false },
]

/**
 * Industries
 */
export const INDUSTRIES = [
  { id: 'tech', label: 'Technology', icon: '💻' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { id: 'marketing', label: 'Marketing', icon: '📢' },
  { id: 'engineering', label: 'Engineering', icon: '⚙️' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'sales', label: 'Sales', icon: '🤝' },
  { id: 'education', label: 'Education', icon: '📚' },
]

/**
 * Experience levels
 */
export const LEVELS = [
  { id: 'entry', label: 'Entry Level', icon: '🌱', years: '0-2 years' },
  { id: 'mid', label: 'Mid Level', icon: '🌿', years: '3-5 years' },
  { id: 'senior', label: 'Senior', icon: '🌳', years: '6-10 years' },
  { id: 'lead', label: 'Lead/Manager', icon: '🏔️', years: '10+ years' },
  { id: 'executive', label: 'Executive', icon: '👑', years: '15+ years' },
]

/**
 * Resume formats
 */
export const FORMATS = [
  { id: 'ats', label: 'ATS Optimized', icon: '🎯', description: 'Best for online applications' },
  { id: 'modern', label: 'Modern', icon: '✨', description: 'Clean & contemporary' },
  { id: 'classic', label: 'Classic', icon: '📄', description: 'Traditional format' },
]

/**
 * ATS Keywords by industry
 */
const ATS_KEYWORDS = {
  tech: 'JavaScript, Python, React, Node.js, AWS, Agile, CI/CD, REST API, Microservices, Cloud, Docker, Kubernetes, TypeScript, Git, SQL',
  finance: 'Financial Analysis, Risk Management, Portfolio Management, Bloomberg, CFA, Excel, Financial Modeling, GAAP, Audit, Compliance',
  healthcare: 'Patient Care, HIPAA, EMR, Clinical Research, Medical Terminology, Healthcare Management, Patient Safety',
  marketing: 'SEO, SEM, Content Strategy, Social Media, Analytics, Campaign Management, Brand Strategy, ROI, CRM, Email Marketing',
  engineering: 'CAD, AutoCAD, SolidWorks, Project Management, Six Sigma, Quality Control, Manufacturing, Lean, DFMEA',
  design: 'Figma, UI/UX, Adobe Creative Suite, Wireframing, Prototyping, User Research, Design Systems, Typography',
  sales: 'CRM, Salesforce, Lead Generation, B2B, B2C, Pipeline Management, Negotiation, Account Management',
  education: 'Curriculum Development, LMS, Student Assessment, Teaching, Research, Academic Advising, EdTech',
}

/**
 * Generate ATS-optimized resume
 */
export async function generateResume({
  fullName,
  email,
  phone,
  location,
  targetJob,
  industry,
  experienceLevel,
  currentExperience,
  education,
  skills,
  format = 'ats',
  additionalInfo = '',
}) {
  const atsKeywords = ATS_KEYWORDS[industry] || ATS_KEYWORDS.tech

  const prompt = `Create a professional, ATS-optimized resume in ${format} format.

CANDIDATE INFORMATION:
- Full Name: ${fullName}
- Email: ${email}
- Phone: ${phone}
- Location: ${location}
- Target Job: ${targetJob}
- Industry: ${industry}
- Experience Level: ${experienceLevel}
- Current Experience: ${currentExperience}
- Education: ${education}
- Skills: ${skills}
- Additional Info: ${additionalInfo}

ATS REQUIREMENTS:
- Use industry keywords naturally: ${atsKeywords}
- Quantify achievements with numbers and metrics
- Use action verbs (Led, Developed, Implemented, Achieved, etc.)
- Keep formatting clean and parseable
- Include all standard resume sections
- Optimize for applicant tracking systems

FORMAT THE RESUME WITH CLEAR SECTION HEADERS using markdown. Make it professional, scannable, and ready to submit.`

  const systemInstruction = `You are an expert resume writer and ATS optimization specialist. 
Create resumes that get past applicant tracking systems and land interviews.
Use industry-specific keywords naturally. Quantify achievements. 
Make every bullet point impactful. Format cleanly for both ATS and human readers.
The resume MUST be professional, error-free, and tailored to the target job.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: 0.5,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        }),
      }
    )

    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'Generation failed')
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('No content generated')

    // Calculate ATS score based on keywords and formatting
    const atsScore = calculateATSScore(text, industry)

    return {
      success: true,
      content: text,
      atsScore,
      model: 'Gemini 2.5 Flash',
    }
  } catch (error) {
    console.error('Resume generation error:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate resume',
    }
  }
}

/**
 * Calculate ATS compatibility score
 */
function calculateATSScore(resumeText, industry) {
  let score = 70 // Base score

  const keywords = ATS_KEYWORDS[industry]?.split(', ') || []
  const resumeLower = resumeText.toLowerCase()
  
  // Check for keywords
  let keywordCount = 0
  keywords.forEach(keyword => {
    if (resumeLower.includes(keyword.toLowerCase())) keywordCount++
  })
  
  const keywordScore = Math.min(15, (keywordCount / keywords.length) * 15)
  score += keywordScore

  // Check for standard sections
  const sections = ['summary', 'experience', 'education', 'skills']
  sections.forEach(section => {
    if (resumeLower.includes(section)) score += 2.5
  })

  // Check for quantifiable metrics (numbers)
  const numberMatches = resumeText.match(/\d+%|\d+ years|\$\d+|\d+ people|\d+ projects/g)
  if (numberMatches) score += Math.min(5, numberMatches.length)

  return Math.min(100, Math.round(score))
}

/**
 * Improve existing resume
 */
export async function improveResume({ currentResume, targetJob, industry }) {
  const prompt = `Improve and optimize this resume for a "${targetJob}" position in the ${industry} industry.

CURRENT RESUME:
${currentResume}

IMPROVEMENTS NEEDED:
1. Add missing ATS keywords for ${industry}
2. Quantify achievements with numbers
3. Strengthen bullet points with action verbs
4. Improve formatting for ATS parsing
5. Tailor content for "${targetJob}"
6. Fix any grammar or spelling issues

Return the fully improved resume.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
        }),
      }
    )

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    return {
      success: true,
      content: text || currentResume,
      atsScore: calculateATSScore(text || currentResume, industry),
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Generate cover letter
 */
export async function generateCoverLetter({
  fullName,
  targetJob,
  company,
  industry,
  experience,
  skills,
}) {
  const prompt = `Write a compelling cover letter for ${fullName} applying for ${targetJob} at ${company}.

Background:
- Industry: ${industry}
- Experience: ${experience}
- Key Skills: ${skills}

Make it professional, personalized, and highlight how their skills match the role.
Keep it concise (3-4 paragraphs). Use a professional tone.`

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

    return { success: true, content: text }
  } catch (error) {
    return { success: false, error: error.message }
  }
}