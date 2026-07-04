/**
 * Image Generator Mock Data
 * 
 * Data structures and mock API for the image generation feature.
 * 
 * Future API Endpoints:
 * - POST /api/image/generate        → Generate images from prompt
 * - GET  /api/image/history          → User's generation history
 * - GET  /api/image/:id              → Single generation details
 * - DELETE /api/image/:id            → Delete a generation
 * - POST /api/image/:id/upscale      → Upscale an image
 * - POST /api/image/:id/variations   → Create variations
 */

/**
 * Available style presets
 */
export const stylePresets = [
    { id: 'photorealistic', label: 'Photorealistic', icon: '📷', description: 'Realistic photography style' },
    { id: 'anime', label: 'Anime', icon: '🎌', description: 'Japanese anime art style' },
    { id: 'digital-art', label: 'Digital Art', icon: '🎨', description: 'Modern digital illustration' },
    { id: 'oil-painting', label: 'Oil Painting', icon: '🖼️', description: 'Classical oil painting' },
    { id: 'watercolor', label: 'Watercolor', icon: '🎨', description: 'Soft watercolor effect' },
    { id: '3d-render', label: '3D Render', icon: '💎', description: '3D rendered image' },
    { id: 'pixel-art', label: 'Pixel Art', icon: '👾', description: 'Retro pixel art style' },
    { id: 'sketch', label: 'Sketch', icon: '✏️', description: 'Pencil sketch drawing' },
  ]
  
  /**
   * Available aspect ratios
   */
  export const aspectRatios = [
    { id: '1:1', label: 'Square (1:1)', width: 1024, height: 1024, icon: '⬜' },
    { id: '4:3', label: 'Standard (4:3)', width: 1024, height: 768, icon: '📐' },
    { id: '16:9', label: 'Widescreen (16:9)', width: 1024, height: 576, icon: '🖥️' },
    { id: '9:16', label: 'Portrait (9:16)', width: 576, height: 1024, icon: '📱' },
    { id: '3:2', label: 'Photo (3:2)', width: 1024, height: 683, icon: '📸' },
  ]
  
  /**
   * Quality options
   */
  export const qualityOptions = [
    { id: 'standard', label: 'Standard', description: 'Fast generation, good quality' },
    { id: 'hd', label: 'HD', description: 'Higher quality, slower generation' },
    { id: 'ultra', label: 'Ultra HD', description: 'Maximum quality, slowest generation' },
  ]
  
  /**
   * Number of images to generate
   */
  export const imageCountOptions = [
    { id: 1, label: '1 Image' },
    { id: 2, label: '2 Images' },
    { id: 4, label: '4 Images' },
  ]
  
  /**
   * Suggested prompts for inspiration
   */
  export const suggestedPrompts = [
    {
      id: 'prompt_1',
      title: 'Futuristic City',
      prompt: 'A futuristic city at sunset with flying cars and neon lights, cyberpunk style',
      category: 'Sci-Fi',
      icon: '🌆',
    },
    {
      id: 'prompt_2',
      title: 'Mountain Landscape',
      prompt: 'Majestic mountain landscape with a crystal clear lake reflecting the peaks, photorealistic',
      category: 'Nature',
      icon: '🏔️',
    },
    {
      id: 'prompt_3',
      title: 'Abstract Art',
      prompt: 'Abstract geometric shapes with vibrant colors and flowing gradients, digital art',
      category: 'Abstract',
      icon: '🎨',
    },
    {
      id: 'prompt_4',
      title: 'Fantasy Character',
      prompt: 'A powerful wizard casting a spell in an ancient library, magical atmosphere, detailed',
      category: 'Fantasy',
      icon: '🧙',
    },
    {
      id: 'prompt_5',
      title: 'Cozy Interior',
      prompt: 'A cozy cabin interior with a fireplace, books, and a cat sleeping on a chair, warm lighting',
      category: 'Lifestyle',
      icon: '🏠',
    },
    {
      id: 'prompt_6',
      title: 'Space Scene',
      prompt: 'A massive spaceship orbiting a colorful nebula with distant planets, cinematic lighting',
      category: 'Space',
      icon: '🚀',
    },
  ]
  
  /**
   * Mock generation history
   */
  export const mockHistory = [
    {
      id: 'gen_1',
      prompt: 'Futuristic city at sunset with flying cars',
      style: 'digital-art',
      aspectRatio: '16:9',
      quality: 'hd',
      imageCount: 4,
      status: 'completed',
      createdAt: '2026-07-02T10:30:00Z',
      images: [
        { id: 'img_1a', url: 'https://picsum.photos/seed/city1/1024/576', isFavorite: true },
        { id: 'img_1b', url: 'https://picsum.photos/seed/city2/1024/576', isFavorite: false },
        { id: 'img_1c', url: 'https://picsum.photos/seed/city3/1024/576', isFavorite: false },
        { id: 'img_1d', url: 'https://picsum.photos/seed/city4/1024/576', isFavorite: false },
      ],
    },
    {
      id: 'gen_2',
      prompt: 'Majestic mountain landscape with lake',
      style: 'photorealistic',
      aspectRatio: '4:3',
      quality: 'ultra',
      imageCount: 2,
      status: 'completed',
      createdAt: '2026-07-01T15:45:00Z',
      images: [
        { id: 'img_2a', url: 'https://picsum.photos/seed/mountain1/1024/768', isFavorite: true },
        { id: 'img_2b', url: 'https://picsum.photos/seed/mountain2/1024/768', isFavorite: false },
      ],
    },
    {
      id: 'gen_3',
      prompt: 'Abstract geometric art with vibrant colors',
      style: 'digital-art',
      aspectRatio: '1:1',
      quality: 'standard',
      imageCount: 1,
      status: 'completed',
      createdAt: '2026-06-30T09:15:00Z',
      images: [
        { id: 'img_3a', url: 'https://picsum.photos/seed/abstract1/1024/1024', isFavorite: false },
      ],
    },
  ]
  
  /**
   * Mock generation function.
   * Simulates the AI image generation process.
   * 
   * Future: POST /api/image/generate
   */
  export async function mockGenerateImage({
    prompt,
    style,
    aspectRatio,
    quality,
    imageCount,
  }) {
    // Simulate processing time based on quality
    const processingTime = quality === 'ultra' ? 4000 : quality === 'hd' ? 3000 : 2000
    await new Promise((resolve) => setTimeout(resolve, processingTime))
  
    // Get dimensions from aspect ratio
    const ratio = aspectRatios.find((r) => r.id === aspectRatio)
    const { width, height } = ratio || { width: 1024, height: 1024 }
  
    // Generate mock images
    const images = []
    for (let i = 0; i < imageCount; i++) {
      images.push({
        id: `img_${Date.now()}_${i}`,
        url: `https://picsum.photos/seed/${Date.now()}_${i}/${width}/${height}`,
        isFavorite: false,
      })
    }
  
    return {
      id: `gen_${Date.now()}`,
      prompt,
      style,
      aspectRatio,
      quality,
      imageCount,
      status: 'completed',
      createdAt: new Date().toISOString(),
      images,
    }
  }