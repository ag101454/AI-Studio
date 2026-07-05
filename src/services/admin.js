import { supabase } from '@/lib/supabase'

/**
 * Get ALL users - from auth.users via Supabase
 */
export async function getAllUsers() {
  try {
    // Get users from profiles table (synced with auth)
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (profileError) throw profileError

    // Also get users directly from auth if possible
    let authUsers = []
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
      if (!authError && authData) {
        authUsers = authData.users.map(u => ({
          id: u.id,
          email: u.email,
          full_name: u.user_metadata?.full_name || '',
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
        }))
      }
    } catch (e) {
      console.log('Admin listUsers not available, using profiles only')
    }

    // Merge both sources
    const allUsers = profiles || []
    
    // Add any auth users not in profiles
    if (authUsers.length > 0) {
      const profileIds = new Set(allUsers.map(u => u.id))
      authUsers.forEach(u => {
        if (!profileIds.has(u.id)) {
          allUsers.push(u)
        }
      })
    }

    return { success: true, users: allUsers }
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

    if (sentError || readError) throw sentError || readError

    return {
      success: true,
      totalSent: totalSent || 0,
      totalRead: totalRead || 0,
      totalUnread: (totalSent || 0) - (totalRead || 0),
    }
  } catch (error) {
    return { success: false, totalSent: 0, totalRead: 0, totalUnread: 0 }
  }
}

/**
 * Send notification to ALL users
 */
export async function notifyAllUsers({ title, message, type = 'info', link = '' }) {
  try {
    // Get ALL user IDs from profiles
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id')

    if (userError) throw userError

    if (!users || users.length === 0) {
      return { success: false, error: 'No users found in the database' }
    }

    // Create notification for EACH user
    const notifications = users.map((user) => ({
      user_id: user.id,
      title,
      message,
      type,
      link,
      read: false,
    }))

    // Insert all notifications
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
 * Send notification to specific user
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
    return { success: true }
  } catch (error) {
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
    return { success: false, error: error.message }
  }
}

/**
 * Get notification log
 */
export async function getNotificationLog(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    const enrichedData = await Promise.all(
      (data || []).map(async (notification) => {
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
    return { success: false, error: error.message, log: [] }
  }
}