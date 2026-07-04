import { useState } from 'react'
import { Copy, Check, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * CodeBlock Component
 * 
 * Displays syntax-highlighted code with a copy button.
 * 
 * Features:
 * - Language badge (auto-detected)
 * - Copy to clipboard with feedback
 * - Line numbers (optional, via CSS)
 * - Horizontal scroll for long lines
 * 
 * @param {string} children - The code content
 * @param {string} language - Programming language for highlighting
 */
export function CodeBlock({ children, language }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <div className="relative group my-4 rounded-lg border border-border overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {language || 'code'}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <Check size={14} className="text-green-500" />
          ) : (
            <Copy size={14} className="text-muted-foreground" />
          )}
        </Button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <pre className="p-4 bg-muted/30 text-sm leading-relaxed">
          <code className={`language-${language || 'text'}`}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  )
}