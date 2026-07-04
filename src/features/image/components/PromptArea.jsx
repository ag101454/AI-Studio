import { useState } from 'react'
import { Sparkles, Lightbulb, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { suggestedPrompts } from '@/mock/image'
import { cn } from '@/lib/utils'

/**
 * PromptArea Component
 * 
 * Text input for image generation prompts with suggestions.
 * 
 * @param {string} value - Current prompt value
 * @param {function} onChange - Callback when prompt changes
 * @param {function} onGenerate - Callback to trigger generation
 * @param {boolean} isLoading - Whether generation is in progress
 */
export function PromptArea({ value, onChange, onGenerate, isLoading }) {
  const [showSuggestions, setShowSuggestions] = useState(true)

  const handleSuggestionClick = (prompt) => {
    onChange(prompt)
  }

  return (
    <Card className="border-border">
      <CardContent className="p-5 space-y-4">
        {/* Prompt Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              Describe your image
            </label>
            <span className="text-xs text-muted-foreground">
              {value.length}/500
            </span>
          </div>
          
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value.slice(0, 500))}
            placeholder="A breathtaking sunset over a futuristic city with flying cars and neon lights..."
            rows={3}
            disabled={isLoading}
            className={cn(
              'w-full rounded-lg border border-border bg-card p-3 text-sm text-foreground',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
              'resize-none transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          />

          {/* Generate Button */}
          <Button
            onClick={onGenerate}
            disabled={!value.trim() || isLoading}
            className="w-full mt-3 h-11 gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <Sparkles size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Image{value.trim() ? '' : ' (Enter a prompt)'}
              </>
            )}
          </Button>
        </div>

        {/* Suggestions Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Lightbulb size={14} />
            Suggested prompts
          </button>
          {!showSuggestions && (
            <Badge variant="secondary" className="text-xs">
              {suggestedPrompts.length} available
            </Badge>
          )}
        </div>

        {/* Suggestions Grid */}
        {showSuggestions && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedPrompts.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion.prompt)}
                disabled={isLoading}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200',
                  'border border-border hover:border-primary/30 hover:bg-muted/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <span className="text-xl shrink-0">{suggestion.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {suggestion.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {suggestion.prompt}
                  </p>
                  <Badge variant="outline" className="mt-1.5 text-xs px-1.5 py-0">
                    {suggestion.category}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}