import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Zap, Users, Star, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { heroData } from '@/mock/landing'

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background - Malt gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(170deg, #faf6ed 0%, #f5ecd7 30%, #e8d9b0 60%, #fdfaf2 100%)',
        }}
      />

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #9e6b08 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Warm honey glowing orbs */}
      <div
        className="absolute top-20 left-10 w-96 h-96 rounded-full blur-[150px]"
        style={{ backgroundColor: 'rgba(240, 199, 94, 0.2)' }}
      />
      <div
        className="absolute bottom-10 right-10 w-80 h-80 rounded-full blur-[120px]"
        style={{ backgroundColor: 'rgba(230, 168, 23, 0.15)' }}
      />
      <div
        className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full blur-[130px]"
        style={{ backgroundColor: 'rgba(212, 201, 168, 0.12)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">

          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 border shadow-sm"
            style={{
              backgroundColor: 'rgba(253, 250, 242, 0.9)',
              borderColor: '#e8d9b0',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Sparkles size={15} style={{ color: '#c8870a' }} />
            <span style={{ color: '#7d6e46', fontSize: '0.875rem', fontWeight: 500 }}>
              New: AI Code Generator is now available
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]"
            style={{
              color: '#3d2e14',
              textShadow: '0 2px 10px rgba(61, 46, 20, 0.06)',
            }}
          >
            {heroData.headline.split('AI').length > 1 ? (
              <>
                {heroData.headline.split('AI')[0]}
                <span className="relative inline-block">
                  <span
                    className="relative z-10"
                    style={{
                      background: 'linear-gradient(135deg, #c8870a 0%, #e6a817 40%, #9e6b08 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    AI
                  </span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="absolute bottom-1 left-0 right-0 h-3 -z-10 rounded-full opacity-20"
                    style={{ backgroundColor: '#f0c75e', transformOrigin: 'left' }}
                  />
                </span>
                {heroData.headline.split('AI')[1]}
              </>
            ) : (
              heroData.headline
            )}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#7d6e46' }}
          >
            {heroData.subheadline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to={heroData.primaryCTA.href}>
              <Button
                size="lg"
                className="h-14 px-10 text-base gap-2 font-semibold rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                style={{
                  background: 'linear-gradient(135deg, #c8870a 0%, #9e6b08 50%, #7d5206 100%)',
                  color: '#fdfaf2',
                  boxShadow: '0 8px 32px rgba(200, 135, 10, 0.3)',
                }}
              >
                {heroData.primaryCTA.text}
                <ArrowRight size={18} />
              </Button>
            </Link>
            <a href={heroData.secondaryCTA.href}>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-base gap-2 font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
                style={{
                  borderColor: '#d4c9a8',
                  color: '#3d2e14',
                  backgroundColor: 'rgba(253, 250, 242, 0.7)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Play size={18} />
                {heroData.secondaryCTA.text}
              </Button>
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {heroData.stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-center p-5 rounded-2xl transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(253, 250, 242, 0.8)',
                  border: '1px solid #e8d9b0',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  className="text-3xl sm:text-4xl font-bold font-heading mb-1"
                  style={{ color: '#3d2e14' }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-sm font-medium"
                  style={{ color: '#7d6e46' }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trusted By */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16"
          >
            <p
              className="text-sm font-medium mb-5 uppercase tracking-wider"
              style={{ color: '#b8a87e' }}
            >
              Trusted by developers worldwide
            </p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'].map((company) => (
                <span
                  key={company}
                  className="text-lg font-bold opacity-40 hover:opacity-60 transition-opacity cursor-default"
                  style={{ color: '#3d2e14' }}
                >
                  {company}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex flex-col items-center gap-2"
          >
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: '#d4c9a8' }}
            >
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-8 rounded-full border-2 flex items-start justify-center p-1"
              style={{ borderColor: '#d4c9a8' }}
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: '#c8870a' }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}