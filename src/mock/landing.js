/**
 * Landing Page Mock Data
 * 
 * All content for the landing page.
 * In production, this would come from a CMS or backend API.
 * 
 * Future API Endpoints:
 * - GET /api/landing/content     → All landing page content
 * - GET /api/landing/pricing     → Pricing plans
 * - GET /api/landing/testimonials → Customer reviews
 * - GET /api/landing/faq         → FAQ items
 */

export const heroData = {
    headline: 'Supercharge Your Workflow with AI',
    subheadline: 'Chat, generate images, write code, and create documents — all in one powerful platform. Built for developers, designers, and creators.',
    primaryCTA: {
      text: 'Get Started Free',
      href: '/auth/register',
    },
    secondaryCTA: {
      text: 'View Demo',
      href: '#demo',
    },
    stats: [
      { value: '50K+', label: 'Active Users' },
      { value: '1M+', label: 'AI Generations' },
      { value: '99.9%', label: 'Uptime' },
      { value: '4.9/5', label: 'User Rating' },
    ],
  }
  
  export const featuresData = [
    {
      id: 'chat',
      icon: '💬',
      title: 'AI Chat Assistant',
      description: 'Get instant answers, brainstorm ideas, and solve complex problems with our advanced AI chat. Supports markdown, code blocks, and multi-turn conversations.',
      benefits: ['Real-time responses', 'Code syntax highlighting', 'Conversation history'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'image',
      icon: '🎨',
      title: 'AI Image Generator',
      description: 'Create stunning visuals, artwork, and designs from text descriptions. Multiple styles, aspect ratios, and quality settings available.',
      benefits: ['HD quality output', 'Style presets', 'Batch generation'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'code',
      icon: '💻',
      title: 'AI Code Generator',
      description: 'Write, debug, and optimize code in any programming language. Get explanations, refactoring suggestions, and best practices.',
      benefits: ['20+ languages', 'Code explanations', 'Error detection'],
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'document',
      icon: '📄',
      title: 'Document Generator',
      description: 'Create professional documents, reports, and articles. Templates for resumes, cover letters, business plans, and more.',
      benefits: ['Professional templates', 'Export to PDF/DOCX', 'AI editing'],
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'voice',
      icon: '🎙️',
      title: 'Voice Generator',
      description: 'Convert text to natural-sounding speech in multiple languages and voices. Perfect for content creators and accessibility.',
      benefits: ['30+ languages', 'Natural voices', 'Adjustable speed'],
      color: 'from-teal-500 to-cyan-500',
    },
    {
      id: 'translator',
      icon: '🌐',
      title: 'AI Translator',
      description: 'Translate text between 100+ languages with context-aware accuracy. Supports documents, websites, and real-time chat.',
      benefits: ['100+ languages', 'Context-aware', 'Bulk translation'],
      color: 'from-indigo-500 to-purple-500',
    },
  ]
  
  export const howItWorksData = [
    {
      step: 1,
      title: 'Create an Account',
      description: 'Sign up in seconds with your email or social account. No credit card required.',
      icon: '🚀',
    },
    {
      step: 2,
      title: 'Choose Your Tool',
      description: 'Select from our suite of AI tools — chat, image generation, code writing, and more.',
      icon: '🎯',
    },
    {
      step: 3,
      title: 'Get Results',
      description: 'Receive high-quality AI-generated content in seconds. Edit, refine, and export.',
      icon: '✨',
    },
    {
      step: 4,
      title: 'Scale & Automate',
      description: 'Use our API to integrate AI into your own applications and workflows.',
      icon: '📈',
    },
  ]
  
  export const pricingData = {
    heading: 'Simple, Transparent Pricing',
    subheading: 'Choose the plan that works best for you. Upgrade or downgrade anytime.',
    plans: [
      {
        id: 'free',
        name: 'Free',
        description: 'Perfect for trying out AI Studio',
        price: '$0',
        period: 'forever',
        features: [
          '100 AI chat messages/month',
          '10 image generations',
          '5 code generations',
          'Basic templates',
          'Community support',
        ],
        cta: 'Get Started',
        popular: false,
      },
      {
        id: 'pro',
        name: 'Pro',
        description: 'Best for professionals and creators',
        price: '$29',
        period: 'per month',
        features: [
          'Unlimited AI chat messages',
          '500 image generations/month',
          '100 code generations/month',
          'All templates',
          'Priority support',
          'API access',
          'Advanced analytics',
        ],
        cta: 'Start Free Trial',
        popular: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For teams and organizations',
        price: '$99',
        period: 'per user/month',
        features: [
          'Everything in Pro',
          'Unlimited generations',
          'Custom AI models',
          'Team collaboration',
          'SSO & SAML',
          'Dedicated support',
          'SLA guarantee',
          'Custom integrations',
        ],
        cta: 'Contact Sales',
        popular: false,
      },
    ],
  }
  
  export const testimonialsData = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Senior Developer at TechCorp',
      avatar: null,
      content: 'AI Studio has completely transformed our development workflow. The code generator saves us hours every week and the chat assistant is like having a senior developer on call 24/7.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      role: 'Design Lead at CreativeAgency',
      avatar: null,
      content: 'The image generator is incredible. We use it for concept art, social media graphics, and client presentations. The quality consistently amazes our clients.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Freelance Writer',
      avatar: null,
      content: 'As a writer, the document generator has been a game-changer. I can create outlines, drafts, and even full articles in minutes. It handles research and formatting beautifully.',
      rating: 5,
    },
  ]
  
  export const faqData = [
    {
      question: 'What is AI Studio?',
      answer: 'AI Studio is an all-in-one AI platform that combines chat, image generation, code writing, document creation, and more. It uses advanced AI models to help you work faster and smarter.',
    },
    {
      question: 'Is there a free plan available?',
      answer: 'Yes! Our free plan includes 100 chat messages, 10 image generations, and 5 code generations per month. No credit card required to get started.',
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Absolutely. You can change your plan at any time. When upgrading, you get immediate access to new features. When downgrading, changes take effect at the next billing cycle.',
    },
    {
      question: 'What AI models do you use?',
      answer: 'We use a combination of state-of-the-art models including GPT-4, Claude, Stable Diffusion, and our own fine-tuned models optimized for specific tasks.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Security is our top priority. All data is encrypted in transit and at rest. We are SOC 2 compliant and never use your data to train AI models without explicit permission.',
    },
    {
      question: 'Do you offer API access?',
      answer: 'Yes! Pro and Enterprise plans include API access. You can integrate AI Studio capabilities directly into your own applications with our well-documented REST API.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You will continue to have access to your plan features until the end of your billing period.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 14-day money-back guarantee on all paid plans. If you are not satisfied, contact our support team within 14 days of purchase for a full refund.',
    },
  ]