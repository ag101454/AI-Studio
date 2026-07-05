import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PageTransition } from '@/components/ui/PageTransition'
import { Link } from 'react-router-dom'

const blogPosts = [
  {
    id: 1,
    title: 'How AI is Transforming Content Creation in 2025',
    excerpt: 'Discover how artificial intelligence is revolutionizing the way we create content, from writing to image generation.',
    author: 'Alex Johnson',
    date: 'Jan 15, 2026',
    readTime: '5 min',
    category: 'AI Trends',
    image: 'https://picsum.photos/seed/blog1/800/400',
    slug: 'ai-transforming-content-creation',
  },
  {
    id: 2,
    title: '10 Ways to Use AI Chat for Business Growth',
    excerpt: 'Learn practical ways to leverage AI chat assistants to boost productivity, customer service, and sales.',
    author: 'Sarah Chen',
    date: 'Jan 10, 2026',
    readTime: '7 min',
    category: 'Business',
    image: 'https://picsum.photos/seed/blog2/800/400',
    slug: 'ai-chat-business-growth',
  },
  {
    id: 3,
    title: 'The Ultimate Guide to AI Image Generation',
    excerpt: 'Master the art of AI image generation with tips, tricks, and best practices for stunning results.',
    author: 'Marcus Johnson',
    date: 'Jan 5, 2026',
    readTime: '8 min',
    category: 'Tutorial',
    image: 'https://picsum.photos/seed/blog3/800/400',
    slug: 'ultimate-guide-ai-image-generation',
  },
  {
    id: 4,
    title: 'AI Code Generators: Are They Replacing Developers?',
    excerpt: 'Exploring the impact of AI code generators on software development and what it means for developers.',
    author: 'Emily Rodriguez',
    date: 'Dec 28, 2025',
    readTime: '6 min',
    category: 'Development',
    image: 'https://picsum.photos/seed/blog4/800/400',
    slug: 'ai-code-generators-replacing-developers',
  },
  {
    id: 5,
    title: 'Building a SaaS Product with AI: A Complete Roadmap',
    excerpt: 'Step-by-step guide to building a successful AI-powered SaaS product from idea to launch.',
    author: 'Alex Johnson',
    date: 'Dec 20, 2025',
    readTime: '10 min',
    category: 'Tutorial',
    image: 'https://picsum.photos/seed/blog5/800/400',
    slug: 'building-saas-with-ai-roadmap',
  },
  {
    id: 6,
    title: 'The Future of Work: AI Tools Every Professional Needs',
    excerpt: 'Essential AI tools that are reshaping the modern workplace and boosting professional productivity.',
    author: 'Sarah Chen',
    date: 'Dec 15, 2025',
    readTime: '5 min',
    category: 'Productivity',
    image: 'https://picsum.photos/seed/blog6/800/400',
    slug: 'future-of-work-ai-tools',
  },
]

export function BlogPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-malt-50 via-white to-malt-100">
        {/* Header */}
        <div className="bg-white border-b border-malt-200">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <Badge className="mb-4 bg-turmeric-100 text-turmeric-700 border-0">Blog</Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              AI Studio Blog
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Insights, tutorials, and updates about AI, development, and the future of work.
            </p>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-malt-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <div className="p-6">
                  <Badge variant="outline" className="text-xs mb-3">{post.category}</Badge>
                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-turmeric-600 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User size={12} />{post.author}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{post.readTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}