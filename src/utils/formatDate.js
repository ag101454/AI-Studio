/**
 * Date formatting utilities.
 * 
 * These are pure functions - no side effects, no API calls.
 * Easy to test and reuse anywhere in the app.
 */

/**
 * Format a date string to relative time (e.g., "2 hours ago")
 */
export function timeAgo(dateString) {
    const now = new Date()
    const date = new Date(dateString)
    const seconds = Math.floor((now - date) / 1000)
  
    if (seconds < 60) return 'Just now'
  
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
  
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
  
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
  
    // Older than a week, show the date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }
  
  /**
   * Format a date for message timestamps
   */
  export function formatMessageTime(dateString) {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }