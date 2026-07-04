import { supabase } from '@/lib/supabase'

/**
 * Generate a random API key
 */
function generateAPIKey() {
  const prefix = 'ai_studio_'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return prefix + result
}

/**
 * Get all API keys for a user
 */
export async function getAPIKeys(userId) {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, keys: data || [] }
  } catch (error) {
    console.error('getAPIKeys error:', error)
    return { success: false, error: error.message, keys: [] }
  }
}

/**
 * Create a new API key
 */
export async function createAPIKey(userId, name = 'Default Key') {
  try {
    const key = generateAPIKey()

    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        name: name,
        key: key,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, key: data }
  } catch (error) {
    console.error('createAPIKey error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Revoke an API key
 */
export async function revokeAPIKey(keyId, userId) {
  try {
    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: false, revoked_at: new Date().toISOString() })
      .eq('id', keyId)
      .eq('user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('revokeAPIKey error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete an API key
 */
export async function deleteAPIKey(keyId, userId) {
  try {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId)
      .eq('user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('deleteAPIKey error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Update API key name
 */
export async function updateAPIKeyName(keyId, userId, name) {
  try {
    const { error } = await supabase
      .from('api_keys')
      .update({ name })
      .eq('id', keyId)
      .eq('user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('updateAPIKeyName error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get API usage stats for a user
 */
export async function getAPIUsage(userId) {
  try {
    // Get total API calls this month
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const { count, error } = await supabase
      .from('api_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', firstOfMonth)

    if (error) throw error

    return {
      success: true,
      usage: {
        totalCalls: count || 0,
        limit: 10000,
        remaining: 10000 - (count || 0),
      },
    }
  } catch (error) {
    return {
      success: false,
      usage: { totalCalls: 0, limit: 10000, remaining: 10000 },
    }
  }
}