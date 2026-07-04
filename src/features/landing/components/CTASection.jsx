import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * CTASection Component
 * 
 * Final call-to-action before the footer.
 * 
 * Design: Full-width gradient background to grab attention.
 * Placed right before pricing or footer to convert visitors.
 */
export function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-br from-primary to-purple-600 p-8 sm:p-12 lg:p-16 overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:48px_48px]" />
          
          {/* Glow Effect */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

          <div className="relative text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 mb-6">
              <Sparkles size={14} className="text-white" />
              <span className="text-sm font-medium text-white/90">
                Start for free, no credit card required
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to supercharge your workflow?
            </h2>
            
            <p className="text-lg text-white/80 mb-8">
              Join thousands of developers, designers, and creators already using AI Studio.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-8 text-base gap-2 bg-white text-primary hover:bg-white/90"
                >
                  Get Started Free
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base gap-2 border-white/20 text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-white/60">
              Free forever plan available. Upgrade when you need more.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}