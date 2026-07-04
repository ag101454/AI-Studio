import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { faqData } from '@/mock/landing'

/**
 * FAQSection Component
 * 
 * Frequently Asked Questions with accordion behavior.
 * 
 * UX decisions:
 * - One question open at a time (accordion pattern)
 * - Smooth animations for open/close
 * - Searchable? Could be added later
 * - Grouped by category? Could be added with more questions
 * 
 * Why accordion:
 * - Users scan questions and only expand what's relevant
 * - Saves vertical space
 * - Standard pattern for FAQ sections
 */
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <HelpCircle size={32} className="text-primary" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about AI Studio
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div
                className={cn(
                  'rounded-xl border transition-all duration-200',
                  openIndex === index
                    ? 'border-primary/50 bg-card shadow-lg'
                    : 'border-border bg-card hover:border-primary/20'
                )}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className={cn(
                    'text-sm font-medium pr-4 transition-colors',
                    openIndex === index ? 'text-primary' : 'text-foreground'
                  )}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      'shrink-0 text-muted-foreground transition-transform duration-200',
                      openIndex === index && 'rotate-180'
                    )}
                  />
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <div className="pt-1 border-t border-border">
                          <p className="text-sm text-muted-foreground leading-relaxed pt-4">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12 p-6 rounded-xl bg-card border border-border"
        >
          <p className="text-sm text-muted-foreground">
            Still have questions?{' '}
            <a href="#" className="text-primary font-medium hover:underline">
              Contact our support team
            </a>
            {' '}— we're here to help.
          </p>
        </motion.div>
      </div>
    </section>
  )
}