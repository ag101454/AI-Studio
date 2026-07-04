import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Sparkles, Copy, Check, RotateCcw, Download,
  Send, BookOpen, PenTool, Briefcase, Mail, FileCheck,
  ChevronDown, Layers, Hash, Clock, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageTransition } from '@/components/ui/PageTransition'
import { generateDocument, DOCUMENT_TYPES, TONES, LENGTHS } from '@/services/document'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export function DocumentPage() {
  const { user } = useAuth()
  const [topic, setTopic] = useState('')
  const [docType, setDocType] = useState('article')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [instructions, setInstructions] = useState('')
  const [result, setResult] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [wordCount, setWordCount] = useState(0)

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

  const handleGenerate = async () => {
    if (!topic.trim() || isGenerating) return
    setError('')
    setResult(null)
    setIsGenerating(true)

    try {
      const response = await generateDocument({
        topic: topic.trim(),
        type: docType,
        tone,
        length,
        additionalInstructions: instructions.trim(),
      })

      if (response.success) {
        setResult(response.content)
        setWordCount(response.content.split(/\s+/).length)
        setHistory((prev) => [{
          id: Date.now(),
          topic: topic.trim(),
          type: docType,
          tone,
          length,
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

  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!result) return
    const blob = new Blob([result], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${docType}-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    setTopic('')
    setResult(null)
    setError('')
    setWordCount(0)
  }

  return (
    <PageTransition>
      <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
              <FileText size={16} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold text-gray-900">Document Generator</h1>
              <p className="text-xs text-gray-400">Create professional documents with AI</p>
            </div>
          </div>
          {result && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-gray-200 text-gray-500 bg-white">
                {wordCount} words
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-1.5 text-xs text-gray-500">
                {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownload} className="h-8 gap-1.5 text-xs text-gray-500">
                <Download size={13} />Download
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs text-gray-500">
                <RotateCcw size={13} />Clear
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Left Panel - Input */}
          <div className="lg:w-[420px] lg:min-w-[380px] border-r border-gray-100 flex flex-col bg-gray-50/50">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-5">
                {/* Topic Input */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                    What do you want to create?
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The Future of Artificial Intelligence in Healthcare..."
                    rows={3}
                    disabled={isGenerating}
                    className="w-full rounded-xl border-2 border-gray-100 bg-white p-4 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-200 resize-none transition-all disabled:opacity-50"
                  />
                </div>

                {/* Document Type */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                    Document Type
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {DOCUMENT_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setDocType(type.id)}
                        className={cn(
                          'flex flex-col items-center gap-1 p-3 rounded-xl text-center transition-all border-2',
                          docType === type.id
                            ? 'border-violet-200 bg-violet-50 shadow-sm'
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        )}
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span className={cn(
                          'text-[11px] font-semibold',
                          docType === type.id ? 'text-violet-700' : 'text-gray-600'
                        )}>
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                    Tone
                  </label>
                  <div className="flex gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all border',
                          tone === t.id
                            ? 'border-violet-200 bg-violet-50 text-violet-700'
                            : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                        )}
                      >
                        <span>{t.icon}</span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                    Length
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {LENGTHS.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setLength(l.id)}
                        className={cn(
                          'flex flex-col items-center gap-0.5 py-2.5 rounded-lg text-center transition-all border',
                          length === l.id
                            ? 'border-violet-200 bg-violet-50'
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        )}
                      >
                        <span className={cn(
                          'text-xs font-semibold',
                          length === l.id ? 'text-violet-700' : 'text-gray-600'
                        )}>
                          {l.label}
                        </span>
                        <span className="text-[10px] text-gray-400">{l.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Instructions */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                    Additional Instructions (optional)
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g., Include statistics, use bullet points, add a call-to-action..."
                    rows={2}
                    disabled={isGenerating}
                    className="w-full rounded-xl border-2 border-gray-100 bg-white p-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-200 resize-none transition-all disabled:opacity-50"
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={!topic.trim() || isGenerating}
                  className="w-full h-12 gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-violet-200 text-base rounded-xl"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles size={18} className="animate-spin" />
                      Writing...
                    </>
                  ) : (
                    <>
                      <PenTool size={18} />
                      Generate {DOCUMENT_TYPES.find(t => t.id === docType)?.label}
                    </>
                  )}
                </Button>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Recent History */}
            {history.length > 0 && (
              <div className="border-t border-gray-100 p-4 shrink-0 bg-white">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Recent</p>
                <div className="space-y-1 max-h-[120px] overflow-auto">
                  {history.slice(0, 4).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setTopic(item.topic)
                        setDocType(item.type)
                        setTone(item.tone)
                        setLength(item.length)
                        setResult(item.content)
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="text-sm">{DOCUMENT_TYPES.find(t => t.id === item.type)?.icon}</span>
                      <span className="text-xs text-gray-500 truncate flex-1">{item.topic}</span>
                      <span className="text-[10px] text-gray-300">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Output */}
          <div className="flex-1 flex flex-col bg-white min-h-0">
            {/* Output Header */}
            {(result || isGenerating) && (
              <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 shrink-0">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  isGenerating ? 'bg-amber-400 animate-pulse' : 'bg-green-500'
                )} />
                <span className="text-sm font-semibold text-gray-700">
                  {isGenerating ? 'Writing...' : 'Document'}
                </span>
                {result && (
                  <>
                    <span className="text-gray-200">|</span>
                    <Badge variant="outline" className="text-[11px] border-gray-200 text-gray-500 bg-gray-50">
                      {DOCUMENT_TYPES.find(t => t.id === docType)?.icon} {DOCUMENT_TYPES.find(t => t.id === docType)?.label}
                    </Badge>
                    <Badge variant="outline" className="text-[11px] border-gray-200 text-gray-500 bg-gray-50">
                      {wordCount} words
                    </Badge>
                  </>
                )}
              </div>
            )}

            {/* Document Content */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-6 max-w-3xl mx-auto">
                  {/* Loading */}
                  {isGenerating && (
                    <div className="space-y-3 animate-pulse">
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                        <Sparkles size={16} className="animate-spin text-violet-500" />
                        AI is crafting your document...
                      </div>
                      {[...Array(15)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-4 rounded bg-gray-100" style={{ width: `${60 + Math.random() * 40}%` }} />
                          {Math.random() > 0.5 && (
                            <div className="h-3 rounded bg-gray-50" style={{ width: `${80 + Math.random() * 20}%` }} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Result */}
                  {result && !isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="prose prose-sm max-w-none"
                    >
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {result}
                      </div>
                    </motion.div>
                  )}

                  {/* Empty State */}
                  {!result && !isGenerating && !error && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 mb-6"
                      >
                        <FileText size={32} className="text-violet-300" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        Create your document, {firstName}
                      </h3>
                      <p className="text-sm text-gray-400 max-w-md mb-4">
                        Choose a document type, describe your topic, and let AI do the writing
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {[
                          { icon: '📄', text: 'AI in Education', type: 'article' },
                          { icon: '📊', text: 'Q4 Sales Report', type: 'report' },
                          { icon: '✉️', text: 'Client follow-up email', type: 'email' },
                        ].map((s) => (
                          <button
                            key={s.text}
                            onClick={() => { setTopic(s.text); setDocType(s.type) }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all border border-gray-100 hover:border-gray-200"
                          >
                            <span>{s.icon}</span>
                            {s.text}
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