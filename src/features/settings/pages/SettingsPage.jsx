import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings, Bell, Moon, Sun, Globe, Shield, User, Mail,
  Lock, Eye, EyeOff, Save, Check, Loader2, Trash2,
  AlertTriangle, Volume2, VolumeX, Monitor, Smartphone,
  Palette, Zap, LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageTransition } from '@/components/ui/PageTransition'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'

export function SettingsPage() {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // General Settings
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [language, setLanguage] = useState('english')
  const [timezone, setTimezone] = useState('utc')

  // Appearance Settings
  const [fontSize, setFontSize] = useState('medium')
  const [density, setDensity] = useState('comfortable')
  const [animations, setAnimations] = useState(true)

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notifyNewFeatures, setNotifyNewFeatures] = useState(true)
  const [notifyUsage, setNotifyUsage] = useState(true)
  const [notifySecurity, setNotifySecurity] = useState(true)

  // Privacy Settings
  const [profilePublic, setProfilePublic] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [dataCollection, setDataCollection] = useState(true)

  // Security Settings
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
  ]

  return (
    <PageTransition>
      <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 bg-gradient-to-br from-malt-50 via-white to-malt-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-malt-200 bg-white/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 shadow-lg shadow-gray-200">
              <Settings size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold" style={{ color: '#3d2e14' }}>
                Settings
              </h1>
              <p className="text-xs" style={{ color: '#9c8c62' }}>
                Manage your preferences
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
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 rounded-xl font-semibold"
              style={{
                background: 'linear-gradient(135deg, #c8870a, #9e6b08)',
                color: '#fdfaf2',
              }}
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 flex">
          {/* Sidebar Tabs */}
          <div className="w-56 border-r border-malt-100 bg-white/50 p-3 space-y-1 shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-foreground shadow-sm border border-malt-200'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}

            {/* Danger Zone at bottom */}
            <div className="pt-4 mt-4 border-t border-malt-100">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
              >
                <Trash2 size={16} />
                Delete Account
              </button>
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="p-6 max-w-2xl space-y-6">

                {/* GENERAL SETTINGS */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-malt-200 p-6 shadow-sm space-y-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                        <User size={18} className="text-turmeric-500" />
                        Profile
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Display Name</label>
                          <input
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full rounded-xl border-2 border-malt-200 p-3 text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-turmeric-50 focus:border-turmeric-300"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Email</label>
                          <input
                            value={email}
                            disabled
                            className="w-full rounded-xl border-2 border-malt-200 bg-malt-50/50 p-3 text-sm text-foreground opacity-60 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-malt-200 p-6 shadow-sm space-y-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                        <Globe size={18} className="text-turmeric-500" />
                        Language & Region
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Language</label>
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full rounded-xl border-2 border-malt-200 p-3 text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-turmeric-50 focus:border-turmeric-300"
                          >
                            <option value="english">🇺🇸 English</option>
                            <option value="spanish">🇪🇸 Spanish</option>
                            <option value="french">🇫🇷 French</option>
                            <option value="german">🇩🇪 German</option>
                            <option value="japanese">🇯🇵 Japanese</option>
                            <option value="chinese">🇨🇳 Chinese</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Timezone</label>
                          <select
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="w-full rounded-xl border-2 border-malt-200 p-3 text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-turmeric-50 focus:border-turmeric-300"
                          >
                            <option value="utc">UTC</option>
                            <option value="est">EST (UTC-5)</option>
                            <option value="pst">PST (UTC-8)</option>
                            <option value="gmt">GMT (UTC+0)</option>
                            <option value="ist">IST (UTC+5:30)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* APPEARANCE SETTINGS */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-malt-200 p-6 shadow-sm space-y-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                        <Palette size={18} className="text-turmeric-500" />
                        Theme
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'light', label: 'Light', icon: Sun },
                          { id: 'dark', label: 'Dark', icon: Moon },
                          { id: 'system', label: 'System', icon: Monitor },
                        ].map((t) => {
                          const Icon = t.icon
                          return (
                            <button
                              key={t.id}
                              onClick={() => setTheme(t.id)}
                              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                theme === t.id
                                  ? 'border-turmeric-300 bg-turmeric-50 shadow-md'
                                  : 'border-malt-200 bg-white hover:border-turmeric-200'
                              }`}
                            >
                              <Icon size={24} className={theme === t.id ? 'text-turmeric-600' : 'text-gray-400'} />
                              <span className={`text-sm font-semibold ${theme === t.id ? 'text-turmeric-700' : 'text-gray-600'}`}>
                                {t.label}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-malt-200 p-6 shadow-sm space-y-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                        <Settings size={18} className="text-turmeric-500" />
                        Display
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">Font Size</p>
                            <p className="text-xs text-muted-foreground">Adjust text size</p>
                          </div>
                          <select
                            value={fontSize}
                            onChange={(e) => setFontSize(e.target.value)}
                            className="rounded-lg border border-malt-200 px-3 py-2 text-sm"
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">Density</p>
                            <p className="text-xs text-muted-foreground">Control spacing</p>
                          </div>
                          <select
                            value={density}
                            onChange={(e) => setDensity(e.target.value)}
                            className="rounded-lg border border-malt-200 px-3 py-2 text-sm"
                          >
                            <option value="compact">Compact</option>
                            <option value="comfortable">Comfortable</option>
                            <option value="spacious">Spacious</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">Animations</p>
                            <p className="text-xs text-muted-foreground">Enable UI animations</p>
                          </div>
                          <button
                            onClick={() => setAnimations(!animations)}
                            className={`relative w-12 h-7 rounded-full transition-all ${animations ? 'bg-turmeric-500' : 'bg-gray-300'}`}
                          >
                            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${animations ? 'right-1' : 'left-1'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* NOTIFICATION SETTINGS */}
                {activeTab === 'notifications' && (
                  <div className="bg-white rounded-2xl border border-malt-200 p-6 shadow-sm space-y-4">
                    <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                      <Bell size={18} className="text-turmeric-500" />
                      Notification Preferences
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Email Notifications', desc: 'Receive notifications via email', state: emailNotifications, setter: setEmailNotifications },
                        { label: 'Push Notifications', desc: 'Receive browser push notifications', state: pushNotifications, setter: setPushNotifications },
                        { label: 'Sound', desc: 'Play sound for new notifications', state: soundEnabled, setter: setSoundEnabled },
                        { label: 'New Features', desc: 'Get notified about new features', state: notifyNewFeatures, setter: setNotifyNewFeatures },
                        { label: 'Usage Alerts', desc: 'Get notified about usage limits', state: notifyUsage, setter: setNotifyUsage },
                        { label: 'Security Alerts', desc: 'Get notified about security events', state: notifySecurity, setter: setNotifySecurity },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => item.setter(!item.state)}
                            className={`relative w-12 h-7 rounded-full transition-all ${item.state ? 'bg-turmeric-500' : 'bg-gray-300'}`}
                          >
                            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${item.state ? 'right-1' : 'left-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PRIVACY SETTINGS */}
                {activeTab === 'privacy' && (
                  <div className="bg-white rounded-2xl border border-malt-200 p-6 shadow-sm space-y-4">
                    <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                      <Shield size={18} className="text-turmeric-500" />
                      Privacy Settings
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Public Profile', desc: 'Make your profile visible to others', state: profilePublic, setter: setProfilePublic },
                        { label: 'Show Email', desc: 'Display your email on profile', state: showEmail, setter: setShowEmail },
                        { label: 'Data Collection', desc: 'Help improve AI Studio with usage data', state: dataCollection, setter: setDataCollection },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => item.setter(!item.state)}
                            className={`relative w-12 h-7 rounded-full transition-all ${item.state ? 'bg-turmeric-500' : 'bg-gray-300'}`}
                          >
                            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${item.state ? 'right-1' : 'left-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECURITY SETTINGS */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-malt-200 p-6 shadow-sm space-y-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                        <Lock size={18} className="text-turmeric-500" />
                        Change Password
                      </h3>
                      <div className="space-y-4">
                        <div className="relative">
                          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Current Password</label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="w-full rounded-xl border-2 border-malt-200 p-3 pr-10 text-sm"
                              placeholder="Enter current password"
                            />
                            <button
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                        <div className="relative">
                          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full rounded-xl border-2 border-malt-200 p-3 pr-10 text-sm"
                              placeholder="Enter new password"
                            />
                            <button
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Confirm New Password</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-xl border-2 border-malt-200 p-3 text-sm"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-malt-200 p-6 shadow-sm space-y-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                        <Shield size={18} className="text-turmeric-500" />
                        Two-Factor Authentication
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">Enable 2FA</p>
                          <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <button
                          onClick={() => setTwoFactor(!twoFactor)}
                          className={`relative w-12 h-7 rounded-full transition-all ${twoFactor ? 'bg-turmeric-500' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${twoFactor ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <AlertTriangle size={28} className="text-red-500" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">Delete Account?</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="outline"
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    signOut()
                  }}
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Account
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}