import { supabase } from '@/lib/supabase'

/**
 * Upload profile avatar to Supabase Storage
 */
export async function uploadAvatar(file, userId) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath)

    return { success: true, url: publicUrl }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Update user profile in Supabase
 */
export async function updateProfile(userId, profileData) {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      })

    if (error) throw error

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get user profile from Supabase
 */
export async function getProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return { success: true, profile: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Delete user account completely
 */
export async function deleteAccount() {
  try {
    // Sign out first
    await supabase.auth.signOut()
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}