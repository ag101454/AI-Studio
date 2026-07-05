import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, Sparkles, Play, Pause, RotateCcw, Download,
  Volume2, Wand2, Copy, Check, Zap, Clock, Layers, Gauge,
  Radio, Headphones, Music, Disc, Sliders, Circle, Activity,
  Heart, Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageTransition } from '@/components/ui/PageTransition'
import { generateVoiceScript, VOICES, SPEEDS, TEMPLATES } from '@/services/voice'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export function VoicePage() {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('natural-male')
  const [speed, setSpeed] = useState('normal')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState([])
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [activeTemplate, setActiveTemplate] = useState(null)
  const [scriptTopic, setScriptTopic] = useState('')
  const [scriptStyle, setScriptStyle] = useState('professional')
  const [scriptLength, setScriptLength] = useState('medium')
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showScriptGen, setShowScriptGen] = useState(false)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    setWordCount(words)
    setCharCount(text.length)
    const speedVal = SPEEDS.find(s => s.id === speed)?.value || 1.0
    setDuration(Math.round((words / 150) * 60 / speedVal))
  }, [text, speed])

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Audio visualizer
  useEffect(() => {
    if (isSpeaking && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const bars = 50
      
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        for (let i = 0; i < bars; i++) {
          const height = Math.sin(Date.now() * 0.004 + i * 0.2) * 25 + 30 + Math.random() * 15
          const x = (canvas.width / bars) * i + 1
          const y = canvas.height / 2 - height / 2
          const width = (canvas.width / bars) - 2
          
          const gradient = ctx.createLinearGradient(x, y, x, y + height)
          gradient.addColorStop(0, '#8b5cf6')
          gradient.addColorStop(0.5, '#a855f7')
          gradient.addColorStop(1, '#c084fc')
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.roundRect(x, y, width, height, [2, 2, 0, 0])
          ctx.fill()
        }
        
        animationRef.current = requestAnimationFrame(animate)
      }
      
      animate()
    }
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isSpeaking])

  const handleSpeak = () => {
    if (!text.trim() || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    const speedValue = SPEEDS.find(s => s.id === speed)?.value || 1.0
    utterance.rate = speedValue
    utterance.volume = 1.0

    const voices = window.speechSynthesis.getVoices()
    const voiceConfig = VOICES.find(v => v.id === selectedVoice)
    if (voiceConfig) {
      const matchingVoice = voices.find(v => 
        v.name.toLowerCase().includes(voiceConfig.label.toLowerCase())
      )
      if (matchingVoice) utterance.voice = matchingVoice
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false) }
    utterance.onpause = () => setIsPaused(true)
    utterance.onresume = () => setIsPaused(false)

    window.speechSynthesis.speak(utterance)

    setHistory(prev => [{
      id: Date.now(), text: text.trim(), voice: selectedVoice, speed,
      timestamp: new Date().toISOString(),
    }, ...prev].slice(0, 20))
  }

  const handlePause = () => { window.speechSynthesis.pause(); setIsPaused(true) }
  const handleResume = () => { window.speechSynthesis.resume(); setIsPaused(false) }
  const handleStop = () => { window.speechSynthesis.cancel(); setIsSpeaking(false); setIsPaused(false) }

  const handleGenerateScript = async () => {
    if (!scriptTopic.trim() || isGenerating) return
    setError('')
    setIsGenerating(true)
    try {
      const response = await generateVoiceScript({
        topic: scriptTopic.trim(), style: scriptStyle, length: scriptLength,
      })
      if (response.success) { setText(response.content); setShowScriptGen(false) }
      else setError(response.error)
    } catch (err) { setError(err.message) }
    finally { setIsGenerating(false) }
  }

  const handleCopy = async () => {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTemplateSelect = (template) => {
    setActiveTemplate(template.id)
    setText(template.text)
  }

  return (
    <PageTransition>
      <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 bg-gradient-to-br from-violet-50 via-white to-purple-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-violet-100/50 bg-white/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <motion.div
                animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
                transition={isSpeaking ? { duration: 1, repeat: Infinity } : {}}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100"
              >
                <div className={cn(
                  'w-2.5 h-2.5 rounded-full shadow-lg',
                  isSpeaking ? 'bg-rose-500 shadow-rose-300 animate-pulse' : 'bg-violet-300'
                )} />
                <span className={cn(
                  'text-[11px] font-semibold uppercase tracking-wider',
                  isSpeaking ? 'text-rose-500' : 'text-violet-400'
                )}>
                  {isSpeaking ? 'Speaking' : 'Ready'}
                </span>
              </motion.div>
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200">
                  <Mic size={16} className="text-white" />
                </div>
                Voice Studio
              </h1>
              <p className="text-xs text-gray-400">Professional Text-to-Speech Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-[11px] border-violet-200 text-violet-500 bg-violet-50 font-medium">
              {wordCount} words
            </Badge>
            <Badge variant="outline" className="text-[11px] border-purple-200 text-purple-500 bg-purple-50 font-medium">
              ~{duration}s
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          
          {/* Left Panel */}
          <div className="lg:w-[420px] lg:min-w-[400px] border-r border-violet-100/50 flex flex-col bg-white/50">
            <ScrollArea className="flex-1">
              <div className="p-5 space-y-5">
                
                {/* Voice Selection */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Radio size={13} className="text-violet-400" />
                    Select Voice
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {VOICES.map((voice) => (
                      <motion.button
                        key={voice.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedVoice(voice.id)}
                        className={cn(
                          'flex flex-col items-center gap-2.5 p-4 rounded-2xl text-center transition-all border-2 relative overflow-hidden',
                          selectedVoice === voice.id
                            ? 'border-violet-300 bg-gradient-to-br from-violet-50 to-purple-50 shadow-lg shadow-violet-100'
                            : 'border-gray-100 bg-white hover:border-violet-200 hover:shadow-md'
                        )}
                      >
                        {selectedVoice === voice.id && (
                          <motion.div
                            layoutId="selectedVoice"
                            className="absolute top-2 right-2"
                          >
                            <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                              <Star size={10} className="text-white fill-white" />
                            </div>
                          </motion.div>
                        )}
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                          selectedVoice === voice.id
                            ? 'bg-white shadow-md'
                            : 'bg-gray-50'
                        )}>
                          {voice.icon}
                        </div>
                        <div>
                          <p className={cn(
                            'text-sm font-bold',
                            selectedVoice === voice.id ? 'text-violet-700' : 'text-gray-700'
                          )}>
                            {voice.label}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{voice.description}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Speed */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Gauge size={13} className="text-violet-400" />
                    Speed
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {SPEEDS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSpeed(s.id)}
                        className={cn(
                          'flex flex-col items-center gap-1.5 py-3 rounded-xl text-center transition-all border-2',
                          speed === s.id
                            ? 'border-violet-300 bg-violet-50 shadow-md'
                            : 'border-gray-100 bg-white hover:border-violet-200'
                        )}
                      >
                        <span className="text-xl">{s.icon}</span>
                        <span className={cn(
                          'text-xs font-semibold',
                          speed === s.id ? 'text-violet-700' : 'text-gray-500'
                        )}>
                          {s.label}
                        </span>
                        <span className="text-[10px] text-gray-400">{s.value}x</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Script Generator */}
                <div>
                  <button
                    onClick={() => setShowScriptGen(!showScriptGen)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
                        <Wand2 size={16} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-800">AI Script Generator</p>
                        <p className="text-xs text-gray-400">Generate voiceover scripts</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: showScriptGen ? 180 : 0 }}
                      className="text-violet-400 font-bold"
                    >
                      ▼
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {showScriptGen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 mt-3 rounded-2xl border-2 border-violet-100 bg-white space-y-3">
                          <input
                            value={scriptTopic}
                            onChange={(e) => setScriptTopic(e.target.value)}
                            placeholder="What should the script be about?"
                            className="w-full rounded-xl border-2 border-gray-100 p-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-200"
                          />
                          <div className="flex gap-2">
                            <select
                              value={scriptStyle}
                              onChange={(e) => setScriptStyle(e.target.value)}
                              className="flex-1 rounded-xl border-2 border-gray-100 p-2.5 text-sm text-gray-600 bg-white"
                            >
                              <option value="professional">Professional</option>
                              <option value="casual">Casual</option>
                              <option value="enthusiastic">Enthusiastic</option>
                              <option value="dramatic">Dramatic</option>
                              <option value="calm">Calm</option>
                            </select>
                            <select
                              value={scriptLength}
                              onChange={(e) => setScriptLength(e.target.value)}
                              className="rounded-xl border-2 border-gray-100 p-2.5 text-sm text-gray-600 bg-white"
                            >
                              <option value="short">Short</option>
                              <option value="medium">Medium</option>
                              <option value="long">Long</option>
                            </select>
                          </div>
                          <Button
                            onClick={handleGenerateScript}
                            disabled={!scriptTopic.trim() || isGenerating}
                            className="w-full h-10 gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold rounded-xl text-sm"
                          >
                            {isGenerating ? (
                              <><Sparkles size={14} className="animate-spin" />Generating...</>
                            ) : (
                              <><Wand2 size={14} />Generate Script</>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Templates */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Layers size={13} className="text-violet-400" />
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
                          'flex items-center gap-3 p-3 rounded-xl text-left transition-all border-2 text-sm',
                          activeTemplate === template.id
                            ? 'border-violet-300 bg-violet-50 text-violet-700 font-semibold shadow-md'
                            : 'border-gray-100 bg-white text-gray-600 hover:border-violet-200 hover:shadow-sm'
                        )}
                      >
                        <span className="text-xl">{template.icon}</span>
                        <span className="truncate">{template.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-500"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Visualizer */}
            <div className="h-28 relative border-b border-gray-100 bg-gradient-to-r from-violet-50/50 via-white to-purple-50/50 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={800}
                height={112}
                className="w-full h-full"
              />
              {isSpeaking && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-violet-400/20 blur-2xl"
                />
              )}
              <div className="absolute bottom-3 right-4 text-[11px] text-gray-300 font-mono font-medium">
                {String(Math.floor(duration / 60)).padStart(2, '0')}:{String(duration % 60).padStart(2, '0')}
              </div>
            </div>

            {/* Text Editor */}
            <div className="flex-1 flex flex-col p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Music size={13} className="text-violet-400" />
                  Script
                </label>
                <Button
                  variant="ghost" size="sm"
                  onClick={handleCopy}
                  className="h-7 gap-1.5 text-xs text-gray-400 hover:text-violet-600 rounded-lg"
                >
                  {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your script here, generate one with AI, or choose a template to get started..."
                rows={5}
                className="flex-1 w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 p-5 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-200 resize-none transition-all leading-relaxed"
              />
            </div>

            {/* Player Controls */}
            <div className="border-t border-gray-100 p-8 shrink-0 bg-gradient-to-r from-violet-50/30 via-white to-purple-50/30">
              <div className="flex items-center justify-center gap-8">
                {/* Stop */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleStop}
                  disabled={!isSpeaking}
                  className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all bg-white disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                >
                  <RotateCcw size={18} />
                </motion.button>

                {/* Play/Pause */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={isSpeaking ? (isPaused ? handleResume : handlePause) : handleSpeak}
                  disabled={!text.trim()}
                  className={cn(
                    'w-20 h-20 rounded-3xl flex items-center justify-center transition-all shadow-2xl disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed',
                    isSpeaking
                      ? 'bg-gradient-to-br from-rose-400 to-pink-500 shadow-rose-200'
                      : 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-200 hover:from-violet-400 hover:to-purple-500'
                  )}
                >
                  {isSpeaking && !isPaused ? (
                    <Pause size={28} className="text-white" />
                  ) : isSpeaking && isPaused ? (
                    <Play size={28} className="text-white ml-1" />
                  ) : (
                    <Play size={28} className="text-white ml-1.5" />
                  )}
                </motion.button>

                {/* Download */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={!text.trim()}
                  className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all bg-white disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                >
                  <Download size={18} />
                </motion.button>
              </div>

              {/* Studio Info */}
              <div className="flex items-center justify-center gap-5 mt-6 text-[11px] text-gray-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  {VOICES.find(v => v.id === selectedVoice)?.label}
                </span>
                <span className="text-gray-200">•</span>
                <span>{SPEEDS.find(s => s.id === speed)?.value}x</span>
                <span className="text-gray-200">•</span>
                <span>{wordCount} words</span>
                <span className="text-gray-200">•</span>
                <span>~{duration}s</span>
                <span className="text-gray-200">•</span>
                <span className="text-violet-400">48kHz HD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
