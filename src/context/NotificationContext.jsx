import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  subscribeToNotifications,
} from '@/services/notifications'

const NotificationContext = createContext(null)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const unsubscribeRef = useRef(null)

  // Load notifications when user changes
  useEffect(() => {
    if (user?.id) {
      console.log('📥 Loading notifications for user:', user.id)
      loadNotifications()
      loadUnreadCount()
    } else {
      setNotifications([])
      setUnreadCount(0)
      setIsLoading(false)
    }
  }, [user?.id])

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user?.id) {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
      return
    }

    console.log('🔌 Subscribing to real-time notifications for:', user.id)

    unsubscribeRef.current = subscribeToNotifications(user.id, (newNotification) => {
      console.log('📨 Real-time notification received:', newNotification)
      
      // Add to notifications list
      setNotifications((prev) => [newNotification, ...prev])
      
      // Update unread count
      setUnreadCount((prev) => prev + 1)

      // Show browser notification
      showBrowserNotification(newNotification)

      // Play notification sound
      playNotificationSound()
    })

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [user?.id])

  const loadNotifications = async () => {
    if (!user?.id) return
    const { success, notifications: data } = await getNotifications(user.id)
    if (success) {
      setNotifications(data || [])
    }
    setIsLoading(false)
  }

  const loadUnreadCount = async () => {
    if (!user?.id) return
    const { success, count } = await getUnreadCount(user.id)
    if (success) {
      setUnreadCount(count)
    }
  }

  const handleMarkAsRead = async (id) => {
    const { success } = await markAsRead(id)
    if (success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return
    const { success } = await markAllAsRead(user.id)
    if (success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    }
  }

  const handleDelete = async (id) => {
    const { success } = await deleteNotification(id)
    if (success) {
      const wasUnread = notifications.find((n) => n.id === id)?.read === false
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    }
  }

  const value = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDelete,
    refreshNotifications: loadNotifications,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

/**
 * Show browser notification
 */
function showBrowserNotification(notification) {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  try {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      tag: `notification-${notification.id}`,
    })
  } catch (e) {
    console.log('Browser notification failed:', e)
  }
}

/**
 * Play notification sound
 */
function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return

    const ctx = new AudioContext()
    const now = ctx.currentTime

    const frequencies = [800, 1000, 1200]
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.1)
      gain.gain.setValueAtTime(0, now + i * 0.1)
      gain.gain.linearRampToValueAtTime(0.08, now + i * 0.1 + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.1)
      osc.stop(now + i * 0.1 + 0.3)
    })
  } catch (e) {
    // Silently fail
  }
}

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'denied'
  if (Notification.permission === 'granted') return 'granted'
  try {
    return await Notification.requestPermission()
  } catch (e) {
    return 'denied'
  }
}