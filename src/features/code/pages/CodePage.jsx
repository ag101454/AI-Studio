import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code, Sparkles, Copy, Check, RotateCcw, Play,
  FileCode, Bug, Lightbulb, Wand2, BookOpen, ArrowRight,
  Zap, Braces, Terminal, ChevronRight, Clock, Star,
  Command, Hash, Keyboard, Coffee, TrendingUp, Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageTransition } from '@/components/ui/PageTransition'
import { generateCode } from '@/services/code'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', icon: '📜', color: '#F7DF1E' },
  { id: 'python', label: 'Python', icon: '🐍', color: '#3776AB' },
  { id: 'typescript', label: 'TypeScript', icon: '🔷', color: '#3178C6' },
  { id: 'react', label: 'React', icon: '⚛️', color: '#61DAFB' },
  { id: 'html', label: 'HTML/CSS', icon: '🎨', color: '#E34F26' },
  { id: 'java', label: 'Java', icon: '☕', color: '#ED8B00' },
  { id: 'cpp', label: 'C++', icon: '⚡', color: '#00599C' },
  { id: 'sql', label: 'SQL', icon: '🗄️', color: '#4479A1' },
]

const TASKS = [
  { id: 'generate', label: 'Generate', icon: Wand2, desc: 'Create code from scratch' },
  { id: 'explain', label: 'Explain', icon: BookOpen, desc: 'Understand code' },
  { id: 'debug', label: 'Debug', icon: Bug, desc: 'Find & fix errors' },
  { id: 'optimize', label: 'Optimize', icon: Zap, desc: 'Improve performance' },
  { id: 'convert', label: 'Convert', icon: ArrowRight, desc: 'Change language' },
  { id: 'documentation', label: 'Document', icon: FileCode, desc: 'Generate docs' },
]

export function CodePage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [task, setTask] = useState('generate')
  const [result, setResult] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [lineCount, setLineCount] = useState(0)

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'dev'
  const currentLang = LANGUAGES.find(l => l.id === language)
  const currentTask = TASKS.find(t => t.id === task)

  useEffect(() => {
    if (result) setLineCount(result.split('\n').length)
  }, [result])

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return
    setError('')
    setResult(null)
    setIsGenerating(true)

    try {
      const response = await generateCode({ prompt: prompt.trim(), language, task })
      if (response.success) {
        setResult(response.code)
        setHistory((prev) => [{
          id: Date.now(),
          prompt: prompt.trim(),
          language,
          task,
          code: response.code,
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

  const handleClear = () => {
    setPrompt('')
    setResult(null)
    setError('')
    setLineCount(0)
  }

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleGenerate()
    }
  }

  const quickStarts = [
    { icon: '🔐', text: 'JWT authentication middleware', lang: 'javascript' },
    { icon: '📡', text: 'REST API with CRUD operations', lang: 'python' },
    { icon: '🎣', text: 'Custom React useFetch hook', lang: 'typescript' },
    { icon: '🔍', text: 'Binary search algorithm', lang: 'java' },
    { icon: '💾', text: 'SQL query optimization', lang: 'sql' },
    { icon: '🎨', text: 'Responsive flexbox layout', lang: 'html' },
  ]

  return (
    <PageTransition>
      <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 bg-white">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex items-center gap-2 ml-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
                <Code size={14} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading text-sm font-bold text-gray-900">DevHub</h1>
                <p className="text-[10px] text-gray-400">AI Code Studio</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Keyboard size={12} />
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[10px]">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[10px]">↵</kbd>
              to run
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Gemini 2.5 Flash
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          
          {/* Left Panel */}
          <div className="lg:w-[440px] lg:min-w-[400px] border-r border-gray-100 flex flex-col bg-gray-50/50">
            {/* Task Selector */}
            <div className="p-4 pb-2">
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                {TASKS.map((t) => {
                  const Icon = t.icon
                  const isActive = task === t.id
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTask(t.id)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-xs font-medium transition-all relative',
                        isActive
                          ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/50'
                          : 'text-gray-500 hover:text-gray-700'
                      )}
                    >
                      <Icon size={13} />
                      <span className="hidden xl:inline">{t.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 pt-2 space-y-4">
                {/* Language Selector */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 block">
                    Language
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {LANGUAGES.map((lang) => (
                      <motion.button
                        key={lang.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setLanguage(lang.id)}
                        className={cn(
                          'flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all border-2',
                          language === lang.id
                            ? 'border-violet-200 bg-violet-50 shadow-sm'
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                        )}
                      >
                        <span className="text-2xl">{lang.icon}</span>
                        <span className={cn(
                          'text-[11px] font-semibold',
                          language === lang.id ? 'text-violet-700' : 'text-gray-600'
                        )}>
                          {lang.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Prompt Editor */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal size={12} />
                      Prompt
                    </label>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {prompt.length} chars
                    </span>
                  </div>
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`// ${currentTask?.desc || 'Describe what you need'} in ${currentLang?.label}...`}
                      rows={7}
                      disabled={isGenerating}
                      className="w-full rounded-xl border-2 border-gray-100 bg-white p-4 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-200 resize-none transition-all font-mono leading-relaxed disabled:opacity-50"
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full h-12 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-violet-200 text-base rounded-xl"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles size={20} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play size={18} />
                      Generate {currentTask?.label}
                      <span className="ml-auto text-xs text-white/70 bg-white/20 px-2 py-0.5 rounded-lg font-mono">
                        ⌘↵
                      </span>
                    </>
                  )}
                </Button>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600 flex items-start gap-2"
                  >
                    <Bug size={14} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Start */}
            <div className="border-t border-gray-100 p-4 shrink-0 bg-white">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                Quick Start
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {quickStarts.slice(0, 4).map((s) => (
                  <button
                    key={s.text}
                    onClick={() => {
                      setPrompt(s.text)
                      setLanguage(s.lang)
                    }}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all text-left border border-transparent hover:border-gray-100"
                  >
                    <span className="text-sm">{s.icon}</span>
                    <span className="truncate">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="flex-1 flex flex-col bg-white min-h-0">
            {/* Output Header */}
            {(result || isGenerating) && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      isGenerating ? 'bg-amber-400 animate-pulse' : 'bg-green-500'
                    )} />
                    <span className="text-sm font-semibold text-gray-700">
                      {isGenerating ? 'Generating...' : 'Output'}
                    </span>
                  </div>
                  {result && (
                    <>
                      <span className="text-gray-200">|</span>
                      <Badge variant="outline" className="text-[11px] border-gray-200 text-gray-500 gap-1 bg-gray-50 font-normal">
                        {currentLang?.icon} {currentLang?.label}
                      </Badge>
                      <Badge variant="outline" className="text-[11px] border-gray-200 text-gray-500 bg-gray-50 font-normal">
                        {currentTask?.label}
                      </Badge>
                      <span className="text-gray-200">|</span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                        <Layers size={11} />
                        {lineCount} lines
                      </span>
                    </>
                  )}
                </div>
                {result && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="h-8 gap-1.5 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
                    >
                      {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                      {copied ? 'Copied!' : 'Copy code'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="h-8 gap-1.5 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
                    >
                      <RotateCcw size={13} />
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Code Output */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-5">
                  {/* Loading */}
                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                        <Sparkles size={16} className="animate-spin text-violet-500" />
                        AI is crafting your code...
                      </div>
                      {[...Array(18)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-2.5 rounded bg-gray-100" />
                          <div
                            className="h-2.5 rounded bg-gray-50"
                            style={{ width: `${25 + Math.random() * 75}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Result */}
                  {result && !isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-gray-50/80 border border-gray-100 p-5"
                    >
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-700 overflow-x-auto">
                        <code>{result}</code>
                      </pre>
                    </motion.div>
                  )}

                  {/* Empty State */}
                  {!result && !isGenerating && !error && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 mb-6"
                      >
                        <Coffee size={32} className="text-violet-300" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        Ready to build, {firstName} 👨‍💻
                      </h3>
                      <p className="text-sm text-gray-400 max-w-md mb-6">
                        Pick a language, choose a task, and describe your code
                      </p>
                      <div className="grid grid-cols-2 gap-2 max-w-md">
                        {quickStarts.map((s) => (
                          <button
                            key={s.text}
                            onClick={() => {
                              setPrompt(s.text)
                              setLanguage(s.lang)
                            }}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all text-left border border-gray-100 hover:border-gray-200"
                          >
                            <span className="text-base">{s.icon}</span>
                            <span className="truncate">{s.text}</span>
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

        {/* Status Bar */}
        <div className="flex items-center justify-between px-5 py-2 border-t border-gray-100 text-[11px] text-gray-400 bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Ready
            </span>
            <span>{currentLang?.label}</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Gemini 2.5 Flash</span>
            <span>Ln {prompt.split('\n').length}, Col {prompt.split('\n').pop()?.length || 1}</span>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}