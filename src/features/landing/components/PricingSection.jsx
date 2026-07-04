import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { pricingData } from '@/mock/landing'
import { cn } from '@/lib/utils'

/**
 * PricingSection Component
 * 
 * Displays pricing plans with feature comparison.
 * 
 * UX decisions:
 * - Monthly/Yearly toggle (with 20% discount)
 * - "Popular" badge on recommended plan
 * - Clear feature lists with checkmarks
 * - Enterprise plan stands out
 * 
 * Future API Integration:
 * - GET /api/pricing/plans
 * - Pricing can be A/B tested via backend
 * - Feature flags can enable/disable plans
 */
export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  const getPrice = (plan) => {
    if (plan.id === 'free') return plan.price
    if (isYearly) {
      const monthlyPrice = parseInt(plan.price.replace('$', ''))
      const yearlyPrice = Math.floor(monthlyPrice * 12 * 0.8) // 20% off
      return `$${yearlyPrice}`
    }
    return plan.price
  }

  const getPeriod = (plan) => {
    if (plan.id === 'free') return plan.period
    return isYearly ? 'per year' : plan.period
  }

  return (
    <section id="pricing" className="py-20 lg:py-28">
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
            {pricingData.heading}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {pricingData.subheading}
          </p>

          {/* Monthly/Yearly Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1 rounded-full bg-muted">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                !isYearly
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                isYearly
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Yearly
              <span className="ml-1.5 text-xs text-green-500 font-semibold">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {pricingData.plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={cn(
                'relative h-full flex flex-col border-2 transition-all duration-300',
                plan.popular
                  ? 'border-primary shadow-xl shadow-primary/10 scale-[1.02]'
                  : 'border-border hover:border-primary/30 hover:shadow-lg'
              )}>
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-4 pt-8">
                  <h3 className="text-xl font-heading font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.description}
                  </p>
                  
                  {/* Price */}
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      {getPrice(plan)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      /{getPeriod(plan)}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  {/* Features List */}
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to={plan.id === 'enterprise' ? '#' : '/auth/register'} className="mt-8">
                    <Button
                      className={cn(
                        'w-full h-11',
                        plan.popular
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : plan.id === 'enterprise'
                            ? 'bg-foreground text-background hover:bg-foreground/90'
                            : 'bg-card border-2 border-border hover:bg-muted'
                      )}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8 text-sm text-muted-foreground"
        >
          All plans include 24/7 support, 99.9% uptime SLA, and SOC 2 compliance.
        </motion.p>
      </div>
    </section>
  )
}