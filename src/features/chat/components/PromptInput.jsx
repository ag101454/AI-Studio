import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Paperclip, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * PromptInput Component
 * 
 * The message input area for the chat.
 * 
 * Features:
 * - Auto-resizing textarea
 * - Enter to send, Shift+Enter for new line
 * - Character count (optional, for limited models)
 * - Disabled state while AI is responding
 * - Send button with loading state
 * 
 * @param {function} onSend - Callback when message is sent
 * @param {boolean} isDisabled - Whether input is disabled (AI responding)
 * @param {boolean} isLoading - Whether a message is being sent
 */
export function PromptInput({ onSend, isDisabled = false, isLoading = false }) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  /**
   * Auto-resize the textarea based on content.
   * Resets to min height when empty.
   */
  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }

  // Adjust height when message changes
  useEffect(() => {
    adjustHeight()
  }, [message])

  /**
   * Handle sending a message.
   * Validates non-empty, non-whitespace messages.
   */
  const handleSend = () => {
    const trimmed = message.trim()
    if (!trimmed || isDisabled || isLoading) return

    onSend?.(trimmed)
    setMessage('')
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  /**
   * Handle keyboard shortcuts.
   * Enter = Send, Shift+Enter = New line
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="max-w-3xl mx-auto">
        {/* Input Container */}
        <div className={cn(
          'relative flex items-end gap-2 rounded-2xl border border-border bg-card p-2',
          'transition-all duration-200',
          'focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 focus-within:shadow-lg',
          isDisabled && 'opacity-60'
        )}>
          {/* Attachment Button (placeholder) */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
            disabled={isDisabled}
            aria-label="Attach file"
          >
            <Paperclip size={20} />
          </Button>

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDisabled ? 'AI is responding...' : 'Type your message...'}
            disabled={isDisabled}
            rows={1}
            className={cn(
              'flex-1 resize-none bg-transparent py-2 text-sm text-foreground',
              'placeholder:text-muted-foreground',
              'focus:outline-none',
              'disabled:cursor-not-allowed',
              'min-h-[40px] max-h-[200px]'
            )}
            aria-label="Message input"
          />

          {/* Voice Input Button (placeholder) */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
            disabled={isDisabled}
            aria-label="Voice input"
          >
            <Mic size={20} />
          </Button>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isDisabled || isLoading}
            size="icon"
            className={cn(
              'h-9 w-9 shrink-0 rounded-xl transition-all duration-200',
              message.trim() && !isDisabled
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                : 'bg-muted text-muted-foreground'
            )}
            aria-label="Send message"
          >
            {isLoading ? (
              <Sparkles size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>

        {/* Footer Info */}
        <p className="text-center text-xs text-muted-foreground mt-2">
          AI Studio can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  )
}