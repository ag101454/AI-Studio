import { motion } from 'framer-motion'
import { MessageSquare, Image, Code, Zap, TrendingUp, Users, FileText, CreditCard, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageTransition } from '@/components/ui/PageTransition'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { AnimatedCard } from '@/components/ui/AnimatedCard'
import { staggerContainer, staggerItem, fadeInUp } from '@/utils/animations'
import { useAuth } from '@/context/AuthContext'

export function DashboardPage() {
  const { user } = useAuth()

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 
                    user?.email?.split('@')[0] || 
                    'there'

  const quickActions = [
    { icon: MessageSquare, label: 'New Chat', color: 'text-blue-500', bgColor: 'bg-blue-500/10', href: '/dashboard/chat' },
    { icon: Image, label: 'Generate Image', color: 'text-purple-500', bgColor: 'bg-purple-500/10', href: '/dashboard/image' },
    { icon: Code, label: 'Write Code', color: 'text-green-500', bgColor: 'bg-green-500/10', href: '/dashboard/code' },
    { icon: Zap, label: 'Quick Action', color: 'text-orange-500', bgColor: 'bg-orange-500/10', href: '#' },
  ]

  const stats = [
    { label: 'Total Chats', value: 1234, change: '+12%', icon: MessageSquare, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Images Generated', value: 856, change: '+8%', icon: Image, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { label: 'Documents Created', value: 423, change: '+23%', icon: FileText, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { label: 'API Credits', value: 8450, change: '1,550 left', icon: CreditCard, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  ]

  return (
    <PageTransition>
      <div className="space-y-6 lg:space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Welcome back, {firstName}!{' '}
            <motion.span
              animate={{ rotate: [0, 14, -8, 14, 0] }}
              transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 5 }}
              className="inline-block origin-bottom-right"
            >
              👋
            </motion.span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Here's what's happening with your AI Studio today.
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="truncate">{user?.email}</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <motion.div key={action.label} variants={staggerItem}>
                  <AnimatedCard glow className="cursor-pointer group">
                    <div className="flex flex-col items-center gap-2 sm:gap-3 py-1 sm:py-2">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                        className={`p-2 sm:p-3 rounded-full ${action.bgColor} ${action.color} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon size={20} className="sm:w-6 sm:h-6" />
                      </motion.div>
                      <span className="text-xs sm:text-sm font-medium text-foreground">
                        {action.label}
                      </span>
                    </div>
                  </AnimatedCard>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <motion.div key={stat.label} variants={staggerItem}>
                  <AnimatedCard>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 sm:space-y-2">
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-foreground font-heading">
                          <AnimatedCounter value={stat.value} />
                        </p>
                        <div className="flex items-center gap-1">
                          <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5 text-green-500" />
                          <span className="text-xs text-green-500 font-medium">{stat.change}</span>
                        </div>
                      </div>
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className={`p-2 sm:p-3 rounded-xl ${stat.bgColor}`}>
                        <Icon size={18} className={`sm:w-5 sm:h-5 ${stat.color}`} />
                      </motion.div>
                    </div>
                  </AnimatedCard>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <AnimatedCard>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Recent Activity</h3>
              <motion.button whileHover={{ x: 3 }} className="text-xs sm:text-sm text-primary flex items-center gap-1 hover:underline">
                View all <ArrowUpRight size={12} className="sm:w-3.5 sm:h-3.5" />
              </motion.button>
            </div>
            <div className="text-center py-8 sm:py-12">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted mb-3 sm:mb-4">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </motion.div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">No activity yet</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                Your recent activity will appear here. Start a new chat or generate an image to see your history.
              </p>
            </div>
          </AnimatedCard>
        </motion.div>
      </div>
    </PageTransition>
  )
}