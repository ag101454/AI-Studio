/**
 * AI Image Generation Service
 * Powered by Pollinations.ai - 100% Free
 */

/**
 * Generate images from text prompt
 * 
 * @param {Object} options
 * @param {string} options.prompt - Image description
 * @param {string} options.style - Style preset
 * @param {string} options.aspectRatio - Aspect ratio
 * @param {number} options.imageCount - Number of images (1, 2, or 4)
 * @returns {Promise<Object>} Generated images
 */
export async function generateImage({
    prompt,
    style = 'photorealistic',
    aspectRatio = '1:1',
    imageCount = 4,
  }) {
    try {
      // Map aspect ratio to dimensions
      const dimensions = {
        '1:1': { width: 1024, height: 1024 },
        '4:3': { width: 1024, height: 768 },
        '16:9': { width: 1024, height: 576 },
        '9:16': { width: 576, height: 1024 },
        '3:2': { width: 1024, height: 683 },
      }
  
      const { width, height } = dimensions[aspectRatio] || dimensions['1:1']
  
      // Style prompts for better quality
      const stylePrompts = {
        'photorealistic': 'photorealistic, hyperrealistic, 8k, professional photography, natural lighting, sharp focus, highly detailed',
        'anime': 'anime style, manga art, studio ghibli inspired, vibrant colors, clean lines',
        'digital-art': 'digital art, concept art, trending on artstation, detailed illustration, fantasy art',
        'oil-painting': 'oil painting on canvas, classical art, renaissance style, textured brushstrokes, masterpiece',
        'watercolor': 'watercolor painting, soft colors, artistic, flowing brushstrokes, ethereal',
        '3d-render': '3d render, octane render, unreal engine 5, cinema 4d, ray tracing, hyperrealistic CGI',
        'pixel-art': 'pixel art, 16-bit style, retro game graphics, crisp pixels, vibrant',
        'sketch': 'pencil sketch, hand drawn artwork, detailed linework, black and white, graphite',
      }
  
      const stylePrompt = stylePrompts[style] || ''
  
      // Variations to get different images
      const variations = [
        '',
        ', different angle, alternative view',
        ', close-up detail shot',
        ', wide landscape composition',
        ', dramatic lighting, cinematic',
        ', soft morning light, atmospheric',
        ', night scene, moody lighting',
        ', birds-eye view, aerial perspective',
      ]
  
      // Different models for variety
      const models = ['flux', 'turbo', 'flux-realism', 'flux']
  
      // Generate multiple unique images
      const images = []
  
      for (let i = 0; i < imageCount; i++) {
        const seed = Date.now() + i * 1000 + Math.floor(Math.random() * 1000)
        const variation = variations[i % variations.length]
        const model = models[i % models.length]
        const uniquePrompt = `${prompt}, ${stylePrompt}${variation}`
  
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(uniquePrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=${model}&enhance=true`
  
        images.push({
          id: `img_${Date.now()}_${i}`,
          url: imageUrl,
          prompt: uniquePrompt,
          isFavorite: false,
        })
      }
  
      return {
        id: `gen_${Date.now()}`,
        prompt,
        style,
        aspectRatio,
        imageCount,
        status: 'completed',
        createdAt: new Date().toISOString(),
        images,
      }
    } catch (error) {
      console.error('Image generation error:', error)
      throw new Error('Failed to generate images. Please try again.')
    }
  }
  
  /**
   * Generate a single quick image
   */
  export async function generateSingleImage(prompt, options = {}) {
    const { width = 1024, height = 1024, style = 'photorealistic' } = options
    const seed = Date.now()
    const fullPrompt = `${prompt}, ${style}, highly detailed, 8k`
  
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux&enhance=true`
  }