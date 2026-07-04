import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Download, Heart, Share2, Copy, Check,
  ChevronLeft, ChevronRight, Maximize2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * ImagePreview Component
 * 
 * Full-screen image preview modal with actions.
 * 
 * Features:
 * - Full-size image display
 * - Navigation between images (if multiple)
 * - Download, favorite, share, copy
 * - Keyboard navigation (Escape to close, arrows to navigate)
 * - Click outside to close
 * 
 * @param {object} image - Current image to display
 * @param {array} images - All images in the generation
 * @param {function} onClose - Close the preview
 * @param {function} onNavigate - Navigate to another image
 * @param {function} onFavorite - Toggle favorite
 */
export function ImagePreview({
  image,
  images = [],
  onClose,
  onNavigate,
  onFavorite,
}) {
  const [copied, setCopied] = useState(false)
  const currentIndex = images.findIndex((img) => img.id === image?.id)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(image?.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(image?.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-studio-${image?.id}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose?.()
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      onNavigate?.(images[currentIndex - 1])
    }
    if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
      onNavigate?.(images[currentIndex + 1])
    }
  }

  if (!image) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative z-10 max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-white/80 bg-white/10">
                {currentIndex + 1} / {images.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => onFavorite?.(image)}
              >
                <Heart
                  size={18}
                  className={image.isFavorite ? 'fill-red-500 text-red-500' : ''}
                />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={handleCopyLink}
              >
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={handleDownload}
              >
                <Download size={18} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={onClose}
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex-1 flex items-center justify-center rounded-xl overflow-hidden bg-black/50">
            <img
              src={image.url}
              alt="Generated image preview"
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />

            {/* Navigation Arrows */}
            {currentIndex > 0 && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 h-12 w-12 rounded-full"
                onClick={() => onNavigate?.(images[currentIndex - 1])}
              >
                <ChevronLeft size={24} />
              </Button>
            )}
            {currentIndex < images.length - 1 && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 h-12 w-12 rounded-full"
                onClick={() => onNavigate?.(images[currentIndex + 1])}
              >
                <ChevronRight size={24} />
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}