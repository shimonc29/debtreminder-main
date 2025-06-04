import { supabase, Customer, Debt, Reminder } from './supabase.js'


// Customer API functions
export const customerAPI = {
  // Get all customers for current user
  async getAll(): Promise<Customer[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Create new customer
  async create(customer: Omit<Customer, 'id' | 'created_at' | 'user_id'>): Promise<Customer> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('customers')
      .insert([{ ...customer, user_id: user.id }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update customer
  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete customer
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Debt API functions
export const debtAPI = {
  // Get all debts with customer info
  async getAll(): Promise<Debt[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('debts')
      .select(`
        *,
        customer:customers(*)
      `)
      .eq('user_id', user.id)
      .order('due_date', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  // Get debts for specific customer
  async getByCustomer(customerId: string): Promise<Debt[]> {
    const { data, error } = await supabase
      .from('debts')
      .select(`
        *,
        customer:customers(*)
      `)
      .eq('customer_id', customerId)
      .order('due_date', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  // Create new debt
  async create(debt: Omit<Debt, 'id' | 'created_at' | 'user_id' | 'customer'>): Promise<Debt> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('debts')
      .insert([{ ...debt, user_id: user.id }])
      .select(`
        *,
        customer:customers(*)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // Update debt
  async update(id: string, updates: Partial<Debt>): Promise<Debt> {
    const { data, error } = await supabase
      .from('debts')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        customer:customers(*)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // Mark debt as paid
  async markAsPaid(id: string, paidAmount: number): Promise<Debt> {
    const { data, error } = await supabase
      .from('debts')
      .update({
        status: 'paid',
        paid_amount: paidAmount,
        paid_date: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        customer:customers(*)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // Delete debt
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('debts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Reminder API functions
export const reminderAPI = {
  // Get all reminders with debt and customer info
  async getAll(): Promise<Reminder[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('reminders')
      .select(`
        *,
        debt:debts(
          *,
          customer:customers(*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Create new reminder
  async create(reminder: Omit<Reminder, 'id' | 'created_at' | 'user_id' | 'debt'>): Promise<Reminder> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('reminders')
      .insert([{ ...reminder, user_id: user.id }])
      .select(`
        *,
        debt:debts(
          *,
          customer:customers(*)
        )
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // Update reminder status
  async updateStatus(id: string, status: 'pending' | 'sent' | 'failed'): Promise<Reminder> {
    const { data, error } = await supabase
      .from('reminders')
      .update({
        status,
        sent_at: status === 'sent' ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select(`
        *,
        debt:debts(
          *,
          customer:customers(*)
        )
      `)
      .single()
    
    if (error) throw error
    return data
  }
}

// Dashboard statistics
export const dashboardAPI = {
  async getStats() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    // Get total debts
    const { data: debts } = await supabase
      .from('debts')
      .select('amount, status, due_date')
      .eq('user_id', user.id)
    
    // Get customers count
    const { count: customersCount } = await supabase
      .from('customers')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
    
    // Calculate statistics
    const totalAmount = debts?.reduce((sum, debt) => sum + debt.amount, 0) || 0
    const paidAmount = debts?.filter(d => d.status === 'paid').reduce((sum, debt) => sum + debt.amount, 0) || 0
    const pendingAmount = totalAmount - paidAmount
    
    const today = new Date().toISOString().split('T')[0]
    const overdueDebts = debts?.filter(d => d.status === 'pending' && d.due_date < today) || []
    
    return {
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount: overdueDebts.reduce((sum, debt) => sum + debt.amount, 0),
      totalCustomers: customersCount || 0,
      totalDebts: debts?.length || 0,
      overdueCount: overdueDebts.length
    }
  }
}