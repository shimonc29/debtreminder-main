// Environment configuration for the application
export const env = {
  // Supabase Configuration
  SUPABASE_URL: 'https://hzdmmuuowjlrgtaalbum.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZG1tdXVvd2pscmd0YWFsYnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NDcyNTMsImV4cCI6MjA2NDUyMzI1M30.7BXm54AfCR6YM1Y2zaaF-vJtQrR5pv2NjJtFRero0gM',
  SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZG1tdXVvd2pscmd0YWFsYnVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk0NzI1MywiZXhwIjoyMDY0NTIzMjUzfQ.5ErEtMB-rsUXi8IhkUtJIkfrl3PGhQHiEYjK8-_dIcA',
  
  // Resend Email Service
  RESEND_API_KEY: 're_ZcuAvx1K_FDY78JgSDzNxjj4vUoyJzJQB',
} as const;

// Export individual getters for each environment variable
export const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL || env.SUPABASE_URL;
export const getSupabaseAnonKey = () => import.meta.env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;
export const getSupabaseServiceRoleKey = () => import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
export const getResendApiKey = () => import.meta.env.VITE_RESEND_API_KEY || env.RESEND_API_KEY; 