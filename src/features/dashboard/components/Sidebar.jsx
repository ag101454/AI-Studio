import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { mainNavigation, adminNavigation } from '@/mock/navigation'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

/**
 * Sidebar Component
 * 
 * Collapsible sidebar with real user data and admin links.
 * Turmeric & Malt themed.
 */
export function Sidebar({ isOpen, onToggle }) {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth()

  // Check if user is admin
  const isAdmin = user?.app_metadata?.role === 'admin' || user?.email === 'demo@aistudio.com'

  // Combine navigation based on role
  const allNavigation = isAdmin
    ? [...mainNavigation, ...adminNavigation]
    : mainNavigation

  /**
   * Get user initials for avatar
   */
  const getInitials = (name) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  /**
   * Get display name
   */
  const displayName = user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'User'

  /**
   * Get display email
   */
  const displayEmail = user?.email || ''

  /**
   * Filter navigation items based on search query
   */
  const filteredNavigation = allNavigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isOpen ? 280 : 72,
        transition: { duration: 0.3, ease: 'easeInOut' },
      }}
      className={cn(
        'fixed left-0 top-0 z-40 h-screen',
        'flex flex-col',
        'overflow-hidden'
      )}
      style={{
        background: 'linear-gradient(180deg, #3d2e14 0%, #2d1f0a 100%)',
        borderRight: '1px solid rgba(232, 201, 122, 0.1)',
      }}
    >
      {/* Logo Area */}
      <div
        className="flex h-16 items-center justify-between px-4 border-b shrink-0"
        style={{ borderColor: 'rgba(232, 201, 122, 0.1)' }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #c8870a, #e6a817)',
                }}
              >
                <span className="text-sm font-bold" style={{ color: '#fdfaf2' }}>AI</span>
              </div>
              <span className="font-heading text-lg font-semibold" style={{ color: '#f5ecd7' }}>
                AI Studio
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg mx-auto"
              style={{
                background: 'linear-gradient(135deg, #c8870a, #e6a817)',
              }}
            >
              <span className="text-sm font-bold" style={{ color: '#fdfaf2' }}>AI</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="shrink-0 hover:bg-white/5"
          style={{ color: '#b8a87e' }}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>

      {/* Search */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pt-3"
          >
            <div className="relative">
              <Search
                className="absolute left-2.5 top-2.5 h-4 w-4"
                style={{ color: '#7d6e46' }}
              />
              <Input
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 rounded-lg"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(232, 201, 122, 0.15)',
                  color: '#f5ecd7',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Chat Button */}
      <div className="px-3 pt-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/dashboard/chat">
              <Button
                className={cn(
                  'w-full transition-all',
                  !isOpen && 'px-2'
                )}
                style={{
                  background: 'linear-gradient(135deg, #c8870a, #9e6b08)',
                  color: '#fdfaf2',
                }}
              >
                <Plus size={18} />
                {isOpen && <span className="ml-2">New Chat</span>}
              </Button>
            </Link>
          </TooltipTrigger>
          {!isOpen && (
            <TooltipContent side="right">
              New Chat
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      <Separator
        className="my-3"
        style={{ backgroundColor: 'rgba(232, 201, 122, 0.1)' }}
      />

      {/* Navigation Links */}
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-4">
          {filteredNavigation.map((section) => (
            <div key={section.section}>
              {isOpen && (
                <h3
                  className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: '#9c8c62' }}
                >
                  {section.section}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path
                  const Icon = item.icon

                  return (
                    <li key={item.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            to={item.path}
                            className={cn(
                              'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                              !isOpen && 'justify-center px-2'
                            )}
                            style={{
                              color: isActive ? '#fdfaf2' : '#b8a87e',
                              backgroundColor: isActive
                                ? 'rgba(200, 135, 10, 0.25)'
                                : 'transparent',
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                                e.currentTarget.style.color = '#f5ecd7'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                e.currentTarget.style.color = '#b8a87e'
                              }
                            }}
                          >
                            <Icon size={20} />
                            {isOpen && (
                              <span className="ml-3 flex-1">{item.label}</span>
                            )}
                            {isOpen && item.badge && (
                              <span
                                className="ml-auto rounded-full px-2 py-0.5 text-xs font-semibold"
                                style={{
                                  backgroundColor: item.badge === 'Admin'
                                    ? 'rgba(239, 68, 68, 0.2)'
                                    : 'rgba(200, 135, 10, 0.3)',
                                  color: item.badge === 'Admin' ? '#fca5a5' : '#f0c75e',
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </TooltipTrigger>
                        {!isOpen && (
                          <TooltipContent side="right">
                            <p>{item.label}</p>
                            {item.badge && (
                              <p className="text-xs text-muted-foreground">{item.badge}</p>
                            )}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Profile (bottom) */}
      <div
        className="p-3 shrink-0"
        style={{ borderTop: '1px solid rgba(232, 201, 122, 0.1)' }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/dashboard/profile"
              className={cn(
                'flex items-center rounded-lg p-2 transition-all hover:bg-white/5',
                !isOpen && 'justify-center'
              )}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg, #c8870a, #e6a817)',
                  color: '#fdfaf2',
                }}
              >
                {getInitials(user?.user_metadata?.full_name)}
              </div>
              {isOpen && (
                <div className="ml-3 flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: '#f5ecd7' }}
                  >
                    {displayName}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: '#9c8c62' }}
                  >
                    {displayEmail}
                  </p>
                </div>
              )}
            </Link>
          </TooltipTrigger>
          {!isOpen && (
            <TooltipContent side="right">
              <p className="font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{displayEmail}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </motion.aside>
  )
}