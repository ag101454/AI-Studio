import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileCheck, Sparkles, Copy, Check, RotateCcw, Download,
  Target, Briefcase, GraduationCap, Zap, Star, TrendingUp,
  Award, Shield, ArrowRight, PenTool, Lightbulb, FileText,
  Building2, MapPin, Phone, Mail, User, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageTransition } from '@/components/ui/PageTransition'
import { generateResume, improveResume, INDUSTRIES, LEVELS, FORMATS } from '@/services/resume'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export function ResumePage() {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [targetJob, setTargetJob] = useState('')
  const [company, setCompany] = useState('')
  const [industry, setIndustry] = useState('tech')
  const [experienceLevel, setExperienceLevel] = useState('mid')
  const [currentExperience, setCurrentExperience] = useState('')
  const [education, setEducation] = useState('')
  const [skills, setSkills] = useState('')
  const [format, setFormat] = useState('ats')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [result, setResult] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [showCoverLetter, setShowCoverLetter] = useState(false)
  const [coverLetter, setCoverLetter] = useState(null)

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

  const handleGenerate = async () => {
    if (!fullName || !targetJob) return
    setError('')
    setResult(null)
    setIsGenerating(true)

    try {
      const response = await generateResume({
        fullName, email, phone, location,
        targetJob, industry, experienceLevel,
        currentExperience, education, skills,
        format, additionalInfo,
      })

      if (response.success) {
        setResult(response)
        setHistory(prev => [{
          id: Date.now(),
          fullName, targetJob, company, industry,
          content: response.content,
          atsScore: response.atsScore,
          timestamp: new Date().toISOString(),
        }, ...prev].slice(0, 20))
        setStep(3)
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
    await navigator.clipboard.writeText(result.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!result) return
    const blob = new Blob([result.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fullName.replace(/\s+/g, '_')}_Resume.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImprove = async () => {
    if (!result) return
    setError('')
    setIsGenerating(true)
    try {
      const response = await improveResume({
        currentResume: result.content,
        targetJob,
        industry,
      })
      if (response.success) {
        setResult(prev => ({ ...prev, content: response.content, atsScore: response.atsScore }))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 75) return 'text-amber-500'
    return 'text-red-500'
  }

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-50 border-green-200'
    if (score >= 75) return 'bg-amber-50 border-amber-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <PageTransition>
      <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-100/50 bg-white/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
              <FileCheck size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-gray-900">Resume Builder</h1>
              <p className="text-xs text-gray-400">ATS-Optimized · 100% Acceptance Rate</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {result && (
              <Badge className={cn('text-sm font-bold px-4 py-2 border-2', getScoreBg(result.atsScore))}>
                <Target size={14} className={cn('mr-1.5', getScoreColor(result.atsScore))} />
                <span className={getScoreColor(result.atsScore)}>ATS Score: {result.atsScore}/100</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-2 py-4 bg-white/50 border-b border-gray-50">
          {['Personal Info', 'Experience & Skills', 'Your Resume'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                step === i + 1 ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-gray-400'
              )}>
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                  step === i + 1 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                )}>
                  {i + 1}
                </div>
                {s}
              </div>
              {i < 2 && <ChevronRight size={16} className="text-gray-300" />}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex min-h-0">
          {step === 1 && (
            <div className="flex-1 p-6 max-w-2xl mx-auto">
              <ScrollArea className="h-full">
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <User size={40} className="text-emerald-400 mx-auto mb-2" />
                    <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                    <p className="text-sm text-gray-400">Let's start with your basic details</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Full Name *</label>
                      <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-xl border-2 border-gray-100 p-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Email *</label>
                      <input value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full rounded-xl border-2 border-gray-100 p-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Phone</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full rounded-xl border-2 border-gray-100 p-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Location</label>
                      <input value={location} onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, State"
                        className="w-full rounded-xl border-2 border-gray-100 p-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Target Job Title *</label>
                      <input value={targetJob} onChange={(e) => setTargetJob(e.target.value)}
                        placeholder="Senior Software Engineer"
                        className="w-full rounded-xl border-2 border-gray-100 p-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Target Company</label>
                      <input value={company} onChange={(e) => setCompany(e.target.value)}
                        placeholder="Google, Microsoft, etc."
                        className="w-full rounded-xl border-2 border-gray-100 p-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Industry</label>
                    <div className="grid grid-cols-4 gap-2">
                      {INDUSTRIES.map((ind) => (
                        <button key={ind.id} onClick={() => setIndustry(ind.id)}
                          className={cn(
                            'flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all border-2',
                            industry === ind.id
                              ? 'border-emerald-300 bg-emerald-50 shadow-md'
                              : 'border-gray-100 bg-white hover:border-emerald-200'
                          )}>
                          <span className="text-xl">{ind.icon}</span>
                          <span className={cn('text-xs font-semibold', industry === ind.id ? 'text-emerald-700' : 'text-gray-600')}>{ind.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Experience Level</label>
                    <div className="grid grid-cols-5 gap-2">
                      {LEVELS.map((lvl) => (
                        <button key={lvl.id} onClick={() => setExperienceLevel(lvl.id)}
                          className={cn(
                            'flex flex-col items-center gap-1 p-3 rounded-xl text-center transition-all border-2',
                            experienceLevel === lvl.id
                              ? 'border-emerald-300 bg-emerald-50 shadow-md'
                              : 'border-gray-100 bg-white hover:border-emerald-200'
                          )}>
                          <span className="text-xl">{lvl.icon}</span>
                          <span className={cn('text-[11px] font-semibold', experienceLevel === lvl.id ? 'text-emerald-700' : 'text-gray-600')}>{lvl.label}</span>
                          <span className="text-[10px] text-gray-400">{lvl.years}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!fullName || !targetJob}
                    className="w-full h-12 gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-200"
                  >
                    Continue <ArrowRight size={18} />
                  </Button>
                </div>
              </ScrollArea>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 p-6 max-w-2xl mx-auto">
              <ScrollArea className="h-full">
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <Briefcase size={40} className="text-emerald-400 mx-auto mb-2" />
                    <h2 className="text-xl font-bold text-gray-800">Experience & Skills</h2>
                    <p className="text-sm text-gray-400">Tell us about your background</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Work Experience *</label>
                    <textarea value={currentExperience} onChange={(e) => setCurrentExperience(e.target.value)}
                      placeholder="Describe your work experience, roles, achievements, and responsibilities..."
                      rows={5}
                      className="w-full rounded-xl border-2 border-gray-100 p-4 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 resize-none" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Education *</label>
                    <textarea value={education} onChange={(e) => setEducation(e.target.value)}
                      placeholder="Your educational background, degrees, institutions, and year..."
                      rows={3}
                      className="w-full rounded-xl border-2 border-gray-100 p-4 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 resize-none" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Skills *</label>
                    <textarea value={skills} onChange={(e) => setSkills(e.target.value)}
                      placeholder="List your skills (e.g., JavaScript, Python, Leadership, Project Management)..."
                      rows={3}
                      className="w-full rounded-xl border-2 border-gray-100 p-4 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 resize-none" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Format</label>
                    <div className="grid grid-cols-3 gap-2">
                      {FORMATS.map((fmt) => (
                        <button key={fmt.id} onClick={() => setFormat(fmt.id)}
                          className={cn(
                            'flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all border-2',
                            format === fmt.id
                              ? 'border-emerald-300 bg-emerald-50 shadow-md'
                              : 'border-gray-100 bg-white hover:border-emerald-200'
                          )}>
                          <span className="text-xl">{fmt.icon}</span>
                          <span className={cn('text-xs font-semibold', format === fmt.id ? 'text-emerald-700' : 'text-gray-600')}>{fmt.label}</span>
                          <span className="text-[10px] text-gray-400">{fmt.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Additional Information</label>
                    <textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Any other details - projects, certifications, achievements, languages..."
                      rows={2}
                      className="w-full rounded-xl border-2 border-gray-100 p-4 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 resize-none" />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl">
                      Back
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      disabled={!currentExperience || !education || !skills || isGenerating}
                      className="flex-1 h-12 gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-200"
                    >
                      {isGenerating ? (
                        <><Sparkles size={18} className="animate-spin" />Generating...</>
                      ) : (
                        <><Sparkles size={18} />Generate Resume</>
                      )}
                    </Button>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-500">{error}</div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {step === 3 && result && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Badge className={cn('text-sm font-bold px-3 py-1.5 border-2', getScoreBg(result.atsScore))}>
                      <Target size={14} className={cn('mr-1.5', getScoreColor(result.atsScore))} />
                      <span className={getScoreColor(result.atsScore)}>ATS: {result.atsScore}/100</span>
                    </Badge>
                    {result.atsScore >= 90 && <Badge className="bg-green-500 text-white text-xs">Ready to Submit!</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleImprove} disabled={isGenerating}
                    className="h-8 gap-1.5 text-xs text-gray-500">
                    <TrendingUp size={13} />Improve Score
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-1.5 text-xs text-gray-500">
                    {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDownload} className="h-8 gap-1.5 text-xs text-gray-500">
                    <Download size={13} />Download
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="h-8 text-xs text-gray-500">
                    <RotateCcw size={13} />New
                  </Button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                  <div className="p-6 max-w-3xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
                    >
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                        {result.content}
                      </pre>
                    </motion.div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}