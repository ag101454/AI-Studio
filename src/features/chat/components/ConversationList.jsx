import { useState } from 'react'
import { Plus, Search, Pin, Archive, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ConversationItem } from './ConversationItem'
import { mockConversations } from '@/mock/chat'
import { cn } from '@/lib/utils'

/**
 * ConversationList Component
 * 
 * Left panel showing all conversations with search and filtering.
 * 
 * @param {string} activeConversationId - Currently selected conversation
 * @param {function} onSelectConversation - Callback when conversation is clicked
 * @param {function} onNewChat - Callback to start a new chat
 */
export function ConversationList({ activeConversationId, onSelectConversation, onNewChat }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)

  /**
   * Filter conversations based on search query
   */
  const filteredConversations = mockConversations.filter((conv) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      conv.title.toLowerCase().includes(query) ||
      conv.lastMessage.toLowerCase().includes(query)
    )
  })

  // Separate conversations by state
  const pinnedConversations = filteredConversations.filter((c) => c.isPinned && !c.isArchived)
  const activeConversations = filteredConversations.filter((c) => !c.isPinned && !c.isArchived)
  const archivedConversations = filteredConversations.filter((c) => c.isArchived)

  /**
   * Mock handlers - will connect to API later
   */
  const handlePin = (id) => {
    console.log('Toggle pin for:', id)
  }

  const handleDelete = (id) => {
    console.log('Delete:', id)
  }

  const handleRename = (id) => {
    console.log('Rename:', id)
  }

  return (
    <div className="flex h-full flex-col border-r border-sidebar-border bg-sidebar">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-lg font-semibold text-sidebar-foreground">
            Chats
          </h2>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            onClick={onNewChat}
            aria-label="New conversation"
          >
            <Plus size={18} />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground focus:bg-sidebar-accent/80"
          />
        </div>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {/* Empty State - No search results */}
          {filteredConversations.length === 0 && searchQuery && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Search className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-sidebar-foreground">
                No conversations found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try a different search term
              </p>
            </div>
          )}

          {/* Empty State - No conversations at all */}
          {mockConversations.length === 0 && !searchQuery && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-sidebar-foreground">
                No conversations yet
              </p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Start a new chat to begin
              </p>
              <Button
                size="sm"
                onClick={onNewChat}
                className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 gap-1.5"
              >
                <Plus size={14} />
                New Chat
              </Button>
            </div>
          )}

          {/* Pinned Conversations */}
          {pinnedConversations.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-1.5 px-2 py-1">
                <Pin size={12} className="text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Pinned
                </span>
                <span className="text-xs text-muted-foreground/60">
                  ({pinnedConversations.length})
                </span>
              </div>
              {pinnedConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={activeConversationId === conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  onPin={() => handlePin(conv.id)}
                  onDelete={() => handleDelete(conv.id)}
                  onRename={() => handleRename(conv.id)}
                />
              ))}
            </div>
          )}

          {/* Active Conversations */}
          {activeConversations.length > 0 && (
            <div>
              {pinnedConversations.length > 0 && (
                <div className="flex items-center gap-1.5 px-2 py-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Recent
                  </span>
                </div>
              )}
              {activeConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={activeConversationId === conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  onPin={() => handlePin(conv.id)}
                  onDelete={() => handleDelete(conv.id)}
                  onRename={() => handleRename(conv.id)}
                />
              ))}
            </div>
          )}

          {/* Archived Conversations */}
          {archivedConversations.length > 0 && (
            <div>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className="flex items-center gap-1.5 px-2 py-1 w-full text-left hover:bg-sidebar-accent/50 rounded transition-colors"
              >
                <Archive size={12} className="text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Archived
                </span>
                <span className="text-xs text-muted-foreground/60">
                  ({archivedConversations.length})
                </span>
              </button>
              {showArchived && archivedConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={activeConversationId === conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  onPin={() => handlePin(conv.id)}
                  onDelete={() => handleDelete(conv.id)}
                  onRename={() => handleRename(conv.id)}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Bottom Info */}
      <div className="p-3 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">
          {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}