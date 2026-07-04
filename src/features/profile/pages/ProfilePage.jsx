import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User, Mail, Camera, Save, Building2, MapPin, Phone,
  Globe, Award, Briefcase, Calendar, Shield, Check,
  AlertTriangle, Loader2, Upload, Trash2, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageTransition } from '@/components/ui/PageTransition'
import { useAuth } from '@/context/AuthContext'
import { uploadAvatar, updateProfile, getProfile, deleteAccount } from '@/services/profile'

export function ProfilePage() {
  const { user, signOut } = useAuth()
  const fileInputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(null)

  const [profile, setProfile] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    company: '',
    role: '',
    website: '',
    github: '',
    twitter: '',
    linkedin: '',
  })

  // Load profile on mount
  useEffect(() => {
    if (user?.id) {
      loadProfile()
    }
  }, [user?.id])

  const loadProfile = async () => {
    const { success, profile: data } = await getProfile(user.id)
    if (success && data) {
      setProfile(prev => ({
        ...prev,
        fullName: data.full_name || prev.fullName,
        phone: data.phone || '',
        location: data.location || '',
        bio: data.bio || '',
        company: data.company || '',
        role: data.role || '',
        website: data.website || '',
        github: data.github || '',
        twitter: data.twitter || '',
        linkedin: data.linkedin || '',
      }))
      if (data.avatar_url) setAvatarUrl(data.avatar_url)
    }
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getMemberSince = () => {
    const created = user?.created_at
    if (!created) return 'Recently'
    return new Date(created).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
  }

  /**
   * Handle avatar upload
   */
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Only JPG, PNG, WebP, and GIF files are allowed')
      return
    }

    setError('')
    setIsUploading(true)

    const result = await uploadAvatar(file, user.id)
    
    if (result.success) {
      setAvatarUrl(result.url)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      setError(result.error || 'Upload failed')
    }
    
    setIsUploading(false)
  }

  /**
   * Save profile to Supabase
   */
  const handleSave = async () => {
    setError('')
    setIsSaving(true)

    const result = await updateProfile(user.id, {
      full_name: profile.fullName,
      phone: profile.phone,
      location: profile.location,
      bio: profile.bio,
      company: profile.company,
      role: profile.role,
      website: profile.website,
      github: profile.github,
      twitter: profile.twitter,
      linkedin: profile.linkedin,
      avatar_url: avatarUrl,
    })

    if (result.success) {
      setIsEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      setError(result.error || 'Failed to save profile')
    }

    setIsSaving(false)
  }

  /**
   * Delete account
   */
  const handleDeleteAccount = async () => {
    setError('')
    setIsDeleting(true)

    const result = await deleteAccount()
    
    if (result.success) {
      await signOut()
      window.location.href = '/'
    } else {
      setError(result.error || 'Failed to delete account')
      setIsDeleting(false)
    }
  }

  return (
    <PageTransition>
      <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 bg-gradient-to-br from-malt-50 via-white to-malt-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-malt-200 bg-white/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-turmeric-500 to-turmeric-600 shadow-lg shadow-turmeric-200">
              <User size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold" style={{ color: '#3d2e14' }}>
                Profile
              </h1>
              <p className="text-xs" style={{ color: '#9c8c62' }}>
                Manage your personal information
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg"
              >
                <Check size={14} />
                Saved!
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 text-sm font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-lg"
              >
                <AlertTriangle size={14} />
                {error}
                <button onClick={() => setError('')} className="ml-1">
                  <X size={14} />
                </button>
              </motion.div>
            )}
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={isSaving || isUploading}
              className="gap-2 rounded-xl font-semibold transition-all duration-300"
              style={{
                background: isEditing
                  ? 'linear-gradient(135deg, #c8870a, #9e6b08)'
                  : 'transparent',
                color: isEditing ? '#fdfaf2' : '#3d2e14',
                border: isEditing ? 'none' : '2px solid #d4c9a8',
                boxShadow: isEditing ? '0 4px 16px rgba(200, 135, 10, 0.25)' : 'none',
              }}
            >
              {isSaving ? (
                <><Loader2 size={16} className="animate-spin" />Saving...</>
              ) : isEditing ? (
                <><Save size={16} />Save Changes</>
              ) : (
                'Edit Profile'
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="max-w-3xl mx-auto p-6 space-y-6">

              {/* Avatar & Basic Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-malt-200 p-6 shadow-sm"
              >
                <div className="flex items-center gap-6">
                  {/* Avatar with upload */}
                  <div className="relative">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-turmeric-400 to-turmeric-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-turmeric-200">
                        {getInitials(profile.fullName)}
                      </div>
                    )}
                    {isEditing && (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-turmeric-500 text-white flex items-center justify-center shadow-lg hover:bg-turmeric-600 transition-colors disabled:opacity-50"
                        >
                          {isUploading ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Camera size={14} />
                          )}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold" style={{ color: '#3d2e14' }}>
                      {profile.fullName || 'Your Name'}
                    </h2>
                    <p className="flex items-center gap-1.5 mt-1" style={{ color: '#9c8c62' }}>
                      <Mail size={14} />
                      {profile.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-turmeric-100 text-turmeric-700 border-0 text-xs font-medium">
                        Pro Plan
                      </Badge>
                      <Badge variant="outline" className="text-xs border-malt-300 text-malt-600">
                        <Calendar size={10} className="mr-1" />
                        Member since {getMemberSince()}
                      </Badge>
                    </div>
                    {isEditing && (
                      <p className="text-xs mt-2" style={{ color: '#b8a87e' }}>
                        <Upload size={12} className="inline mr-1" />
                        Click camera icon to upload photo (JPG, PNG, WebP - max 5MB)
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white rounded-2xl border border-malt-200 p-6 shadow-sm space-y-4"
              >
                <h3 className="font-heading text-lg font-semibold flex items-center gap-2" style={{ color: '#3d2e14' }}>
                  <User size={18} className="text-turmeric-500" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#b8a87e' }}>
                      <User size={12} />Full Name
                    </label>
                    <input
                      value={profile.fullName}
                      onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="John Doe"
                      className="w-full rounded-xl border-2 border-malt-200 bg-malt-50/50 p-3 text-sm font-medium transition-all disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-turmeric-50 focus:border-turmeric-300"
                      style={{ color: '#3d2e14' }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#b8a87e' }}>
                      <Mail size={12} />Email
                    </label>
                    <input
                      value={profile.email}
                      disabled
                      className="w-full rounded-xl border-2 border-malt-200 bg-malt-50/30 p-3 text-sm font-medium opacity-60 cursor-not-allowed"
                      style={{ color: '#3d2e14' }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#b8a87e' }}>
                      <Phone size={12} />Phone
                    </label>
                    <input
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl border-2 border-malt-200 bg-malt-50/50 p-3 text-sm font-medium transition-all disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-turmeric-50 focus:border-turmeric-300"
                      style={{ color: '#3d2e14' }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#b8a87e' }}>
                      <MapPin size={12} />Location
                    </label>
                    <input
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="City, Country"
                      className="w-full rounded-xl border-2 border-malt-200 bg-malt-50/50 p-3 text-sm font-medium transition-all disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-turmeric-50 focus:border-turmeric-300"
                      style={{ color: '#3d2e14' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#b8a87e' }}>
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full rounded-xl border-2 border-malt-200 bg-malt-50/50 p-3 text-sm font-medium transition-all disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-turmeric-50 focus:border-turmeric-300 resize-none"
                    style={{ color: '#3d2e14' }}
                  />
                </div>
              </motion.div>

              {/* Professional Information */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-malt-200 p-6 shadow-sm space-y-4"
              >
                <h3 className="font-heading text-lg font-semibold flex items-center gap-2" style={{ color: '#3d2e14' }}>
                  <Briefcase size={18} className="text-turmeric-500" />
                  Professional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#b8a87e' }}>
                      <Building2 size={12} />Company
                    </label>
                    <input
                      value={profile.company}
                      onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Company name"
                      className="w-full rounded-xl border-2 border-malt-200 bg-malt-50/50 p-3 text-sm font-medium transition-all disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-turmeric-50 focus:border-turmeric-300"
                      style={{ color: '#3d2e14' }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#b8a87e' }}>
                      <Award size={12} />Role
                    </label>
                    <input
                      value={profile.role}
                      onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Job title"
                      className="w-full rounded-xl border-2 border-malt-200 bg-malt-50/50 p-3 text-sm font-medium transition-all disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-turmeric-50 focus:border-turmeric-300"
                      style={{ color: '#3d2e14' }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#b8a87e' }}>
                      <Globe size={12} />Website
                    </label>
                    <input
                      value={profile.website}
                      onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="https://yourwebsite.com"
                      className="w-full rounded-xl border-2 border-malt-200 bg-malt-50/50 p-3 text-sm font-medium transition-all disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-turmeric-50 focus:border-turmeric-300"
                      style={{ color: '#3d2e14' }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl border border-malt-200 p-6 shadow-sm space-y-4"
              >
                <h3 className="font-heading text-lg font-semibold flex items-center gap-2" style={{ color: '#3d2e14' }}>
                  <Globe size={18} className="text-turmeric-500" />
                  Social Links
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: 'GitHub',
                      icon: (
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      ),
                      key: 'github',
                      prefix: 'github.com/',
                    },
                    {
                      label: 'Twitter',
                      icon: (
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      ),
                      key: 'twitter',
                      prefix: 'twitter.com/',
                    },
                    {
                      label: 'LinkedIn',
                      icon: (
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      ),
                      key: 'linkedin',
                      prefix: 'linkedin.com/in/',
                    },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#b8a87e' }}>
                        {field.icon}
                        {field.label}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#c4b098' }}>
                          {field.prefix}
                        </span>
                        <input
                          value={profile[field.key]}
                          onChange={(e) => setProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="username"
                          className="w-full rounded-xl border-2 border-malt-200 bg-malt-50/50 pl-[85px] pr-3 py-3 text-sm font-medium transition-all disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-turmeric-50 focus:border-turmeric-300"
                          style={{ color: '#3d2e14' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Danger Zone */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-red-200 p-6 shadow-sm"
              >
                <h3 className="font-heading text-lg font-semibold flex items-center gap-2 text-red-600">
                  <Shield size={18} />
                  Danger Zone
                </h3>
                <p className="text-sm text-red-400 mt-1 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>

                {!showDeleteConfirm ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete Account
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-3"
                  >
                    <p className="text-sm font-semibold text-red-700 flex items-center gap-2">
                      <AlertTriangle size={16} />
                      Are you absolutely sure?
                    </p>
                    <p className="text-xs text-red-500">
                      This action cannot be undone. All your data will be permanently deleted.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl gap-2"
                      >
                        {isDeleting ? (
                          <><Loader2 size={14} className="animate-spin" />Deleting...</>
                        ) : (
                          <><Trash2 size={14} />Yes, delete my account</>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="rounded-xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <div className="h-8" />
            </div>
          </ScrollArea>
        </div>
      </div>
    </PageTransition>
  )
}