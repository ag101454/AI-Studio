/**
 * AI Code Generator Service
 * 
 * Primary: Google Gemini (free, fast, reliable)
 * Secondary: DeepSeek Coder via Hugging Face (free, code specialist)
 */

const GEMINI_API_KEY = 'AQ.Ab8RN6IxcKAe0_sz_bnxXxcg97Sj3jZEgSjfYNQTzU4LuXYlSQ'  // ← Your Gemini key
const HF_API_KEY = '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'        // ← Your Hugging Face token

// Choose provider: 'gemini' | 'deepseek' | 'auto'
const PROVIDER = 'auto'  // 'auto' tries DeepSeek first, falls back to Gemini

/**
 * Generate code using DeepSeek Coder via Hugging Face
 */
async function generateWithDeepSeek(prompt, language, task) {
  const taskPrompts = {
    generate: `### Instruction: Write ${language} code for the following. Return the code with comments.\n\n### Request: ${prompt}\n\n### Response:\n\`\`\`${language}`,
    explain: `### Instruction: Explain this ${language} code in detail.\n\n### Code: ${prompt}\n\n### Response:`,
    debug: `### Instruction: Find and fix bugs in this ${language} code. Show the corrected code.\n\n### Code: ${prompt}\n\n### Response:`,
    optimize: `### Instruction: Optimize this ${language} code. Show the improved version.\n\n### Code: ${prompt}\n\n### Response:`,
    convert: `### Instruction: Convert this code to ${language}. Show the converted code.\n\n### Code: ${prompt}\n\n### Response:`,
    documentation: `### Instruction: Generate documentation for this ${language} code.\n\n### Code: ${prompt}\n\n### Response:`,
  }

  const fullPrompt = taskPrompts[task] || taskPrompts.generate

  try {
    // Correct Hugging Face Inference API URL
    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/deepseek-ai/DeepSeek-Coder-V2-Instruct/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-ai/DeepSeek-Coder-V2-Instruct',
          messages: [
            {
              role: 'system',
              content: 'You are an expert programmer. Write clean, efficient code. Return only the code with brief comments.'
            },
            {
              role: 'user',
              content: fullPrompt
            }
          ],
          max_tokens: 2048,
          temperature: 0.3,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    
    // Extract the generated text
    const generatedText = data.choices?.[0]?.message?.content

    if (!generatedText) {
      throw new Error('No code generated. The model might be loading. Try again in a few seconds.')
    }

    return {
      success: true,
      code: generatedText,
      model: 'DeepSeek Coder V2',
    }
  } catch (error) {
    console.error('DeepSeek error:', error)
    return {
      success: false,
      error: error.message || 'DeepSeek generation failed',
    }
  }
}

/**
 * Alternative: Use Hugging Face's free hosted inference (no rate limit issues)
 */
async function generateWithDeepSeekFree(prompt, language, task) {
  const taskPrompts = {
    generate: `Write ${language} code for: ${prompt}. Return only code with comments.`,
    explain: `Explain this ${language} code: ${prompt}`,
    debug: `Debug this ${language} code: ${prompt}`,
    optimize: `Optimize this ${language} code: ${prompt}`,
    convert: `Convert to ${language}: ${prompt}`,
    documentation: `Document this ${language} code: ${prompt}`,
  }

  try {
    // Free hosted inference API
    const response = await fetch(
      'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Coder-V2-Instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: taskPrompts[task] || taskPrompts.generate,
          parameters: {
            max_new_tokens: 2048,
            temperature: 0.3,
            top_p: 0.95,
            return_full_text: false,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      
      // Model is loading (common with free tier)
      if (errorData.error?.includes('loading') || response.status === 503) {
        throw new Error('Model is loading. Please try again in 20-30 seconds.')
      }
      
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    const data = await response.json()
    const generatedText = Array.isArray(data) 
      ? data[0]?.generated_text 
      : data.generated_text

    if (!generatedText) {
      throw new Error('No code generated')
    }

    return {
      success: true,
      code: generatedText,
      model: 'DeepSeek Coder V2',
    }
  } catch (error) {
    console.error('DeepSeek error:', error)
    throw error
  }
}

/**
 * Generate code using Google Gemini (most reliable)
 */
async function generateWithGemini(prompt, language, task) {
  const taskPrompts = {
    generate: `Generate ${language} code for the following request. Provide clean, well-commented code with explanations:\n\n${prompt}`,
    explain: `Explain the following ${language} code in detail. Break down what each part does:\n\n${prompt}`,
    debug: `Debug and fix the following ${language} code. Identify errors and provide corrected code with explanations:\n\n${prompt}`,
    optimize: `Optimize the following ${language} code for better performance. Explain the improvements made:\n\n${prompt}`,
    convert: `Convert the following code to ${language}. Provide the converted code with explanations:\n\n${prompt}`,
    documentation: `Generate comprehensive documentation for the following ${language} code:\n\n${prompt}`,
  }

  const systemPrompt = `You are an expert programmer. Provide clean, efficient, and well-documented code. 
Format your response with proper markdown code blocks. Be concise but thorough.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: taskPrompts[task] || taskPrompts.generate }]
          }],
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'API Error')
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error('No response generated')
    }

    return {
      success: true,
      code: text,
      model: 'Gemini 2.5 Flash',
    }
  } catch (error) {
    console.error('Gemini error:', error)
    throw error
  }
}

/**
 * Main generate function - tries providers in order
 */
export async function generateCode({ prompt, language = 'javascript', task = 'generate' }) {
  // Strategy: Try Gemini first (most reliable), DeepSeek as backup
  
  if (PROVIDER === 'gemini') {
    return generateWithGemini(prompt, language, task)
  }
  
  if (PROVIDER === 'deepseek') {
    try {
      return await generateWithDeepSeekFree(prompt, language, task)
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Auto mode: Try Gemini first (faster), fallback to DeepSeek
  if (PROVIDER === 'auto') {
    try {
      return await generateWithGemini(prompt, language, task)
    } catch (geminiError) {
      console.log('Gemini failed, trying DeepSeek...')
      try {
        return await generateWithDeepSeekFree(prompt, language, task)
      } catch (deepseekError) {
        return { 
          success: false, 
          error: 'Both providers failed. Please try again.' 
        }
      }
    }
  }

  return { success: false, error: 'No provider configured' }
}
