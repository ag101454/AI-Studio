import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { CodeBlock } from './CodeBlock'
import { cn } from '@/lib/utils'

/**
 * MarkdownRenderer Component
 * 
 * Renders markdown content with custom components.
 * 
 * Why custom components:
 * - Default HTML elements don't match our design system
 * - We want consistent styling across the app
 * - Code blocks need special treatment (copy button, header)
 * - Links should open in new tabs for security
 * 
 * Security note:
 * react-markdown is safe by default - it doesn't render raw HTML.
 * This prevents XSS attacks from AI-generated content.
 */
export function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        // Code Blocks (```)
        code({ node, inline, className, children, ...props }) {
          // Inline code (`code`)
          if (inline) {
            return (
              <code
                className="px-1.5 py-0.5 rounded-md bg-muted text-sm font-mono text-primary"
                {...props}
              >
                {children}
              </code>
            )
          }

          // Block code - extract language from className
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : null
          
          return (
            <CodeBlock language={language}>
              {String(children).replace(/\n$/, '')}
            </CodeBlock>
          )
        },

        // Headings
        h1: ({ children, ...props }) => (
          <h1 className="text-2xl font-heading font-bold mt-6 mb-3 text-foreground" {...props}>
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 className="text-xl font-heading font-semibold mt-5 mb-2 text-foreground" {...props}>
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 className="text-lg font-heading font-semibold mt-4 mb-2 text-foreground" {...props}>
            {children}
          </h3>
        ),

        // Paragraphs
        p: ({ children, ...props }) => (
          <p className="my-2 leading-relaxed text-foreground/90" {...props}>
            {children}
          </p>
        ),

        // Lists
        ul: ({ children, ...props }) => (
          <ul className="list-disc list-inside my-2 space-y-1 text-foreground/90" {...props}>
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className="list-decimal list-inside my-2 space-y-1 text-foreground/90" {...props}>
            {children}
          </ol>
        ),
        li: ({ children, ...props }) => (
          <li className="ml-2" {...props}>
            {children}
          </li>
        ),

        // Bold & Italic
        strong: ({ children, ...props }) => (
          <strong className="font-semibold text-foreground" {...props}>
            {children}
          </strong>
        ),
        em: ({ children, ...props }) => (
          <em className="italic text-foreground/80" {...props}>
            {children}
          </em>
        ),

        // Links (open in new tab for security)
        a: ({ children, href, ...props }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
            {...props}
          >
            {children}
          </a>
        ),

        // Blockquotes
        blockquote: ({ children, ...props }) => (
          <blockquote
            className="border-l-4 border-primary/30 pl-4 my-3 italic text-muted-foreground bg-muted/20 py-2 rounded-r-lg"
            {...props}
          >
            {children}
          </blockquote>
        ),

        // Tables
        table: ({ children, ...props }) => (
          <div className="overflow-x-auto my-4 rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border" {...props}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children, ...props }) => (
          <thead className="bg-muted/50" {...props}>
            {children}
          </thead>
        ),
        th: ({ children, ...props }) => (
          <th
            className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            {...props}
          >
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td
            className="px-4 py-2.5 text-sm text-foreground/90 border-t border-border"
            {...props}
          >
            {children}
          </td>
        ),

        // Horizontal Rule
        hr: ({ ...props }) => (
          <hr className="my-6 border-border" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}