import { supabase } from '@/lib/supabase'

/**
 * Get user notifications
 */
export async function getNotifications(userId) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return { success: true, notifications: data || [] }
  } catch (error) {
    console.error('getNotifications error:', error)
    return { success: false, error: error.message, notifications: [] }
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId) {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw error
    return { success: true, count: count || 0 }
  } catch (error) {
    console.error('getUnreadCount error:', error)
    return { success: false, count: 0 }
  }
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('markAsRead error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(userId) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('markAllAsRead error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId) {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('deleteNotification error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Subscribe to real-time notifications
 * Returns unsubscribe function
 */
export function subscribeToNotifications(userId, callback) {
  if (!userId) return () => {}

  const channel = supabase
    .channel(`notifications-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('🔔 New notification received:', payload.new)
        callback(payload.new)
      }
    )
    .subscribe((status) => {
      console.log(`Notification subscription status for ${userId}:`, status)
    })

  return () => {
    console.log(`Unsubscribing notifications for ${userId}`)
    channel.unsubscribe()
  }
}

/**
 * Create a notification for a specific user
 */
export async function createNotification({ userId, title, message, type = 'info', link = '' }) {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        link,
        read: false,
      })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('createNotification error:', error)
    return { success: false, error: error.message }
  }
}