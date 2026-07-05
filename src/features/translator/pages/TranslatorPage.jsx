import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Languages, ArrowLeftRight, Copy, Check, Volume2, Sparkles,
  Mic, Zap, Star, Globe, ArrowDownUp, X, Search, Wand2,
  RotateCcw, ChevronDown, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageTransition } from '@/components/ui/PageTransition'
import { translateText, detectLanguage, LANGUAGES, TONES, QUICK_PHRASES } from '@/services/translator'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export function TranslatorPage() {
  const { user } = useAuth()
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('es')
  const [tone, setTone] = useState('neutral')
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [detectedLang, setDetectedLang] = useState(null)
  const [showAllLanguages, setShowAllLanguages] = useState(false)
  const [charCount, setCharCount] = useState(0)

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

  const popularLanguages = LANGUAGES.filter(l => l.popular)
  const allLanguages = LANGUAGES

  useEffect(() => {
    setCharCount(sourceText.length)
  }, [sourceText])

  const handleTranslate = async () => {
    if (!sourceText.trim() || isTranslating) return
    setError('')
    setIsTranslating(true)

    const result = await translateText({
      text: sourceText.trim(),
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      tone,
    })

    setIsTranslating(false)

    if (result.success) {
      setTranslatedText(result.translatedText)
      setDetectedLang(result.sourceLanguage)
      setHistory(prev => [{
        id: Date.now(),
        source: sourceText.trim(),
        translated: result.translatedText,
        sourceLang: result.sourceLanguage,
        targetLang: result.targetLanguage,
        timestamp: new Date().toISOString(),
      }, ...prev].slice(0, 20))
    } else {
      setError(result.error)
    }
  }

  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') return
    const temp = sourceLang
    setSourceLang(targetLang)
    setTargetLang(temp)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const handleCopy = async () => {
    if (!translatedText) return
    await navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSpeak = (text, lang) => {
    if (!text || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === 'auto' ? 'en' : lang
    window.speechSynthesis.speak(utterance)
  }

  const handleQuickPhrase = (phrase) => {
    setSourceText(phrase)
    setSourceLang('en')
  }

  return (
    <PageTransition>
      <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 bg-gradient-to-br from-sky-50 via-white to-indigo-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sky-100/50 bg-white/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg shadow-sky-200">
              <Languages size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-gray-900">Translator</h1>
              <p className="text-xs text-gray-400">100+ Languages · AI-Powered</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-sky-200 text-sky-500 bg-sky-50">
              {charCount} chars
            </Badge>
            {detectedLang && sourceLang === 'auto' && (
              <Badge className="text-xs bg-sky-100 text-sky-700 border-0">
                Detected: {detectedLang}
              </Badge>
            )}
          </div>
        </div>

        {/* Main Translator */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 p-4 lg:p-6 gap-4 lg:gap-6">
          
          {/* Source Panel */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Source Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="text-sm font-semibold text-gray-700 bg-transparent border-none focus:outline-none cursor-pointer"
                >
                  <option value="auto">🌐 Auto Detect</option>
                  {popularLanguages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                  ))}
                  <option disabled>──────────</option>
                  {allLanguages.filter(l => !l.popular).map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost" size="sm"
                  onClick={() => setSourceText('')}
                  className="h-7 text-xs text-gray-400"
                  disabled={!sourceText}
                >
                  <X size={13} className="mr-1" />Clear
                </Button>
              </div>
            </div>

            {/* Source Text */}
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              rows={6}
              className="flex-1 w-full px-4 py-4 text-gray-700 placeholder:text-gray-300 focus:outline-none resize-none text-base leading-relaxed"
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault()
                  handleTranslate()
                }
              }}
            />

            {/* Source Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-50 bg-gray-50/50">
              <span className="text-[10px] text-gray-400">{charCount}/5000</span>
              <Button
                variant="ghost" size="sm"
                onClick={() => handleSpeak(sourceText, sourceLang)}
                disabled={!sourceText}
                className="h-7 w-7 p-0 text-gray-400"
              >
                <Volume2 size={13} />
              </Button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex lg:flex-col items-center justify-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSwapLanguages}
              disabled={sourceLang === 'auto'}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg shadow-sky-200 flex items-center justify-center disabled:opacity-40"
            >
              <ArrowLeftRight size={16} className="text-white" />
            </motion.button>

            <Button
              onClick={handleTranslate}
              disabled={!sourceText.trim() || isTranslating}
              className="px-4 py-2 gap-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-200 text-sm"
            >
              {isTranslating ? (
                <Sparkles size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              Translate
            </Button>
          </div>

          {/* Target Panel */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Target Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="text-sm font-semibold text-gray-700 bg-transparent border-none focus:outline-none cursor-pointer"
                >
                  {popularLanguages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                  ))}
                  <option disabled>──────────</option>
                  {allLanguages.filter(l => !l.popular).map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                {/* Tone Selector */}
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="text-xs text-gray-500 bg-gray-50 rounded-lg px-2 py-1 border-none focus:outline-none cursor-pointer"
                >
                  {TONES.map(t => (
                    <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
                  ))}
                </select>
                <Button
                  variant="ghost" size="sm"
                  onClick={handleCopy}
                  disabled={!translatedText}
                  className="h-7 gap-1 text-xs text-gray-400"
                >
                  {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>

            {/* Translated Text */}
            <div className="flex-1 px-4 py-4">
              {isTranslating ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-50 rounded w-full" />
                  <div className="h-3 bg-gray-50 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                </div>
              ) : translatedText ? (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-700 text-base leading-relaxed"
                >
                  {translatedText}
                </motion.p>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 text-sm">
                  Translation will appear here...
                </div>
              )}
            </div>

            {/* Target Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-50 bg-gray-50/50">
              <span className="text-[10px] text-gray-400">
                {translatedText ? `${translatedText.length} chars` : ''}
              </span>
              <Button
                variant="ghost" size="sm"
                onClick={() => handleSpeak(translatedText, targetLang)}
                disabled={!translatedText}
                className="h-7 w-7 p-0 text-gray-400"
              >
                <Volume2 size={13} />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Phrases */}
        <div className="px-6 pb-4 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={13} className="text-amber-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Phrases</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {QUICK_PHRASES.map((phrase) => (
              <motion.button
                key={phrase.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickPhrase(phrase.text)}
                className="shrink-0 px-4 py-2 rounded-xl bg-white border border-gray-100 hover:border-sky-200 hover:shadow-sm transition-all text-xs text-gray-600 font-medium whitespace-nowrap"
              >
                {phrase.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-6 pb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-500"
            >
              {error}
            </motion.div>
          </div>
        )}

        {/* Recent History */}
        {history.length > 0 && (
          <div className="px-6 pb-4 shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={13} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {history.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSourceText(item.source)
                    setTranslatedText(item.translated)
                    setSourceLang('auto')
                  }}
                  className="shrink-0 max-w-[200px] px-3 py-2 rounded-xl bg-white border border-gray-100 hover:border-sky-200 transition-all text-left"
                >
                  <p className="text-xs text-gray-600 truncate">{item.source}</p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{item.translated}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
