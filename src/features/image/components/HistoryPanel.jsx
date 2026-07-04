import { Clock, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { timeAgo } from '@/utils/formatDate'
import { cn } from '@/lib/utils'

/**
 * HistoryPanel Component
 * 
 * Shows past image generations in a scrollable list.
 * 
 * Features:
 * - Thumbnail preview
 * - Prompt text (truncated)
 * - Timestamp
 * - Image count badge
 * - Delete button (hover)
 * - Active state highlighting
 * - Empty state
 * 
 * @param {array} history - List of past generations
 * @param {string} activeId - Currently selected generation ID
 * @param {function} onSelect - Callback when a history item is clicked
 * @param {function} onDelete - Callback to delete a history item
 */
export function HistoryPanel({ history = [], activeId, onSelect, onDelete }) {
  // Empty State
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center h-full">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">
          No history yet
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          Your generated images will appear here
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect?.(item)}
            className={cn(
              'group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200',
              'hover:bg-muted',
              activeId === item.id
                ? 'bg-primary/5 border border-primary/20 shadow-sm'
                : 'border border-transparent'
            )}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect?.(item)
              }
            }}
          >
            {/* Thumbnail */}
            <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0 ring-1 ring-border">
              {item.images && item.images[0] ? (
                <img
                  src={item.images[0].url}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Clock size={20} className="text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {item.prompt}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {timeAgo(item.createdAt)}
                </span>
                {item.imageCount && (
                  <>
                    <span className="text-xs text-muted-foreground">·</span>
                    <Badge variant="outline" className="text-xs px-1.5 py-0 font-normal">
                      {item.imageCount} image{item.imageCount !== 1 ? 's' : ''}
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Delete Button - Visible on hover */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(item.id)
              }}
              aria-label={`Delete ${item.prompt}`}
            >
              <Trash2 size={14} className="text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}