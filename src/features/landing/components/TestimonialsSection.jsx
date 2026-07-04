import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { testimonialsData } from '@/mock/landing'

/**
 * TestimonialsSection Component
 * 
 * Social proof section showing customer reviews.
 * 
 * Why testimonials matter:
 * - Builds trust with potential customers
 * - Shows real-world use cases
 * - Reduces perceived risk of trying the product
 * 
 * Design: Card-based layout with quotes, ratings, and avatars.
 */
export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 lg:py-28">
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
            Loved by{' '}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              creators
            </span>
            {' '}everywhere
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what our users are saying about AI Studio
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonialsData.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Quote Icon */}
                  <Quote size={32} className="text-primary/20 mb-4" />

                  {/* Review Content */}
                  <blockquote className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < testimonial.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-muted-foreground/30'
                        }
                      />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}