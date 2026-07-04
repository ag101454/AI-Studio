import {
    LayoutDashboard,
    MessageSquare,
    Image,
    Code,
    FileText,
    Mic,
    FileCheck,
    Languages,
    Mail,
    Settings,
    Users,
    BarChart3,
    Flag,
    CreditCard,
    Shield,
  } from 'lucide-react'
  
  /**
   * Main navigation for regular users
   */
  export const mainNavigation = [
    {
      section: 'Main',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          path: '/dashboard',
          badge: null,
        },
        {
          id: 'chat',
          label: 'AI Chat',
          icon: MessageSquare,
          path: '/dashboard/chat',
          badge: null,
        },
        {
          id: 'image',
          label: 'Image Generator',
          icon: Image,
          path: '/dashboard/image',
          badge: null,
        },
        {
          id: 'code',
          label: 'Code Generator',
          icon: Code,
          path: '/dashboard/code',
          badge: null,
        },
        {
          id: 'document',
          label: 'Document Generator',
          icon: FileText,
          path: '/dashboard/document',
          badge: null,
        },
      ],
    },
    {
      section: 'Tools',
      items: [
        {
          id: 'voice',
          label: 'Voice Generator',
          icon: Mic,
          path: '/dashboard/voice',
          badge: null,
        },
        {
          id: 'resume',
          label: 'Resume Builder',
          icon: FileCheck,
          path: '/dashboard/resume',
          badge: null,
        },
        {
          id: 'translator',
          label: 'Translator',
          icon: Languages,
          path: '/dashboard/translator',
          badge: null,
        },
        {
          id: 'email',
          label: 'Email Writer',
          icon: Mail,
          path: '/dashboard/email',
          badge: null,
        },
      ],
    },
    {
      section: 'Account',
      items: [
        {
          id: 'profile',
          label: 'Profile',
          icon: Users,
          path: '/dashboard/profile',
          badge: null,
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
          path: '/dashboard/settings',
          badge: null,
        },
      ],
    },
  ]
  
  /**
   * Admin navigation items
   * Shown only to users with admin role
   */
  export const adminNavigation = [
    {
      section: 'Admin',
      items: [
        {
          id: 'admin-dashboard',
          label: 'Admin Panel',
          icon: Shield,
          path: '/dashboard/admin',
          badge: 'Admin',
        },
        {
          id: 'admin-users',
          label: 'User Management',
          icon: Users,
          path: '/dashboard/admin/users',
          badge: null,
        },
        {
          id: 'admin-subscriptions',
          label: 'Subscriptions',
          icon: CreditCard,
          path: '/dashboard/admin/subscriptions',
          badge: null,
        },
        {
          id: 'admin-analytics',
          label: 'Analytics',
          icon: BarChart3,
          path: '/dashboard/admin/analytics',
          badge: null,
        },
        {
          id: 'admin-settings',
          label: 'Admin Settings',
          icon: Settings,
          path: '/dashboard/admin/settings',
          badge: null,
        },
        {
          id: 'admin-features',
          label: 'Feature Flags',
          icon: Flag,
          path: '/dashboard/admin/features',
          badge: null,
        },
      ],
    },
  ]
  
  /**
   * Mock user data
   * Replaced by real Supabase auth data
   */
  export const mockUser = {
    id: 'user_123',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: null,
    role: 'admin',
    plan: 'pro',
  }
  
  /**
   * Mock workspace/team data
   */
  export const mockWorkspaces = [
    { id: 'ws_1', name: 'Personal', icon: '👤' },
    { id: 'ws_2', name: 'Team Alpha', icon: '🚀' },
    { id: 'ws_3', name: 'Client Projects', icon: '💼' },
  ]
  
  /**
   * Navigation item structure:
   * {
   *   id: string,        // Unique identifier
   *   label: string,     // Display name
   *   icon: LucideIcon,  // Icon component
   *   path: string,      // Route path
   *   badge: string|null // Optional badge text
   * }
   */