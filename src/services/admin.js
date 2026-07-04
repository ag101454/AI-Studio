import { supabase } from '@/lib/supabase'

/**
 * Get all users for admin panel
 */
export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, users: data }
  } catch (error) {
    console.error('getAllUsers error:', error)
    return { success: false, error: error.message, users: [] }
  }
}

/**
 * Get user count
 */
export async function getUserCount() {
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return { success: true, count: count || 0 }
  } catch (error) {
    console.error('getUserCount error:', error)
    return { success: false, count: 0 }
  }
}

/**
 * Get notification stats
 */
export async function getNotificationStats() {
  try {
    const { count: totalSent, error: sentError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })

    const { count: totalRead, error: readError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('read', true)

    if (sentError) throw sentError
    if (readError) throw readError

    return {
      success: true,
      totalSent: totalSent || 0,
      totalRead: totalRead || 0,
      totalUnread: (totalSent || 0) - (totalRead || 0),
    }
  } catch (error) {
    console.error('getNotificationStats error:', error)
    return { success: false, totalSent: 0, totalRead: 0, totalUnread: 0 }
  }
}

/**
 * Send notification to ALL users
 */
export async function notifyAllUsers({ title, message, type = 'info', link = '' }) {
  try {
    // Get all user IDs from profiles table
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id')

    if (userError) throw userError

    if (!users || users.length === 0) {
      return { success: false, error: 'No users found in the database' }
    }

    // Create notification object for each user
    const notifications = users.map((user) => ({
      user_id: user.id,
      title,
      message,
      type,
      link,
      read: false,
    }))

    // Insert all notifications at once
    const { error: insertError } = await supabase
      .from('notifications')
      .insert(notifications)

    if (insertError) throw insertError

    console.log(`✅ Sent notification to ${users.length} users`)
    return { success: true, count: users.length }
  } catch (error) {
    console.error('notifyAllUsers error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send notification to a specific user
 */
export async function notifyUser(userId, { title, message, type = 'info', link = '' }) {
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

    console.log(`✅ Sent notification to user: ${userId}`)
    return { success: true }
  } catch (error) {
    console.error('notifyUser error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send notification to multiple selected users
 */
export async function notifyMultipleUsers(userIds, { title, message, type = 'info', link = '' }) {
  try {
    if (!userIds || userIds.length === 0) {
      return { success: false, error: 'No users selected' }
    }

    const notifications = userIds.map((userId) => ({
      user_id: userId,
      title,
      message,
      type,
      link,
      read: false,
    }))

    const { error } = await supabase
      .from('notifications')
      .insert(notifications)

    if (error) throw error

    console.log(`✅ Sent notification to ${userIds.length} users`)
    return { success: true, count: userIds.length }
  } catch (error) {
    console.error('notifyMultipleUsers error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get recent notification log
 */
export async function getNotificationLog(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Get user info for each notification
    const enrichedData = await Promise.all(
      data.map(async (notification) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', notification.user_id)
          .single()

        return {
          ...notification,
          profiles: profile || { full_name: 'Unknown', email: 'Unknown' },
        }
      })
    )

    return { success: true, log: enrichedData }
  } catch (error) {
    console.error('getNotificationLog error:', error)
    return { success: false, error: error.message, log: [] }
  }
}