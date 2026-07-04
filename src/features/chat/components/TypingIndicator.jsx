import { Bot } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

/**
 * TypingIndicator Component
 * 
 * Shows an animated "AI is typing" indicator.
 * This is crucial for UX - users need to know their message is being processed.
 * 
 * The animation uses Tailwind's built-in bounce animation.
 * Three dots bounce sequentially to create a natural "thinking" feel.
 */
export function TypingIndicator() {
  return (
    <div className="flex gap-3 py-4 px-4">
      {/* AI Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary">
          <Bot size={18} />
        </AvatarFallback>
      </Avatar>

      {/* Typing Bubble */}
      <div className="bg-card border border-border rounded-2xl rounded-bl-md px-5 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {/* Three bouncing dots */}
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}