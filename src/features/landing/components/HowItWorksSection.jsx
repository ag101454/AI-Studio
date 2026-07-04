import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { howItWorksData } from '@/mock/landing'

/**
 * HowItWorksSection Component
 * 
 * Shows the simple process of using AI Studio.
 * 
 * Design pattern: Numbered steps with connecting lines.
 * This builds user confidence by showing how easy it is to start.
 */
export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get started in minutes with our simple 4-step process
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (desktop only) */}
          <div className="hidden lg:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
          </div>

          {howItWorksData.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Step Number Circle */}
              <div className="relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-full bg-card border-2 border-primary/20 shadow-lg mb-6">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/10 to-primary/5" />
                <span className="relative text-3xl">{step.icon}</span>
              </div>

              {/* Step Number Badge */}
              <div className="absolute -top-1 -right-1 z-20 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">
                  {step.step}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>

              {/* Arrow (mobile/tablet only) */}
              {index < howItWorksData.length - 1 && (
                <div className="flex justify-center mt-6 lg:hidden">
                  <ArrowRight size={24} className="text-muted-foreground rotate-90 md:rotate-0" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}