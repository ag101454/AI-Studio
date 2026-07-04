import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { featuresData } from '@/mock/landing'
import { cn } from '@/lib/utils'

/**
 * FeaturesSection Component
 * 
 * Showcases the main features of AI Studio.
 * 
 * Design decisions:
 * - 3-column grid on desktop, 1 column on mobile
 * - Color-coded gradient borders for visual distinction
 * - Benefits list with checkmarks
 * - Scroll-triggered animations
 * 
 * Why cards instead of a list:
 * - Features are distinct products within the platform
 * - Each needs enough space for icon, title, description, and benefits
 * - Cards create visual hierarchy and scanning patterns
 */
export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28">
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
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              create with AI
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful AI tools for every creative task. Chat, generate, code, and design — all from one platform.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group relative h-full border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Gradient Bar on Top */}
                <div className={cn(
                  'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  feature.color
                )} />

                <CardContent className="p-6">
                  {/* Icon */}
                  <div className={cn(
                    'inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br text-2xl mb-4',
                    feature.color,
                    'bg-opacity-10'
                  )}>
                    <span>{feature.icon}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check size={14} className="text-green-500 shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}