import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    LayoutDashboard, Users, Bell, Send, Search, Check,
    Loader2, TrendingUp, Eye, EyeOff, Clock, Filter,
    UserCheck, UserX, MessageSquare, AlertTriangle,
    RefreshCw, ChevronDown, X, Trash2, Mail, RotateCcw
  } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageTransition } from '@/components/ui/PageTransition'
import {
  getAllUsers, getUserCount, getNotificationStats, getNotificationLog,
  notifyAllUsers, notifyUser, notifyMultipleUsers
} from '@/services/admin'
import { useAuth } from '@/context/AuthContext'

export function AdminPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('send')
  const [users, setUsers] = useState([])
  const [userCount, setUserCount] = useState(0)
  const [stats, setStats] = useState({ totalSent: 0, totalRead: 0, totalUnread: 0 })
  const [log, setLog] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [sent, setSent] = useState(false)
  const [sentCount, setSentCount] = useState(0)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // Notification form
  const [notifTitle, setNotifTitle] = useState('')
  const [notifMessage, setNotifMessage] = useState('')
  const [notifType, setNotifType] = useState('info')
  const [notifLink, setNotifLink] = useState('')

  // Load all data on mount and when tab changes
  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setIsLoading(true)
    setError('')

    try {
      const [usersRes, countRes, statsRes, logRes] = await Promise.all([
        getAllUsers(),
        getUserCount(),
        getNotificationStats(),
        getNotificationLog(),
      ])

      if (usersRes.success) setUsers(usersRes.users || [])
      if (countRes.success) setUserCount(countRes.count)
      if (statsRes.success) setStats(statsRes)
      if (logRes.success) setLog(logRes.log || [])
    } catch (err) {
      setError('Failed to load data. Please try again.')
    }

    setIsLoading(false)
  }

  const filteredUsers = users.filter((u) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      (u.full_name || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term)
    )
  })

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSendToAll = async () => {
    if (!notifTitle.trim() || !notifMessage.trim()) {
      setError('Title and message are required')
      return
    }

    setError('')
    setIsSending(true)

    const result = await notifyAllUsers({
      title: notifTitle.trim(),
      message: notifMessage.trim(),
      type: notifType,
      link: notifLink.trim(),
    })

    setIsSending(false)

    if (result.success) {
      setSentCount(result.count)
      setShowSuccess(true)
      resetForm()
      loadData()
      setTimeout(() => setShowSuccess(false), 5000)
    } else {
      setError(result.error || 'Failed to send notifications')
    }
  }

  const handleSendToSelected = async () => {
    if (!notifTitle.trim() || !notifMessage.trim()) {
      setError('Title and message are required')
      return
    }

    if (selectedUsers.length === 0) {
      setError('Please select at least one user')
      return
    }

    setError('')
    setIsSending(true)

    const result = await notifyMultipleUsers(selectedUsers, {
      title: notifTitle.trim(),
      message: notifMessage.trim(),
      type: notifType,
      link: notifLink.trim(),
    })

    setIsSending(false)

    if (result.success) {
      setSentCount(result.count)
      setShowSuccess(true)
      resetForm()
      setSelectedUsers([])
      setSelectAll(false)
      loadData()
      setTimeout(() => setShowSuccess(false), 5000)
    } else {
      setError(result.error || 'Failed to send notifications')
    }
  }

  const handleSendToOne = async (userId) => {
    if (!notifTitle.trim() || !notifMessage.trim()) {
      setError('Title and message are required')
      return
    }

    setError('')
    setIsSending(true)

    const result = await notifyUser(userId, {
      title: notifTitle.trim(),
      message: notifMessage.trim(),
      type: notifType,
      link: notifLink.trim(),
    })

    setIsSending(false)

    if (result.success) {
      setSentCount(1)
      setShowSuccess(true)
      resetForm()
      loadData()
      setTimeout(() => setShowSuccess(false), 5000)
    } else {
      setError(result.error || 'Failed to send notification')
    }
  }

  const resetForm = () => {
    setNotifTitle('')
    setNotifMessage('')
    setNotifType('info')
    setNotifLink('')
  }

  const timeAgo = (dateString) => {
    if (!dateString) return 'Unknown'
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  const tabs = [
    { id: 'send', label: 'Send Notification', icon: Send },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'log', label: 'Notification Log', icon: Clock },
  ]

  return (
    <PageTransition>
      <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 bg-gradient-to-br from-malt-50 via-white to-malt-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-malt-200 bg-white/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-200">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold" style={{ color: '#3d2e14' }}>
                Admin Panel
              </h1>
              <p className="text-xs" style={{ color: '#9c8c62' }}>
                Manage users & send real-time notifications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={isLoading}
              className="gap-1.5 rounded-lg"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </Button>
            <Badge className="bg-red-100 text-red-700 border-0 text-xs font-medium">
              Admin Access
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 py-3 border-b border-malt-100 bg-white/50 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-foreground shadow-sm border border-malt-200'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-6 max-w-5xl mx-auto space-y-6">

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users', value: userCount, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { label: 'Sent', value: stats.totalSent, icon: Send, color: 'text-green-500', bg: 'bg-green-50' },
                  { label: 'Read', value: stats.totalRead, icon: Eye, color: 'text-amber-500', bg: 'bg-amber-50' },
                  { label: 'Unread', value: stats.totalUnread, icon: EyeOff, color: 'text-red-500', bg: 'bg-red-50' },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="bg-white rounded-xl border border-malt-200 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                        <Icon size={16} className={stat.color} />
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  )
                })}
              </div>

              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
                >
                  <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-700">Error</p>
                    <p className="text-xs text-red-500 mt-0.5">{error}</p>
                  </div>
                  <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
                    <X size={16} />
                  </button>
                </motion.div>
              )}

              {/* Success Alert */}
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3"
                >
                  <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-700">Notification Sent!</p>
                    <p className="text-xs text-green-500 mt-0.5">
                      Successfully sent to {sentCount} user{sentCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button onClick={() => setShowSuccess(false)} className="text-green-400 hover:text-green-600">
                    <X size={16} />
                  </button>
                </motion.div>
              )}

              {/* SEND TAB */}
              {activeTab === 'send' && (
                <div className="bg-white rounded-2xl border border-malt-200 p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                      <Send size={18} className="text-turmeric-500" />
                      Compose Notification
                    </h3>
                    <Button variant="ghost" size="sm" onClick={resetForm} className="text-xs gap-1">
                      <RotateCcw size={12} />Reset
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={notifTitle}
                        onChange={(e) => setNotifTitle(e.target.value)}
                        placeholder="e.g., 🚀 New Feature Available!"
                        className="w-full rounded-xl border-2 border-malt-200 bg-malt-50/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-turmeric-50 focus:border-turmeric-300 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        Type
                      </label>
                      <select
                        value={notifType}
                        onChange={(e) => setNotifType(e.target.value)}
                        className="w-full rounded-xl border-2 border-malt-200 bg-malt-50/50 p-3 text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-turmeric-50 focus:border-turmeric-300 transition-all"
                      >
                        <option value="info">ℹ️ Info</option>
                        <option value="success">✅ Success</option>
                        <option value="warning">⚠️ Warning</option>
                        <option value="error">❌ Error</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={notifMessage}
                        onChange={(e) => setNotifMessage(e.target.value)}
                        placeholder="Enter the notification message that users will see..."
                        rows={3}
                        className="w-full rounded-xl border-2 border-malt-200 bg-malt-50/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-turmeric-50 focus:border-turmeric-300 resize-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        Link (optional)
                      </label>
                      <input
                        value={notifLink}
                        onChange={(e) => setNotifLink(e.target.value)}
                        placeholder="/dashboard/chat"
                        className="w-full rounded-xl border-2 border-malt-200 bg-malt-50/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-turmeric-50 focus:border-turmeric-300 transition-all"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Users will be navigated here when they click the notification
                      </p>
                    </div>
                  </div>

                  {/* Send Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      onClick={handleSendToAll}
                      disabled={!notifTitle.trim() || !notifMessage.trim() || isSending}
                      className="flex-1 h-12 gap-2 rounded-xl font-semibold text-base"
                      style={{
                        background: 'linear-gradient(135deg, #c8870a, #9e6b08)',
                        color: '#fdfaf2',
                      }}
                    >
                      {isSending ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                      Send to ALL Users ({userCount})
                    </Button>
                    <Button
                      onClick={handleSendToSelected}
                      disabled={!notifTitle.trim() || !notifMessage.trim() || selectedUsers.length === 0 || isSending}
                      variant="outline"
                      className="h-12 gap-2 rounded-xl font-semibold"
                    >
                      <Users size={18} />
                      Send to Selected ({selectedUsers.length})
                    </Button>
                  </div>
                </div>
              )}

              {/* USERS TAB */}
              {activeTab === 'users' && (
                <div className="bg-white rounded-2xl border border-malt-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-malt-100 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">
                        {filteredUsers.length} User{filteredUsers.length !== 1 ? 's' : ''}
                      </span>
                      {selectedUsers.length > 0 && (
                        <Badge className="bg-turmeric-100 text-turmeric-700 text-xs">
                          {selectedUsers.length} selected
                        </Badge>
                      )}
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or email..."
                        className="pl-9 pr-4 py-2 rounded-lg border border-malt-200 text-sm bg-malt-50/50 w-64 focus:outline-none focus:ring-2 focus:ring-turmeric-50"
                      />
                    </div>
                  </div>

                  {/* Select All */}
                  <div className="px-4 py-2 border-b border-malt-50 bg-malt-50/30">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="rounded w-4 h-4"
                      />
                      <span className="text-muted-foreground">Select all visible users</span>
                    </label>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 size={32} className="animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Users size={40} className="text-muted-foreground mb-3" />
                      <p className="text-sm font-medium text-foreground">No users found</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {searchTerm ? 'Try a different search term' : 'Users will appear here after registration'}
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="max-h-[500px]">
                      {filteredUsers.map((u) => (
                        <div
                          key={u.id}
                          className="flex items-center gap-3 px-4 py-3 border-b border-malt-50 hover:bg-malt-50/30 transition-colors group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(u.id)}
                            onChange={() => handleSelectUser(u.id)}
                            className="rounded w-4 h-4 shrink-0"
                          />
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ background: 'linear-gradient(135deg, #c8870a, #e6a817)' }}
                          >
                            {u.full_name
                              ? u.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                              : u.email?.substring(0, 2).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {u.full_name || 'No name'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {u.email || 'No email'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">
                              {u.id === user?.id ? 'You' : 'User'}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setNotifTitle(`Personal message for ${u.full_name || 'User'}`)
                                setNotifMessage(`Hello! This is a personal notification.`)
                                handleSendToOne(u.id)
                              }}
                              disabled={isSending}
                              className="h-7 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Send size={11} />
                              Send
                            </Button>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  )}
                </div>
              )}

              {/* LOG TAB */}
              {activeTab === 'log' && (
                <div className="bg-white rounded-2xl border border-malt-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-malt-100 flex items-center justify-between">
                    <h3 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      Notification History
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {log.length} records
                    </Badge>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 size={32} className="animate-spin text-muted-foreground" />
                    </div>
                  ) : log.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Bell size={40} className="text-muted-foreground mb-3" />
                      <p className="text-sm font-medium text-foreground">No notifications sent yet</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Send your first notification from the Send tab
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="max-h-[600px]">
                      {log.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 px-4 py-3 border-b border-malt-50 hover:bg-malt-50/20 transition-colors"
                        >
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm ${
                            item.type === 'success' ? 'bg-green-100' :
                            item.type === 'warning' ? 'bg-amber-100' :
                            item.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                          }`}>
                            {getTypeIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{item.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.message}</p>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="text-[10px] text-muted-foreground">
                                {timeAgo(item.created_at)}
                              </span>
                              <span className="text-[10px] text-muted-foreground">·</span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Mail size={10} />
                                {item.profiles?.full_name || item.profiles?.email || 'Unknown User'}
                              </span>
                              <span className="text-[10px] text-muted-foreground">·</span>
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${
                                  item.read
                                    ? 'text-green-500 border-green-200 bg-green-50'
                                    : 'text-amber-500 border-amber-200 bg-amber-50'
                                }`}
                              >
                                {item.read ? '✓ Read' : '● Unread'}
                              </Badge>
                              {item.link && (
                                <>
                                  <span className="text-[10px] text-muted-foreground">·</span>
                                  <span className="text-[10px] text-blue-500 truncate max-w-[150px]">
                                    {item.link}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  )}
                </div>
              )}

            </div>
          </ScrollArea>
        </div>
      </div>
    </PageTransition>
  )
}