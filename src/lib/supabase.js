import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
const supabaseUrl = 'https://grgksxgssybrlgfpjrot.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZ2tzeGdzc3licmxnZnBqcm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5OTIxODksImV4cCI6MjA5ODU2ODE4OX0.njqqbibRCOOtXBuoP6YObQvq2sum0AJidx8vKnmx6JI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)