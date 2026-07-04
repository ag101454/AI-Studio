import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Download, Heart, Share2, Trash2, History, PanelLeftClose, PanelLeft, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageTransition } from '@/components/ui/PageTransition'
import { generateImage } from '@/services/image'
import { mockHistory } from '@/mock/image'
import { timeAgo } from '@/utils/formatDate'
import { cn } from '@/lib/utils'

export function ImagePage() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('photorealistic')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [imageCount, setImageCount] = useState(4)
  const [results, setResults] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState(mockHistory)
  const [showHistory, setShowHistory] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(null)
  const [error, setError] = useState('')
  const [favorites, setFavorites] = useState([])

  const styles = [
    { id: 'photorealistic', label: 'Photo', icon: '📷' },
    { id: 'digital-art', label: 'Digital', icon: '🎨' },
    { id: 'anime', label: 'Anime', icon: '🎌' },
    { id: '3d-render', label: '3D', icon: '💎' },
    { id: 'oil-painting', label: 'Paint', icon: '🖼️' },
    { id: 'sketch', label: 'Sketch', icon: '✏️' },
  ]

  const ratios = [
    { id: '1:1', label: 'Square', icon: '⬜' },
    { id: '16:9', label: 'Wide', icon: '🖥️' },
    { id: '9:16', label: 'Portrait', icon: '📱' },
  ]

  const counts = [1, 2, 4]

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return

    setError('')
    setResults(null)
    setIsGenerating(true)

    try {
      const result = await generateImage({
        prompt: prompt.trim(),
        style,
        aspectRatio,
        imageCount,
      })

      setResults(result)
      setHistory((prev) => [result, ...prev])
    } catch (err) {
      setError(err.message || 'Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleFavorite = (imageId) => {
    setFavorites((prev) =>
      prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]
    )
  }

  const handleDownload = async (imageUrl, imageId) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-studio-${imageId}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      window.open(imageUrl, '_blank')
    }
  }

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-4rem)] -m-6">
        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/30">
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">Image Generator</h1>
              <p className="text-xs text-muted-foreground">Create stunning AI images from text</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="gap-1.5"
            >
              <Clock size={16} />
              History
              <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
                {history.length}
              </Badge>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {/* Prompt Input - Clean & Simple */}
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to create..."
                    rows={2}
                    disabled={isGenerating}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 pr-24 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all disabled:opacity-50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleGenerate()
                      }
                    }}
                  />
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="absolute right-2 bottom-2 h-9 gap-1.5"
                    size="sm"
                  >
                    {isGenerating ? (
                      <Sparkles size={14} className="animate-spin" />
                    ) : (
                      <Sparkles size={14} />
                    )}
                    Generate
                  </Button>
                </div>

                {/* Quick Options Row */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Style Selector */}
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
                    {styles.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStyle(s.id)}
                        disabled={isGenerating}
                        className={cn(
                          'px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
                          style === s.id
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                        title={s.label}
                      >
                        {s.icon}
                      </button>
                    ))}
                  </div>

                  <div className="w-px h-6 bg-border" />

                  {/* Aspect Ratio */}
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
                    {ratios.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setAspectRatio(r.id)}
                        disabled={isGenerating}
                        className={cn(
                          'px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
                          aspectRatio === r.id
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                        title={r.label}
                      >
                        {r.icon}
                      </button>
                    ))}
                  </div>

                  <div className="w-px h-6 bg-border" />

                  {/* Image Count */}
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
                    {counts.map((c) => (
                      <button
                        key={c}
                        onClick={() => setImageCount(c)}
                        disabled={isGenerating}
                        className={cn(
                          'px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
                          imageCount === c
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {c}×
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-sm text-destructive text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Loading State - Skeleton Grid */}
              {isGenerating && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                    <Sparkles size={14} className="animate-spin text-primary" />
                    Creating {imageCount} image{imageCount > 1 ? 's' : ''}...
                  </p>
                  <div className={cn(
                    'grid gap-3',
                    imageCount === 1 && 'grid-cols-1 max-w-md mx-auto',
                    imageCount === 2 && 'grid-cols-2',
                    imageCount === 4 && 'grid-cols-2'
                  )}>
                    {[...Array(imageCount)].map((_, i) => (
                      <div
                        key={i}
                        className="relative rounded-xl overflow-hidden bg-muted animate-pulse"
                        style={{ aspectRatio: aspectRatio.replace(':', '/') }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/50 to-muted" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Sparkles size={24} className="text-muted-foreground/50 mx-auto mb-2 animate-pulse" />
                            <p className="text-xs text-muted-foreground/50">Generating...</p>
                          </div>
                        </div>
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results Grid */}
              {results && !isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-xs text-muted-foreground">
                    &ldquo;{results.prompt}&rdquo; · {results.images.length} results
                  </p>
                  <div className={cn(
                    'grid gap-3',
                    results.imageCount === 1 && 'grid-cols-1 max-w-md mx-auto',
                    results.imageCount === 2 && 'grid-cols-1 sm:grid-cols-2',
                    results.imageCount === 4 && 'grid-cols-2'
                  )}>
                    {results.images.map((image, index) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative rounded-xl overflow-hidden bg-muted cursor-pointer border border-border hover:border-primary/30 transition-all"
                        style={{ aspectRatio: aspectRatio.replace(':', '/') }}
                        onClick={() => setPreviewIndex(index)}
                      >
                        <img
                          src={image.url}
                          alt={`Generated ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        
                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="absolute top-3 right-3 flex gap-1.5">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(image.id)
                              }}
                            >
                              <Heart
                                size={14}
                                className={cn(
                                  'text-white',
                                  favorites.includes(image.id) && 'fill-red-500 text-red-500'
                                )}
                              />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownload(image.url, image.id)
                              }}
                            >
                              <Download size={14} className="text-white" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Empty State */}
              {!results && !isGenerating && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Sparkles size={28} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Create your first image
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-4">
                    Describe what you want to see and AI will bring it to life
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      { icon: '🌆', text: 'Futuristic city at sunset' },
                      { icon: '🏔️', text: 'Mountain lake reflection' },
                      { icon: '🐉', text: 'Dragon in fantasy forest' },
                    ].map((s) => (
                      <button
                        key={s.text}
                        onClick={() => setPrompt(s.text)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <span>{s.icon}</span>
                        {s.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-border bg-card overflow-hidden shrink-0"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="font-heading text-sm font-semibold text-foreground">History</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowHistory(false)}
                  >
                    <PanelLeftClose size={14} />
                  </Button>
                </div>
                <ScrollArea className="flex-1">
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <Clock size={32} className="text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">No history yet</p>
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {history.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setResults(item)
                            setShowHistory(false)
                          }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                        >
                          <div
                            className="h-10 w-10 rounded-lg bg-muted shrink-0 overflow-hidden"
                            style={{ aspectRatio: '1/1' }}
                          >
                            {item.images[0] && (
                              <img
                                src={item.images[0].url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">
                              {item.prompt}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {timeAgo(item.createdAt)} · {item.imageCount} images
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full Screen Preview */}
      <AnimatePresence>
        {previewIndex !== null && results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setPreviewIndex(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10 h-10 w-10 rounded-full"
              onClick={() => setPreviewIndex(null)}
            >
              ✕
            </Button>

            <div className="max-w-5xl max-h-[90vh] mx-4">
              <img
                src={results.images[previewIndex]?.url}
                alt="Preview"
                className="max-w-full max-h-[85vh] object-contain rounded-xl"
              />
            </div>

            {/* Navigation */}
            {results.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
                {results.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewIndex(i)
                    }}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      i === previewIndex
                        ? 'bg-white w-6'
                        : 'bg-white/40 hover:bg-white/60'
                    )}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}