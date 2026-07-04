import { Menu, Bell, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationContext'

/**
 * Navbar Component
 * 
 * Top navigation bar with real-time notifications.
 * Turmeric & Malt themed with frosted glass effect.
 */
export function Navbar({ onMenuClick, sidebarOpen }) {
  const { user, signOut } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications()
  const navigate = useNavigate()

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
   * Handle user logout
   */
  const handleLogout = async () => {
    await signOut()
    navigate('/auth/login')
  }

  /**
   * Format relative time
   */
  const timeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const seconds = Math.floor((now - date) / 1000)

    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  /**
   * Get notification icon based on type
   */
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  /**
   * Get notification type styles
   */
  const getNotificationTypeStyles = (type) => {
    switch (type) {
      case 'success': return { bg: 'bg-green-100', text: 'text-green-600' }
      case 'warning': return { bg: 'bg-amber-100', text: 'text-amber-600' }
      case 'error': return { bg: 'bg-red-100', text: 'text-red-600' }
      default: return { bg: 'bg-blue-100', text: 'text-blue-600' }
    }
  }

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 lg:px-6"
      style={{
        backgroundColor: 'rgba(253, 250, 242, 0.85)',
        borderColor: '#e8d9b0',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden shrink-0"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        style={{ color: '#3d2e14' }}
      >
        <Menu size={20} />
      </Button>

      {/* Left Spacer */}
      <div className="flex-1 lg:flex-none" />

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: '#b8a87e' }}
          />
          <Input
            type="search"
            placeholder="Search anything..."
            className="pl-9 transition-all rounded-xl border-2"
            style={{
              backgroundColor: 'rgba(245, 236, 215, 0.5)',
              borderColor: '#d4c9a8',
              color: '#3d2e14',
            }}
          />
        </div>
      </div>

      {/* Right Spacer */}
      <div className="flex-1 md:hidden" />

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Search"
          style={{ color: '#7d6e46' }}
        >
          <Search size={18} />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
              style={{ color: '#7d6e46' }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold ring-2 animate-pulse"
                  style={{
                    backgroundColor: '#c8870a',
                    color: '#fdfaf2',
                    ringColor: '#fdfaf2',
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-96 rounded-2xl shadow-xl overflow-hidden"
            style={{
              backgroundColor: '#fdfaf2',
              borderColor: '#e8d9b0',
            }}
          >
            {/* Notification Header */}
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: '#e8d9b0' }}
            >
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm font-semibold" style={{ color: '#3d2e14' }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <Badge
                    className="text-xs font-medium border-0"
                    style={{
                      backgroundColor: '#c8870a',
                      color: '#fdfaf2',
                    }}
                  >
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs h-auto py-1 font-medium"
                  style={{ color: '#c8870a' }}
                >
                  Mark all read
                </Button>
              )}
            </div>

            {/* Notification List */}
            <ScrollArea className="max-h-[420px]">
              {notifications.length === 0 ? (
                <div className="py-16 text-center px-4">
                  <Bell className="mx-auto h-12 w-12 mb-4" style={{ color: '#d4c9a8' }} />
                  <p className="text-sm font-semibold" style={{ color: '#3d2e14' }}>
                    No notifications yet
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#b8a87e' }}>
                    We'll notify you when something happens.
                  </p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => {
                    const typeStyles = getNotificationTypeStyles(notification.type)
                    return (
                      <div
                        key={notification.id}
                        onClick={() => {
                          if (!notification.read) markAsRead(notification.id)
                          if (notification.link) navigate(notification.link)
                        }}
                        className={`flex items-start gap-3 p-4 border-b cursor-pointer transition-colors hover:bg-malt-50/50 group ${
                          !notification.read ? 'bg-turmeric-50/20' : ''
                        }`}
                        style={{ borderColor: '#f5ecd7' }}
                      >
                        {/* Notification Icon */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm ${typeStyles.bg} ${typeStyles.text}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Notification Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm leading-snug ${
                                !notification.read ? 'font-semibold' : 'font-medium'
                              }`}
                              style={{ color: '#3d2e14' }}
                            >
                              {notification.title}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="shrink-0 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-0.5 rounded"
                              style={{ color: '#c4b098' }}
                              aria-label="Delete notification"
                            >
                              ✕
                            </button>
                          </div>
                          <p
                            className="text-xs mt-0.5 leading-relaxed"
                            style={{ color: '#7d6e46' }}
                          >
                            {notification.message}
                          </p>
                          <p className="text-xs mt-1.5" style={{ color: '#b8a87e' }}>
                            {timeAgo(notification.created_at)}
                          </p>
                        </div>

                        {/* Unread indicator */}
                        {!notification.read && (
                          <div
                            className="w-2 h-2 rounded-full shrink-0 mt-2"
                            style={{ backgroundColor: '#c8870a' }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            {notifications.length > 0 && (
              <div
                className="p-3 border-t text-center"
                style={{ borderColor: '#e8d9b0' }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-medium w-full"
                  style={{ color: '#9c8c62' }}
                >
                  View all notifications
                </Button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full ml-1"
              aria-label="User menu"
            >
              <Avatar
                className="h-8 w-8 transition-transform hover:scale-105 ring-2 ring-offset-1"
                style={{
                  borderColor: '#f0c75e',
                  backgroundColor: '#fdfaf2',
                }}
              >
                <AvatarFallback
                  className="text-sm font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #c8870a, #e6a817)',
                    color: '#fdfaf2',
                  }}
                >
                  {getInitials(user?.user_metadata?.full_name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-2xl shadow-xl"
            style={{
              backgroundColor: '#fdfaf2',
              borderColor: '#e8d9b0',
            }}
          >
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium" style={{ color: '#3d2e14' }}>
                  {displayName}
                </span>
                <span className="text-xs font-normal" style={{ color: '#b8a87e' }}>
                  {user?.email || ''}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator style={{ backgroundColor: '#e8d9b0' }} />

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate('/dashboard/profile')}
              style={{ color: '#3d2e14' }}
            >
              👤 Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/dashboard/settings')}>
                ⚙️ Settings
                </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/dashboard/api-keys')}>
                🔑 API Keys
                </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              style={{ color: '#3d2e14' }}
            >
              💳 Billing & Subscription
            </DropdownMenuItem>

            <DropdownMenuSeparator style={{ backgroundColor: '#e8d9b0' }} />

            <DropdownMenuItem
              className="cursor-pointer"
              style={{ color: '#3d2e14' }}
            >
              📚 Help & Documentation
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              style={{ color: '#3d2e14' }}
            >
              🎉 What's New
            </DropdownMenuItem>

            <DropdownMenuSeparator style={{ backgroundColor: '#e8d9b0' }} />

            <DropdownMenuItem
              className="cursor-pointer font-semibold"
              onClick={handleLogout}
              style={{ color: '#dc2626' }}
            >

              🚪 Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}