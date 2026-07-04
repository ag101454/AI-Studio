import { useState, useRef, useEffect, useCallback } from 'react'
import { Bot, Sparkles, Code, PenTool, Lightbulb, Search, AlertCircle, MoreVertical, Share2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PageTransition } from '@/components/ui/PageTransition'
import { MessageBubble } from '@/features/chat/components/MessageBubble'
import { TypingIndicator } from '@/features/chat/components/TypingIndicator'
import { PromptInput } from '@/features/chat/components/PromptInput'
import { sendMessage } from '@/services/chat'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const [hasStarted, setHasStarted] = useState(false)
  const scrollRef = useRef(null)

  // Get user's first name
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 
                    user?.email?.split('@')[0] || 
                    'there'
  
  // Get user initials
  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U'

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const handleSend = async (content) => {
    if (!content.trim() || isTyping) return
    setError(null)
    setHasStarted(true)

    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      status: 'sent',
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      const conversationHistory = [...messages, userMessage]
        .slice(-20)
        .map((msg) => ({ role: msg.role, content: msg.content }))

      const result = await sendMessage(conversationHistory)

      if (result.success) {
        const aiMessage = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: result.message,
          timestamp: new Date().toISOString(),
          status: 'sent',
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsTyping(false)
      scrollToBottom()
    }
  }

  const handleClearChat = () => {
    setMessages([])
    setHasStarted(false)
    setError(null)
  }

  const quickActions = [
    { icon: Code, label: 'Write Code', prompt: 'Write a JavaScript function to ', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: PenTool, label: 'Draft Email', prompt: 'Draft a professional email about ', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: Lightbulb, label: 'Brainstorm', prompt: 'Brainstorm ideas for ', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: Search, label: 'Research', prompt: 'Research and explain ', color: 'text-green-500', bg: 'bg-green-500/10' },
  ]

  const suggestions = [
    'Explain quantum computing in simple terms',
    'Write a React component with Tailwind CSS',
    'Help me debug this error message',
    'Create a weekly meal plan with recipes',
    'What are the best practices for API design?',
    'Write a professional LinkedIn post about AI',
  ]

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-4rem)] -m-6">
        <div className="flex-1 flex flex-col bg-background">
          {/* Header */}
          {hasStarted && (
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/30 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Bot size={18} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-sm font-semibold text-foreground">
                    AI Assistant
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {messages.length} messages · Personal assistant for {firstName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleClearChat}>
                      Clear conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem>Export as text</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 size={14} className="mr-2" />Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {/* Content */}
          {!hasStarted ? (
            /* Welcome Screen */
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center max-w-2xl w-full">
                {/* User Avatar */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 ring-4 ring-primary/5">
                  <span className="text-2xl font-bold text-primary">{userInitials}</span>
                </div>

                {/* Personalized Welcome */}
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Welcome back, {firstName}! 👋
                </h1>
                <p className="text-muted-foreground mb-3">
                  I'm your personal AI assistant. How can I help you today?
                </p>
                
                {/* User info badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground mb-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {user?.email}
                </div>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-2 gap-3 mb-8 max-w-lg mx-auto">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.label}
                        onClick={() => handleSend(action.prompt)}
                        className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all text-left group"
                      >
                        <div className={`p-2 rounded-lg ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{action.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Click to start</p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Prompt Suggestions */}
                <div className="max-w-lg mx-auto space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider text-center mb-3">
                    Try asking
                  </p>
                  {suggestions.slice(0, 4).map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSend(suggestion)}
                      className="w-full text-left px-4 py-2.5 rounded-lg border border-border hover:border-primary/20 hover:bg-muted/30 transition-all text-sm text-muted-foreground hover:text-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Chat View */
            <>
              <ScrollArea ref={scrollRef} className="flex-1">
                <div className="max-w-3xl mx-auto">
                  {messages.map((message, index) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isLast={index === messages.length - 1}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div className="h-4" />
                </div>
              </ScrollArea>

              {/* Error Banner */}
              {error && (
                <div className="mx-4 mb-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20 flex items-center gap-2">
                  <AlertCircle size={14} className="text-destructive shrink-0" />
                  <p className="text-xs text-destructive">{error}</p>
                  <Button variant="ghost" size="sm" className="ml-auto text-xs h-7" onClick={() => setError(null)}>
                    Dismiss
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Input Area */}
          <PromptInput onSend={handleSend} isDisabled={isTyping} isLoading={isTyping} />
        </div>
      </div>
    </PageTransition>
  )
}