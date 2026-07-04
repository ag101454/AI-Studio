import { motion } from 'framer-motion'
import { Settings2, Image, Maximize, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { stylePresets, aspectRatios, qualityOptions, imageCountOptions } from '@/mock/image'

/**
 * ConfigPanel Component
 * 
 * Configuration options for image generation.
 * 
 * @param {object} config - Current configuration
 * @param {function} onConfigChange - Callback when config changes
 * @param {boolean} disabled - Whether controls are disabled (during generation)
 */
export function ConfigPanel({ config, onConfigChange, disabled = false }) {
  return (
    <Card className="border-border">
      <CardContent className="p-5 space-y-6">
        {/* Style Selection */}
        <div>
          <Label className="flex items-center gap-2 text-sm font-medium mb-3">
            <Settings2 size={16} className="text-muted-foreground" />
            Style
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {stylePresets.map((style) => (
              <button
                key={style.id}
                onClick={() => onConfigChange('style', style.id)}
                disabled={disabled}
                className={cn(
                  'flex items-center gap-2 p-2.5 rounded-lg text-left transition-all duration-200',
                  'border hover:border-primary/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  config.style === style.id
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="text-lg">{style.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{style.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div>
          <Label className="flex items-center gap-2 text-sm font-medium mb-3">
            <Maximize size={16} className="text-muted-foreground" />
            Aspect Ratio
          </Label>
          <div className="flex gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => onConfigChange('aspectRatio', ratio.id)}
                disabled={disabled}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 p-2.5 rounded-lg transition-all duration-200',
                  'border hover:border-primary/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  config.aspectRatio === ratio.id
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="text-lg">{ratio.icon}</span>
                <span className="text-xs font-medium">{ratio.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quality */}
        <div>
          <Label className="flex items-center gap-2 text-sm font-medium mb-3">
            <Sparkles size={16} className="text-muted-foreground" />
            Quality
          </Label>
          <div className="flex gap-2">
            {qualityOptions.map((quality) => (
              <button
                key={quality.id}
                onClick={() => onConfigChange('quality', quality.id)}
                disabled={disabled}
                className={cn(
                  'flex-1 p-2.5 rounded-lg text-center transition-all duration-200',
                  'border hover:border-primary/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  config.quality === quality.id
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                <p className="text-xs font-medium">{quality.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Number of Images */}
        <div>
          <Label className="flex items-center gap-2 text-sm font-medium mb-3">
            <Image size={16} className="text-muted-foreground" />
            Number of Images
          </Label>
          <div className="flex gap-2">
            {imageCountOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onConfigChange('imageCount', option.id)}
                disabled={disabled}
                className={cn(
                  'flex-1 p-2.5 rounded-lg text-center transition-all duration-200',
                  'border hover:border-primary/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  config.imageCount === option.id
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                <p className="text-xs font-medium">{option.label}</p>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}