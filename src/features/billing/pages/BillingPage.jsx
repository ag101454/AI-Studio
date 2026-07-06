import { motion } from 'framer-motion'
import { Check, Gift, Zap, Shield, Crown, Sparkles, PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageTransition } from '@/components/ui/PageTransition'
import { useAuth } from '@/context/AuthContext'

const freeFeatures = [
  { icon: '💬', title: 'AI Chat', desc: 'Unlimited conversations with Gemini 2.5 Flash' },
  { icon: '🎨', title: 'Image Generator', desc: 'Generate stunning AI images' },
  { icon: '💻', title: 'Code Generator', desc: 'Generate code in 8+ languages' },
  { icon: '📄', title: 'Document Generator', desc: 'Create professional documents' },
  { icon: '🎙️', title: 'Voice Generator', desc: 'Text-to-speech in multiple voices' },
  { icon: '📋', title: 'Resume Builder', desc: 'ATS-optimized resumes' },
  { icon: '🌐', title: 'Translator', desc: '100+ languages supported' },
  { icon: '✉️', title: 'Email Writer', desc: 'Professional emails in seconds' },
]

const comingSoon = [
  { icon: '📊', title: 'Advanced Analytics', desc: 'Usage tracking & insights' },
  { icon: '🤝', title: 'Team Workspaces', desc: 'Collaborate with your team' },
  { icon: '🔗', title: 'API Access', desc: 'Integrate with your apps' },
  { icon: '🎥', title: 'Video Generator', desc: 'AI-powered video creation' },
]

export function BillingPage() {
  const { user } = useAuth()
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] -m-6 bg-gradient-to-br from-malt-50 via-white to-malt-100">
        {/* Header */}
        <div className="bg-white border-b border-malt-200">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-turmeric-400 to-turmeric-600 mb-6 shadow-lg shadow-turmeric-200"
            >
              <Gift size={36} className="text-white" />
            </motion.div>
            
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-3">
              Everything is <span style={{ color: '#c8870a' }}>Free</span> Right Now! 🎉
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're in our early access phase. Enjoy all features completely free. 
              Paid plans will be introduced later.
            </p>
          </div>
        </div>

        {/* Current Plan Banner */}
        <div className="max-w-4xl mx-auto px-4 -mt-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-turmeric-500 to-turmeric-600 rounded-2xl p-6 shadow-xl shadow-turmeric-200 text-center text-white"
          >
            <PartyPopper size={24} className="inline mb-2" />
            <h2 className="font-heading text-2xl font-bold mb-1">
              Welcome, {firstName}! 🎊
            </h2>
            <p className="text-white/90">
              You have <span className="font-bold">unlimited access</span> to all features during our early access period.
            </p>
          </motion.div>
        </div>

        {/* Free Features Grid */}
        <div className="max-w-5xl mx-auto px-4 pb-8">
          <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-8 flex items-center justify-center gap-2">
            <Sparkles size={24} className="text-turmeric-500" />
            All Features Included
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {freeFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-malt-200 p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
                <Badge className="mt-2 bg-green-100 text-green-700 border-0 text-[10px]">Free</Badge>
              </motion.div>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="text-center">
            <h2 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center justify-center gap-2">
              <Zap size={20} className="text-turmeric-500" />
              Coming Soon
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {comingSoon.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="bg-white/50 rounded-xl border border-dashed border-malt-300 p-4"
                >
                  <div className="text-2xl mb-2 opacity-50">{feature.icon}</div>
                  <h3 className="font-semibold text-foreground/60 text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground/60 mt-1">{feature.desc}</p>
                  <Badge className="mt-2 bg-muted text-muted-foreground border-0 text-[10px]">Soon</Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="text-center pb-16 pt-8">
          <p className="text-sm text-muted-foreground">
            Questions? {' '}
            <a href="#" className="text-turmeric-600 hover:underline font-medium">Contact us</a>
            {' '}· We'll announce paid plans in advance · No surprise charges
          </p>
        </div>
      </div>
    </PageTransition>
  )
}