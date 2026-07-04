import { useState } from 'react'
import { User, Bot, Copy, Check, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatMessageTime } from '@/utils/formatDate'
import { MarkdownRenderer } from './MarkdownRenderer'
import { cn } from '@/lib/utils'

/**
 * MessageBubble Component
 * 
 * Displays a single message in the chat.
 * 
 * Visual differences by role:
 * - User: Right-aligned, primary color background
 * - Assistant: Left-aligned, card background, with avatar
 * - System: Centered, muted style (for notifications)
 * 
 * Features:
 * - Copy message content
 * - Regenerate button (AI messages only)
 * - Timestamp display
 * - Status indicators (sending, sent, error)
 * - Markdown rendering for AI messages
 * 
 * @param {object} message - The message data
 * @param {boolean} isLast - Whether this is the last message (affects regeneration button)
 */
export function MessageBubble({ message, isLast = false }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'
  const isSystem = message.role === 'system'

  /**
   * Copy message content to clipboard.
   * Shows check icon for 2 seconds as feedback.
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // System messages are centered and minimal
  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <div className="bg-muted/50 rounded-full px-4 py-1">
          <p className="text-xs text-muted-foreground">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex gap-3 py-4 px-4 group',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* AI Avatar (only for assistant messages) */}
      {isAssistant && (
        <Avatar className="h-8 w-8 shrink-0 mt-0.5">
          <AvatarFallback className="bg-primary/10 text-primary">
            <Bot size={18} />
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div className={cn(
        'flex flex-col gap-1',
        isUser ? 'items-end max-w-[80%]' : 'items-start max-w-[85%]'
      )}>
        {/* Message Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            // User message styling
            isUser && 'bg-primary text-primary-foreground rounded-br-md',
            // Assistant message styling
            isAssistant && 'bg-card border border-border text-card-foreground rounded-bl-md shadow-sm',
            // Error state
            message.status === 'error' && 'border-destructive/50 bg-destructive/5'
          )}
        >
          {/* User messages: plain text */}
          {isUser && (
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          )}

          {/* AI messages: rendered markdown */}
          {isAssistant && (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {/* Message Actions & Timestamp */}
        <div className={cn(
          'flex items-center gap-2 px-1',
          isUser ? 'flex-row-reverse' : 'flex-row'
        )}>
          {/* Timestamp */}
          <span className="text-xs text-muted-foreground select-none">
            {formatMessageTime(message.timestamp)}
          </span>

          {/* Status Indicator (user messages only) */}
          {isUser && message.status === 'sending' && (
            <span className="text-xs text-muted-foreground animate-pulse">
              Sending...
            </span>
          )}
          {isUser && message.status === 'error' && (
            <span className="text-xs text-destructive flex items-center gap-1">
              <RefreshCw size={12} />
              Failed to send
            </span>
          )}

          {/* Copy Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy message'}
          >
            {copied ? (
              <Check size={14} className="text-green-500" />
            ) : (
              <Copy size={14} />
            )}
          </Button>

          {/* Regenerate Button (last AI message only) */}
          {isAssistant && isLast && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
              aria-label="Regenerate response"
            >
              <RefreshCw size={14} />
            </Button>
          )}
        </div>
      </div>

      {/* User Avatar (only for user messages) */}
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0 mt-0.5">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User size={18} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}