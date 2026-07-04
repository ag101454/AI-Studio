import { useState, useRef, useEffect, useCallback } from 'react'
import { Bot, MoreVertical, Share2, Download, Trash2, AlertCircle, Sparkles, Zap, Code, PenTool, Lightbulb, Search, Mail, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { PromptInput } from './PromptInput'
import { sendMessage } from '@/services/chat'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export function ChatWindow({ conversation, onBack, onNewChat }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  // Get user's first name for personalization
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 
                    user?.email?.split('@')[0] || 
                    'there'
  
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
    setError(null)
  }

  const quickActions = [
    { icon: Code, label: 'Write Code', prompt: 'Write a JavaScript function to ', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: PenTool, label: 'Draft Email', prompt: 'Draft a professional email about ', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: Lightbulb, label: 'Brainstorm', prompt: 'Brainstorm ideas for ', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: Search, label: 'Research', prompt: 'Research and explain ', color: 'text-green-500', bg: 'bg-green-500/10' },
  ]

  // Welcome screen when no conversation is active
  if (!conversation) {
    return (
      <div className="flex h-full flex-col bg-background">
        {/* Simple Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 lg:hidden"
              onClick={onBack}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
            <h2 className="font-heading text-sm font-semibold text-foreground">AI Chat</h2>
          </div>
        </div>

        {/* Welcome Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-lg">
            {/* User Avatar */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 ring-4 ring-primary/5">
              <span className="text-2xl font-bold text-primary">{userInitials}</span>
            </div>

            {/* Personalized Welcome */}
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-muted-foreground mb-2">
              I'm your personal AI assistant. How can I help you today?
            </p>
            
            {/* User info badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {user?.email}
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.label}
                    onClick={() => {
                      onNewChat?.()
                      setTimeout(() => handleSend(action.prompt), 300)
                    }}
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
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Try asking</p>
              {[
                'Explain quantum computing in simple terms',
                'Write a React component with Tailwind CSS',
                'Help me debug this error message',
                'Create a weekly meal plan with recipes',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    onNewChat?.()
                    setTimeout(() => handleSend(suggestion), 300)
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-lg border border-border hover:border-primary/20 hover:bg-muted/30 transition-all text-sm text-muted-foreground hover:text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Active conversation view
  return (
    <div className="flex h-full flex-col bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={onBack}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>

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
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 size={14} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleClearChat}>Clear conversation</DropdownMenuItem>
              <DropdownMenuItem>Export as text</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 size={14} className="mr-2" />Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Sparkles size={28} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Start the conversation, {firstName}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Ask me anything! I'm here to help with coding, writing, research, and more.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
              />
            ))
          )}

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

      {/* Input */}
      <PromptInput onSend={handleSend} isDisabled={isTyping} isLoading={isTyping} />
    </div>
  )
}