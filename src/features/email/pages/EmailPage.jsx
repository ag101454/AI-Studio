import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Sparkles, Copy, Check, RotateCcw, Download,
  Send, Wand2, PenTool, Zap, Star, ChevronDown,
  User, AtSign, FileText, Lightbulb, Clock, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageTransition } from '@/components/ui/PageTransition'
import { generateEmail, improveEmail, EMAIL_TYPES, TONES, LENGTHS, TEMPLATES } from '@/services/email'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export function EmailPage() {
  const { user } = useAuth()
  const [emailType, setEmailType] = useState('business')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [recipient, setRecipient] = useState('')
  const [sender, setSender] = useState(user?.user_metadata?.full_name || '')
  const [subject, setSubject] = useState('')
  const [keyPoints, setKeyPoints] = useState('')
  const [additionalInstructions, setAdditionalInstructions] = useState('')
  const [result, setResult] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [wordCount, setWordCount] = useState(0)
  const [activeTemplate, setActiveTemplate] = useState(null)

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

  useEffect(() => {
    if (result) setWordCount(result.split(/\s+/).length)
  }, [result])

  const handleGenerate = async () => {
    setError('')
    setResult(null)
    setIsGenerating(true)

    try {
      const response = await generateEmail({
        type: emailType,
        tone,
        length,
        recipient,
        sender,
        subject,
        keyPoints,
        additionalInstructions,
      })

      if (response.success) {
        setResult(response.content)
        setHistory(prev => [{
          id: Date.now(),
          type: emailType,
          recipient,
          subject,
          content: response.content,
          timestamp: new Date().toISOString(),
        }, ...prev].slice(0, 20))
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleImprove = async () => {
    if (!result || isGenerating) return
    setError('')
    setIsGenerating(true)

    try {
      const response = await improveEmail({
        currentEmail: result,
        improvements: 'Make it more engaging and professional',
      })

      if (response.success) {
        setResult(response.content)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setResult(null)
    setRecipient('')
    setSubject('')
    setKeyPoints('')
    setAdditionalInstructions('')
    setActiveTemplate(null)
  }

  const handleTemplateSelect = (template) => {
    setActiveTemplate(template.id)
    setEmailType(template.type)
    setSubject(template.subject)
    setKeyPoints(template.points)
  }

  return (
    <PageTransition>
      <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 bg-gradient-to-br from-amber-50 via-white to-orange-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100/50 bg-white/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-200">
              <Mail size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-gray-900">Email Writer</h1>
              <p className="text-xs text-gray-400">AI-Powered Professional Emails</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {result && (
              <Badge variant="outline" className="text-xs border-amber-200 text-amber-600 bg-amber-50">
                {wordCount} words
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Left Panel */}
          <div className="lg:w-[420px] lg:min-w-[400px] border-r border-amber-100/50 flex flex-col bg-white/50">
            <ScrollArea className="flex-1">
              <div className="p-5 space-y-5">
                
                {/* Email Type */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText size={13} className="text-amber-400" />
                    Email Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {EMAIL_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setEmailType(type.id)}
                        className={cn(
                          'flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all border-2',
                          emailType === type.id
                            ? 'border-amber-300 bg-amber-50 shadow-md'
                            : 'border-gray-100 bg-white hover:border-amber-200'
                        )}
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span className={cn('text-xs font-semibold', emailType === type.id ? 'text-amber-700' : 'text-gray-600')}>
                          {type.label}
                        </span>
                        <span className="text-[10px] text-gray-400">{type.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone & Length */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Tone</label>
                    <div className="space-y-1.5">
                      {TONES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTone(t.id)}
                          className={cn(
                            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border',
                            tone === t.id
                              ? 'border-amber-200 bg-amber-50 text-amber-700'
                              : 'border-gray-100 bg-white text-gray-500 hover:border-amber-100'
                          )}
                        >
                          <span>{t.icon}</span>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Length</label>
                    <div className="space-y-1.5">
                      {LENGTHS.map((l) => (
                        <button
                          key={l.id}
                          onClick={() => setLength(l.id)}
                          className={cn(
                            'w-full flex flex-col px-3 py-2 rounded-lg text-xs transition-all border',
                            length === l.id
                              ? 'border-amber-200 bg-amber-50'
                              : 'border-gray-100 bg-white hover:border-amber-100'
                          )}
                        >
                          <span className={cn('font-semibold', length === l.id ? 'text-amber-700' : 'text-gray-600')}>
                            {l.label}
                          </span>
                          <span className="text-[10px] text-gray-400">{l.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Email Details */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-400 uppercase mb-1 block">From</label>
                      <input value={sender} onChange={(e) => setSender(e.target.value)}
                        placeholder="Your name"
                        className="w-full rounded-lg border border-gray-100 p-2.5 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-amber-200" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-400 uppercase mb-1 block">To</label>
                      <input value={recipient} onChange={(e) => setRecipient(e.target.value)}
                        placeholder="recipient@email.com"
                        className="w-full rounded-lg border border-gray-100 p-2.5 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-amber-200" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 uppercase mb-1 block">Subject</label>
                    <input value={subject} onChange={(e) => setSubject(e.target.value)}
                      placeholder="Email subject line..."
                      className="w-full rounded-lg border border-gray-100 p-2.5 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-amber-200" />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 uppercase mb-1 block">Key Points</label>
                    <textarea value={keyPoints} onChange={(e) => setKeyPoints(e.target.value)}
                      placeholder="What should the email include? Key messages, details, call-to-action..."
                      rows={3}
                      className="w-full rounded-lg border border-gray-100 p-2.5 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-amber-200 resize-none" />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 uppercase mb-1 block">Additional Instructions</label>
                    <input value={additionalInstructions} onChange={(e) => setAdditionalInstructions(e.target.value)}
                      placeholder="Any specific requirements..."
                      className="w-full rounded-lg border border-gray-100 p-2.5 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-amber-200" />
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full h-12 gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-base rounded-xl shadow-lg shadow-amber-200"
                  size="lg"
                >
                  {isGenerating ? (
                    <><Sparkles size={18} className="animate-spin" />Writing...</>
                  ) : (
                    <><Wand2 size={18} />Generate Email</>
                  )}
                </Button>

                {/* Templates */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Zap size={13} className="text-amber-400" />
                    Quick Templates
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TEMPLATES.map((template) => (
                      <motion.button
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTemplateSelect(template)}
                        className={cn(
                          'flex items-center gap-2.5 p-3 rounded-xl text-left transition-all border-2',
                          activeTemplate === template.id
                            ? 'border-amber-300 bg-amber-50 shadow-md'
                            : 'border-gray-100 bg-white hover:border-amber-200'
                        )}
                      >
                        <span className="text-lg">{template.icon}</span>
                        <span className={cn(
                          'text-xs font-semibold truncate',
                          activeTemplate === template.id ? 'text-amber-700' : 'text-gray-600'
                        )}>
                          {template.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-500">{error}</div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Email Preview */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Preview Header */}
            {(result || isGenerating) && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className={cn('w-2 h-2 rounded-full', isGenerating ? 'bg-amber-400 animate-pulse' : 'bg-green-500')} />
                  <span className="text-sm font-semibold text-gray-700">
                    {isGenerating ? 'Writing...' : 'Email Preview'}
                  </span>
                </div>
                {result && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleImprove} disabled={isGenerating}
                      className="h-8 gap-1.5 text-xs text-gray-500">
                      <Sparkles size={13} />Improve
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-1.5 text-xs text-gray-500">
                      {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs text-gray-500">
                      <RotateCcw size={13} />Clear
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Email Content */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-6 max-w-3xl mx-auto">
                  {/* Loading */}
                  {isGenerating && (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-4 bg-gray-100 rounded w-1/3" />
                      <div className="h-3 bg-gray-50 rounded w-full" />
                      <div className="h-3 bg-gray-50 rounded w-full" />
                      <div className="h-3 bg-gray-50 rounded w-5/6" />
                      <div className="h-3 bg-gray-50 rounded w-full" />
                      <div className="h-3 bg-gray-50 rounded w-2/3" />
                      <div className="h-4 bg-gray-100 rounded w-1/4 mt-4" />
                    </div>
                  )}

                  {/* Result */}
                  {result && !isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
                    >
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                        {result}
                      </pre>
                    </motion.div>
                  )}

                  {/* Empty State */}
                  {!result && !isGenerating && !error && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 mb-6"
                      >
                        <Mail size={32} className="text-amber-300" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        Compose your email, {firstName}
                      </h3>
                      <p className="text-sm text-gray-400 max-w-md mb-4">
                        Choose an email type, add details, and let AI write it for you
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {TEMPLATES.slice(0, 3).map((t) => (
                          <button
                            key={t.id}
                            onClick={() => handleTemplateSelect(t)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all border border-gray-100"
                          >
                            <span>{t.icon}</span>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}