import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Key, Plus, Copy, Check, Eye, EyeOff, Trash2, Loader2,
  Zap, Clock, Shield, AlertTriangle, RefreshCw, X,
  Activity, BarChart3, TrendingUp, Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageTransition } from '@/components/ui/PageTransition'
import { getAPIKeys, createAPIKey, revokeAPIKey, deleteAPIKey, updateAPIKeyName, getAPIUsage } from '@/services/apikeys'
import { useAuth } from '@/context/AuthContext'

export function APIKeysPage() {
  const { user } = useAuth()
  const [keys, setKeys] = useState([])
  const [usage, setUsage] = useState({ totalCalls: 0, limit: 10000, remaining: 10000 })
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showNewKey, setShowNewKey] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [revealedKeys, setRevealedKeys] = useState([])
  const [copiedKey, setCopiedKey] = useState(null)
  const [newlyCreatedKey, setNewlyCreatedKey] = useState(null)
  const [error, setError] = useState('')
  const [revokingId, setRevokingId] = useState(null)
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(null)
  const [editingName, setEditingName] = useState(null)
  const [editNameValue, setEditNameValue] = useState('')

  useEffect(() => {
    if (user?.id) loadData()
  }, [user?.id])

  const loadData = async () => {
    setIsLoading(true)
    const [keysRes, usageRes] = await Promise.all([
      getAPIKeys(user.id),
      getAPIUsage(user.id),
    ])

    if (keysRes.success) setKeys(keysRes.keys)
    if (usageRes.success) setUsage(usageRes.usage)
    setIsLoading(false)
  }

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      setError('Please enter a key name')
      return
    }

    setError('')
    setIsCreating(true)

    const result = await createAPIKey(user.id, newKeyName.trim())

    if (result.success) {
      setNewlyCreatedKey(result.key)
      setKeys((prev) => [result.key, ...prev])
      setNewKeyName('')
      setShowNewKey(false)
    } else {
      setError(result.error || 'Failed to create key')
    }

    setIsCreating(false)
  }

  const handleRevoke = async (keyId) => {
    setRevokingId(keyId)
    const result = await revokeAPIKey(keyId, user.id)
    if (result.success) {
      setKeys((prev) =>
        prev.map((k) => (k.id === keyId ? { ...k, is_active: false } : k))
      )
    }
    setRevokingId(null)
    setShowRevokeConfirm(null)
  }

  const handleDelete = async (keyId) => {
    const result = await deleteAPIKey(keyId, user.id)
    if (result.success) {
      setKeys((prev) => prev.filter((k) => k.id !== keyId))
    }
  }

  const handleCopy = async (key) => {
    await navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const toggleReveal = (keyId) => {
    setRevealedKeys((prev) =>
      prev.includes(keyId) ? prev.filter((id) => id !== keyId) : [...prev, keyId]
    )
  }

  const handleUpdateName = async (keyId) => {
    if (!editNameValue.trim()) return
    const result = await updateAPIKeyName(keyId, user.id, editNameValue.trim())
    if (result.success) {
      setKeys((prev) =>
        prev.map((k) => (k.id === keyId ? { ...k, name: editNameValue.trim() } : k))
      )
    }
    setEditingName(null)
    setEditNameValue('')
  }

  const maskKey = (key) => {
    if (!key) return ''
    return key.slice(0, 14) + '•'.repeat(32) + key.slice(-4)
  }

  const usagePercent = Math.round((usage.totalCalls / usage.limit) * 100)

  return (
    <PageTransition>
      <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 bg-gradient-to-br from-malt-50 via-white to-malt-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-malt-200 bg-white/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200">
              <Key size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold" style={{ color: '#3d2e14' }}>
                API Keys
              </h1>
              <p className="text-xs" style={{ color: '#9c8c62' }}>
                Manage your API keys for programmatic access
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowNewKey(true)}
            className="gap-2 rounded-xl font-semibold"
            style={{
              background: 'linear-gradient(135deg, #c8870a, #9e6b08)',
              color: '#fdfaf2',
            }}
          >
            <Plus size={16} />
            Create API Key
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto p-6 space-y-6">

              {/* Usage Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Calls', value: usage.totalCalls.toLocaleString(), icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { label: 'Monthly Limit', value: usage.limit.toLocaleString(), icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-50' },
                  { label: 'Remaining', value: usage.remaining.toLocaleString(), icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="bg-white rounded-xl border border-malt-200 p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={16} className={stat.color} />
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  )
                })}
              </div>

              {/* Usage Bar */}
              <div className="bg-white rounded-xl border border-malt-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Monthly Usage</span>
                  <span className="text-xs font-medium text-foreground">{usagePercent}%</span>
                </div>
                <div className="h-2 bg-malt-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${usagePercent}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
                  />
                </div>
              </div>

              {/* New Key Modal */}
              <AnimatePresence>
                {showNewKey && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-2xl border-2 border-violet-200 p-6 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                        <Plus size={18} className="text-violet-500" />
                        Create New API Key
                      </h3>
                      <button onClick={() => setShowNewKey(false)} className="text-muted-foreground hover:text-foreground">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <input
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Key name (e.g., Production, Development)"
                        className="flex-1 rounded-xl border-2 border-malt-200 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-300"
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateKey()}
                      />
                      <Button
                        onClick={handleCreateKey}
                        disabled={isCreating}
                        className="gap-2 rounded-xl font-semibold"
                        style={{
                          background: 'linear-gradient(135deg, #c8870a, #9e6b08)',
                          color: '#fdfaf2',
                        }}
                      >
                        {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                        Create
                      </Button>
                    </div>

                    {error && (
                      <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                        <AlertTriangle size={12} />{error}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Newly Created Key Alert */}
              <AnimatePresence>
                {newlyCreatedKey && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-2xl bg-green-50 border border-green-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-green-700 flex items-center gap-2">
                        <Check size={16} />API Key Created!
                      </h4>
                      <button onClick={() => setNewlyCreatedKey(null)} className="text-green-400 hover:text-green-600">
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-green-600">
                      Copy this key now. You won't be able to see it again!
                    </p>
                    <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-green-200">
                      <code className="flex-1 text-xs font-mono text-gray-700 break-all">
                        {newlyCreatedKey.key}
                      </code>
                      <Button
                        size="sm"
                        onClick={() => handleCopy(newlyCreatedKey.key)}
                        className="gap-1 rounded-lg text-xs"
                      >
                        {copiedKey === newlyCreatedKey.key ? <Check size={12} /> : <Copy size={12} />}
                        {copiedKey === newlyCreatedKey.key ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* API Keys List */}
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 size={32} className="animate-spin text-muted-foreground" />
                </div>
              ) : keys.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-malt-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Key size={28} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">No API Keys Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-4">
                    Create your first API key to start using AI Studio programmatically
                  </p>
                  <Button
                    onClick={() => setShowNewKey(true)}
                    className="gap-2 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, #c8870a, #9e6b08)',
                      color: '#fdfaf2',
                    }}
                  >
                    <Plus size={16} />
                    Create Your First Key
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {keys.map((apiKey) => (
                    <motion.div
                      key={apiKey.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl border border-malt-200 p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {editingName === apiKey.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                value={editNameValue}
                                onChange={(e) => setEditNameValue(e.target.value)}
                                className="rounded-lg border border-malt-200 px-3 py-1 text-sm font-medium"
                                onKeyDown={(e) => e.key === 'Enter' && handleUpdateName(apiKey.id)}
                                autoFocus
                              />
                              <Button size="sm" onClick={() => handleUpdateName(apiKey.id)} className="text-xs h-7">
                                Save
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingName(null)} className="text-xs h-7">
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground">{apiKey.name}</h4>
                              <button
                                onClick={() => { setEditingName(apiKey.id); setEditNameValue(apiKey.name) }}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                ✏️
                              </button>
                            </div>
                          )}
                          <Badge className={apiKey.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {apiKey.is_active ? 'Active' : 'Revoked'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReveal(apiKey.id)}
                            className="h-7 w-7 p-0"
                          >
                            {revealedKeys.includes(apiKey.id) ? <EyeOff size={13} /> : <Eye size={13} />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(apiKey.key)}
                            className="h-7 w-7 p-0"
                          >
                            {copiedKey === apiKey.key ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                          </Button>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3">
                        <code className="text-xs font-mono text-foreground/80 break-all">
                          {revealedKeys.includes(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            Created {new Date(apiKey.created_at).toLocaleDateString()}
                          </span>
                          {apiKey.last_used_at && (
                            <span className="flex items-center gap-1">
                              <Clock size={11} />
                              Last used {new Date(apiKey.last_used_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {apiKey.is_active && (
                            showRevokeConfirm === apiKey.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-red-500">Revoke?</span>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRevoke(apiKey.id)}
                                  disabled={revokingId === apiKey.id}
                                  className="h-7 text-xs"
                                >
                                  {revokingId === apiKey.id ? <Loader2 size={11} className="animate-spin" /> : 'Yes'}
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setShowRevokeConfirm(null)} className="h-7 text-xs">
                                  No
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowRevokeConfirm(apiKey.id)}
                                className="h-7 text-xs text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={11} className="mr-1" />Revoke
                              </Button>
                            )
                          )}
                          {!apiKey.is_active && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(apiKey.id)}
                              className="h-7 text-xs text-muted-foreground"
                            >
                              <Trash2 size={11} className="mr-1" />Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

            </div>
          </ScrollArea>
        </div>
      </div>
    </PageTransition>
  )
}