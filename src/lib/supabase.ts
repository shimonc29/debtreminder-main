import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Customer {
  id: string
  created_at: string
  name: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  user_id: string
}

export interface Debt {
  id: string
  created_at: string
  customer_id: string
  amount: number
  description: string
  due_date: string
  status: 'pending' | 'paid' | 'overdue'
  paid_amount: number
  paid_date?: string
  user_id: string
  customer?: Customer
}

export interface Reminder {
  id: string
  created_at: string
  debt_id: string
  type: 'email' | 'whatsapp'
  status: 'pending' | 'sent' | 'failed'
  sent_at?: string
  message_content?: string
  user_id: string
  debt?: Debt
}