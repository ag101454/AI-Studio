import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Download, Maximize2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * ImageCard Component
 * 
 * Displays a single generated image with hover actions.
 * 
 * Features:
 * - Hover overlay with action buttons
 * - Favorite toggle with animation
 * - Download button
 * - Expand/preview button
 * - Loading skeleton state
 * 
 * @param {object} image - The image data
 * @param {function} onFavorite - Toggle favorite
 * @param {function} onDownload - Download image
 * @param {function} onPreview - Open full preview
 * @param {boolean} isLoading - Show skeleton
 */
export function ImageCard({ image, onFavorite, onDownload, onPreview, isLoading = false }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [copied, setCopied] = useState(false)

  // Skeleton Loading State
  if (isLoading) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-muted animate-pulse aspect-square">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/50 to-muted" />
      </div>
    )
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-studio-${image.id}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      onDownload?.(image)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-xl overflow-hidden bg-muted aspect-square cursor-pointer"
    >
      {/* Image */}
      <img
        src={image.url}
        alt="Generated image"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          'w-full h-full object-cover transition-all duration-500',
          'group-hover:scale-110',
          !isLoaded && 'opacity-0',
          isLoaded && 'opacity-100'
        )}
      />

      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/50 to-muted animate-pulse" />
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          {/* Favorite Button */}
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              'h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30',
              image.isFavorite && 'bg-red-500/80 hover:bg-red-500'
            )}
            onClick={(e) => {
              e.stopPropagation()
              onFavorite?.(image)
            }}
          >
            <Heart
              size={16}
              className={cn(
                'text-white',
                image.isFavorite && 'fill-current'
              )}
            />
          </Button>

          {/* Download Button */}
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
            onClick={(e) => {
              e.stopPropagation()
              handleDownload()
            }}
          >
            <Download size={16} className="text-white" />
          </Button>
        </div>

        {/* Expand Button */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white gap-2"
            onClick={() => onPreview?.(image)}
          >
            <Maximize2 size={14} />
            Expand
          </Button>
        </div>
      </div>
    </motion.div>
  )
}