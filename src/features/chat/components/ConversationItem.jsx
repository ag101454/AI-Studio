import { MessageSquare, Pin, Archive, MoreHorizontal, Trash2, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { timeAgo } from '@/utils/formatDate'
import { cn } from '@/lib/utils'

/**
 * ConversationItem Component
 * 
 * Displays a single conversation in the list.
 * 
 * Props:
 * @param {object} conversation - The conversation data
 * @param {boolean} isActive - Whether this conversation is currently selected
 * @param {function} onClick - Handler for selecting this conversation
 * @param {function} onPin - Handler for pinning/unpinning
 * @param {function} onDelete - Handler for deleting
 * @param {function} onRename - Handler for renaming
 * 
 * Why this is a separate component:
 * - Reusable: Used in conversation list, search results, pinned section
 * - Maintainable: Changes to conversation display happen in one place
 * - Testable: Can test hover states, click handlers independently
 */
export function ConversationItem({
  conversation,
  isActive = false,
  onClick,
  onPin,
  onDelete,
  onRename,
}) {
  const { title, lastMessage, timestamp, isPinned, messageCount, model } = conversation

  return (
    <div
      onClick={onClick}
      className={cn(
        // Base styles
        'group relative flex items-start gap-3 rounded-lg p-3 cursor-pointer',
        'transition-all duration-200',
        // Hover state
        'hover:bg-sidebar-accent',
        // Active state
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border'
          : 'text-sidebar-foreground border border-transparent',
        // Pinned state subtle background
        isPinned && !isActive && 'bg-sidebar-accent/30'
      )}
      role="button"
      tabIndex={0}
      aria-label={`Conversation: ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      {/* Conversation Icon */}
      <div className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
        isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-sidebar-accent text-sidebar-foreground'
      )}>
        <MessageSquare size={18} />
      </div>

      {/* Conversation Content */}
      <div className="flex-1 min-w-0">
        {/* Title Row */}
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium truncate flex-1">
            {title}
          </h3>
          
          {/* Pinned Indicator */}
          {isPinned && (
            <Pin size={12} className="shrink-0 text-muted-foreground" />
          )}
        </div>

        {/* Last Message Preview */}
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {lastMessage}
        </p>

        {/* Metadata Row */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-muted-foreground/70">
            {timeAgo(timestamp)}
          </span>
          <span className="text-xs text-muted-foreground/50">·</span>
          <span className="text-xs text-muted-foreground/70">
            {messageCount} msgs
          </span>
          <span className="text-xs text-muted-foreground/50">·</span>
          <span className="text-xs text-muted-foreground/70">
            {model}
          </span>
        </div>
      </div>

      {/* Actions Dropdown (visible on hover) */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation()
              onPin?.()
            }}>
              <Pin size={14} className="mr-2" />
              {isPinned ? 'Unpin' : 'Pin'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation()
              onRename?.()
            }}>
              <Edit3 size={14} className="mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.()
              }}
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}