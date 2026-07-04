import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { WelcomeScreen } from '@/components/ui/WelcomeScreen'
import { HeroSection } from '@/features/landing/components/HeroSection'
import { FeaturesSection } from '@/features/landing/components/FeaturesSection'
import { HowItWorksSection } from '@/features/landing/components/HowItWorksSection'
import { TestimonialsSection } from '@/features/landing/components/TestimonialsSection'
import { PricingSection } from '@/features/landing/components/PricingSection'
import { FAQSection } from '@/features/landing/components/FAQSection'
import { CTASection } from '@/features/landing/components/CTASection'
import { Footer } from '@/features/landing/components/Footer'
import { requestNotificationPermission } from '@/context/NotificationContext'

/**
 * LandingPage Component
 * 
 * Complete public-facing landing page with all sections.
 * Includes welcome screen and notification permission request.
 */
export function LandingPage() {
  const [showWelcome, setShowWelcome] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    // Check if user has seen welcome this session
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome')

    if (!hasSeenWelcome) {
      // Show welcome after a tiny delay
      const timer = setTimeout(() => {
        setShowWelcome(true)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      // Show content immediately
      setContentVisible(true)
    }

    // Request notification permission after 5 seconds
    const notificationTimer = setTimeout(() => {
      requestNotificationPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('🔔 Notifications enabled!')
        }
      })
    }, 5000)

    return () => clearTimeout(notificationTimer)
  }, [])

  const handleWelcomeComplete = () => {
    sessionStorage.setItem('hasSeenWelcome', 'true')
    setShowWelcome(false)

    // Slight delay before showing content for smooth transition
    setTimeout(() => {
      setContentVisible(true)
    }, 300)
  }

  return (
    <>
      {/* Welcome Screen */}
      {showWelcome && (
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      )}

      {/* Main Landing Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: contentVisible ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {contentVisible && (
          <div>
            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* Pricing Section */}
            <PricingSection />

            {/* FAQ Section */}
            <FAQSection />

            {/* CTA Section */}
            <CTASection />

            {/* Footer */}
            <Footer />
          </div>
        )}
      </motion.div>
    </>
  )
}