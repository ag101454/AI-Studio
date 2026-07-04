/**
 * Chat Mock Data
 * 
 * This represents the data structures the backend will provide.
 * 
 * API Endpoints (future):
 * - GET    /api/conversations          → List all conversations
 * - GET    /api/conversations/:id      → Get single conversation with messages
 * - POST   /api/conversations          → Create new conversation
 * - POST   /api/conversations/:id/messages → Send a message
 * - DELETE /api/conversations/:id      → Delete conversation
 * - PATCH  /api/conversations/:id      → Update (rename, pin, archive)
 */

/**
 * Mock conversation list.
 * Each conversation represents a chat thread.
 */
export const mockConversations = [
    {
      id: 'conv_1',
      title: 'React Server Components Explained',
      lastMessage: 'RSC allows components to run on the server...',
      timestamp: '2026-07-02T10:30:00Z',
      isPinned: true,
      isArchived: false,
      messageCount: 24,
      model: 'GPT-4',
    },
    {
      id: 'conv_2',
      title: 'Tailwind CSS Tips & Tricks',
      lastMessage: 'You can use @apply for reusable styles...',
      timestamp: '2026-07-01T15:45:00Z',
      isPinned: false,
      isArchived: false,
      messageCount: 18,
      model: 'GPT-4',
    },
    {
      id: 'conv_3',
      title: 'Build a REST API with Node.js',
      lastMessage: 'Here s the complete CRUD implementation...',
      timestamp: '2026-06-30T09:15:00Z',
      isPinned: true,
      isArchived: false,
      messageCount: 32,
      model: 'Claude 3',
    },
    {
      id: 'conv_4',
      title: 'Debugging Memory Leaks in React',
      lastMessage: 'Use the React DevTools profiler to identify...',
      timestamp: '2026-06-28T14:20:00Z',
      isPinned: false,
      isArchived: false,
      messageCount: 15,
      model: 'GPT-4',
    },
    {
      id: 'conv_5',
      title: 'Write a Cover Letter for Frontend Role',
      lastMessage: 'Dear Hiring Manager, I am excited to apply...',
      timestamp: '2026-06-25T11:00:00Z',
      isPinned: false,
      isArchived: true,
      messageCount: 8,
      model: 'Claude 3',
    },
  ]
  
  /**
   * Mock messages for a single conversation.
   * Each message has a role (user/assistant) and content.
   */
  export const mockMessages = [
    {
      id: 'msg_1',
      conversationId: 'conv_1',
      role: 'user',
      content: 'What are React Server Components and how do they differ from Client Components?',
      timestamp: '2026-07-02T10:00:00Z',
      status: 'sent', // 'sending' | 'sent' | 'error'
    },
    {
      id: 'msg_2',
      conversationId: 'conv_1',
      role: 'assistant',
      content: `# React Server Components (RSC)
  
  React Server Components are a **paradigm shift** in how we build React applications. Here's what you need to know:
  
  ## Key Differences
  
  | Feature | Server Components | Client Components |
  |---------|------------------|-------------------|
  | Where they run | Server only | Browser |
  | Bundle size | Zero JS sent | Full component JS |
  | Data fetching | Direct DB access | API calls needed |
  
  ## Example Server Component
  
  \`\`\`jsx
  // This runs on the server
  async function UserList() {
    const users = await db.users.findMany()
    
    return (
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    )
  }
  \`\`\`
  
  ## Benefits
  
  1. **Smaller bundles** - Server components don't ship JavaScript
  2. **Direct backend access** - Query databases without API routes
  3. **Automatic code splitting** - Only client components are bundled
  
  > **Note:** Server Components cannot use hooks, event handlers, or browser APIs.`,
      timestamp: '2026-07-02T10:00:05Z',
      status: 'sent',
    },
    {
      id: 'msg_3',
      conversationId: 'conv_1',
      role: 'user',
      content: 'Can you show me a practical example combining both server and client components?',
      timestamp: '2026-07-02T10:05:00Z',
      status: 'sent',
    },
    {
      id: 'msg_4',
      conversationId: 'conv_1',
      role: 'assistant',
      content: `Absolutely! Here's a practical example:
  
  ## Mixed Component Architecture
  
  \`\`\`jsx
  // ServerComponent.jsx - Runs on server
  import { db } from '@/lib/db'
  import { LikeButton } from './LikeButton' // Client component
  
  export async function BlogPost({ postId }) {
    const post = await db.post.findUnique({
      where: { id: postId },
      include: { author: true }
    })
  
    return (
      <article>
        <h1>{post.title}</h1>
        <p>By {post.author.name}</p>
        <div>{post.content}</div>
        
        {/* Client component inside server component */}
        <LikeButton 
          postId={post.id}
          initialLikes={post.likes}
        />
      </article>
    )
  }
  \`\`\`
  
  \`\`\`jsx
  // LikeButton.jsx - Client Component
  'use client'
  
  import { useState } from 'react'
  
  export function LikeButton({ postId, initialLikes }) {
    const [likes, setLikes] = useState(initialLikes)
    
    return (
      <button onClick={() => setLikes(l => l + 1)}>
        ❤️ {likes} Likes
      </button>
    )
  }
  \`\`\`
  
  ## Key Points:
  - Server component fetches data directly
  - Client component handles interactivity
  - They compose together seamlessly
  - The \`'use client'\` directive marks the boundary`,
      timestamp: '2026-07-02T10:05:08Z',
      status: 'sent',
    },
  ]
  
  /**
   * Suggested prompts shown to users.
   * These help users start conversations quickly.
   * 
   * Future: GET /api/suggestions?context=dashboard
   */
  export const suggestedPrompts = [
    {
      id: 'sug_1',
      title: 'Explain a technical concept',
      prompt: 'Explain how React hooks work under the hood',
      icon: '💡',
      category: 'Learning',
    },
    {
      id: 'sug_2',
      title: 'Write code',
      prompt: 'Write a function that sorts an array of objects by multiple keys',
      icon: '💻',
      category: 'Coding',
    },
    {
      id: 'sug_3',
      title: 'Debug an error',
      prompt: 'I m getting Cannot read property of undefined- help me debug',
      icon: '🐛',
      category: 'Debugging',
    },
    {
      id: 'sug_4',
      title: 'Draft an email',
      prompt: 'Write a professional email to schedule a meeting with a client',
      icon: '✉️',
      category: 'Writing',
    },
    {
      id: 'sug_5',
      title: 'Summarize content',
      prompt: 'Summarize the key features of React 19',
      icon: '📝',
      category: 'Research',
    },
    {
      id: 'sug_6',
      title: 'Refactor code',
      prompt: 'Refactor this code to use modern JavaScript practices',
      icon: '🔧',
      category: 'Coding',
    },
  ]