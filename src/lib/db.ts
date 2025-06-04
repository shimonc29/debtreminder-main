
export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  createdAt: Date;
  settings: {
    defaultEmailTemplateId: string;
    reminderIntervals: number[];
    timezone: string;
  };
  role?: 'user' | 'admin' | 'super_admin';
  status?: 'active' | 'inactive' | 'suspended';
  plan?: 'free' | 'premium' | 'enterprise';
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Debt {
  id: string;
  userId: string;
  customerId: string;
  amount: number;
  currency: string;
  description: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  status: "pending" | "paid" | "partially_paid" | "overdue" | "payment_claimed";
  paidAmount: number;
  paidDate: Date | null;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reminder {
  id: string;
  userId: string;
  debtId: string;
  customerId: string;
  channel: "email" | "whatsapp";
  templateId: string;
  sentAt: Date;
  status: "sent" | "delivered" | "failed";
  response: string;
  createdAt: Date;
}

export interface Template {
  id: string;
  userId: string;
  name: string;
  channel: "email" | "whatsapp";
  subject: string;
  body: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const currentUser: User = {
  id: "usr_1",
  email: "test@example.com",
  name: "מיכאל כהן",
  company: "דיגיטל סולושנס בע״מ",
  createdAt: new Date("2024-01-01"),
  settings: {
    defaultEmailTemplateId: "tmpl_1",
    reminderIntervals: [7, 14, 30],
    timezone: "Asia/Jerusalem",
  },
};

export const customers: Customer[] = [
  {
    id: "cust_1",
    userId: "usr_1",
    name: "אלון לוי",
    email: "alon@example.com",
    phone: "052-1234567",
    notes: "לקוח קבוע",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "cust_2",
    userId: "usr_1",
    name: "נועה גולן",
    email: "noa@example.com",
    phone: "053-7654321",
    notes: "עסק חדש",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "cust_3",
    userId: "usr_1",
    name: "דניאל אברהם",
    email: "daniel@example.com",
    phone: "054-9876543",
    notes: "",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
  },
];

export const debts: Debt[] = [
  {
    id: "debt_1",
    userId: "usr_1",
    customerId: "cust_1",
    amount: 5000,
    currency: "ILS",
    description: "עיצוב אתר",
    invoiceNumber: "INV-2024-001",
    invoiceDate: new Date("2024-03-01"),
    dueDate: new Date("2024-04-01"),
    status: "overdue",
    paidAmount: 0,
    paidDate: null,
    notes: "",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "debt_2",
    userId: "usr_1",
    customerId: "cust_2",
    amount: 3500,
    currency: "ILS",
    description: "שירותי SEO",
    invoiceNumber: "INV-2024-002",
    invoiceDate: new Date("2024-03-15"),
    dueDate: new Date("2024-04-15"),
    status: "pending",
    paidAmount: 0,
    paidDate: null,
    notes: "",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    id: "debt_3",
    userId: "usr_1",
    customerId: "cust_3",
    amount: 2000,
    currency: "ILS",
    description: "תחזוקת אתר חודשית",
    invoiceNumber: "INV-2024-003",
    invoiceDate: new Date("2024-04-01"),
    dueDate: new Date("2024-05-01"),
    status: "partially_paid",
    paidAmount: 1000,
    paidDate: new Date("2024-04-20"),
    notes: "תשלום חלקי התקבל",
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-20"),
  },
];

export const reminders: Reminder[] = [
  {
    id: "rem_1",
    userId: "usr_1",
    debtId: "debt_1",
    customerId: "cust_1",
    channel: "email",
    templateId: "tmpl_1",
    sentAt: new Date("2024-04-08"),
    status: "delivered",
    response: "",
    createdAt: new Date("2024-04-08"),
  },
  {
    id: "rem_2",
    userId: "usr_1",
    debtId: "debt_1",
    customerId: "cust_1",
    channel: "email",
    templateId: "tmpl_1",
    sentAt: new Date("2024-04-15"),
    status: "delivered",
    response: "אשלם בקרוב",
    createdAt: new Date("2024-04-15"),
  },
  {
    id: "rem_3",
    userId: "usr_1",
    debtId: "debt_3",
    customerId: "cust_3",
    channel: "whatsapp",
    templateId: "tmpl_2",
    sentAt: new Date("2024-04-10"),
    status: "delivered",
    response: "",
    createdAt: new Date("2024-04-10"),
  },
];

export const templates: Template[] = [
  {
    id: "tmpl_1",
    userId: "usr_1",
    name: "תזכורת חוב סטנדרטית",
    channel: "email",
    subject: "תזכורת חוב עבור {{invoiceNumber}}",
    body: "שלום {{customerName}},\n\nזוהי תזכורת לגבי חוב בסך {{amount}} {{currency}} שטרם שולם עבור חשבונית {{invoiceNumber}}.\nתאריך הפירעון היה {{dueDate}}.\n\nנא להסדיר את התשלום בהקדם.\n\nבברכה,\n{{userName}}",
    isDefault: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "tmpl_2",
    userId: "usr_1",
    name: "תזכורת וואטסאפ",
    channel: "whatsapp",
    subject: "",
    body: "שלום {{customerName}}, זוהי תזכורת לגבי חוב בסך {{amount}} {{currency}} שטרם שולם עבור חשבונית {{invoiceNumber}}. נא להסדיר את התשלום בהקדם.",
    isDefault: true,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
];

// System users list - for admin dashboard
export const systemUsers: User[] = [
  {
    ...currentUser,
    role: 'user',
    status: 'active',
    plan: 'premium',
  },
  {
    id: "usr_2",
    email: "user2@example.com",
    name: "שרה לוי",
    company: "אופק טכנולוגיות בע״מ",
    createdAt: new Date("2024-02-10"),
    settings: {
      defaultEmailTemplateId: "tmpl_1",
      reminderIntervals: [7, 14, 30],
      timezone: "Asia/Jerusalem",
    },
    role: 'user',
    status: 'active',
    plan: 'free',
  },
  {
    id: "usr_3",
    email: "user3@example.com",
    name: "דוד כהן",
    company: "מדיה פרו בע״מ",
    createdAt: new Date("2024-03-05"),
    settings: {
      defaultEmailTemplateId: "tmpl_1",
      reminderIntervals: [10, 20],
      timezone: "Asia/Jerusalem",
    },
    role: 'user',
    status: 'inactive',
    plan: 'premium',
  },
  {
    id: "admin_1",
    email: "admin@example.com",
    name: "מנהל מערכת",
    company: "מערכת חובות בע״מ",
    createdAt: new Date("2023-01-01"),
    settings: {
      defaultEmailTemplateId: "tmpl_1",
      reminderIntervals: [7, 14, 30],
      timezone: "Asia/Jerusalem",
    },
    role: 'super_admin',
    status: 'active',
    plan: 'enterprise',
  }
];

// Admin system logs
export interface SystemLog {
  id: string;
  timestamp: Date;
  action: string;
  userId?: string;
  userEmail?: string;
  details: string;
  level: 'info' | 'warning' | 'error';
}

export const systemLogs: SystemLog[] = [
  {
    id: "log_1",
    timestamp: new Date("2024-05-19T09:30:00"),
    action: "USER_LOGIN",
    userId: "usr_1",
    userEmail: "test@example.com",
    details: "User logged in successfully",
    level: "info",
  },
  {
    id: "log_2",
    timestamp: new Date("2024-05-19T10:15:00"),
    action: "REMINDER_SENT",
    userId: "usr_1",
    userEmail: "test@example.com",
    details: "Reminder sent to customer cust_1 for debt debt_1",
    level: "info",
  },
  {
    id: "log_3",
    timestamp: new Date("2024-05-18T14:22:00"),
    action: "REMINDER_FAILED",
    userId: "usr_2",
    userEmail: "user2@example.com",
    details: "Failed to send reminder to customer with invalid email",
    level: "error",
  },
  {
    id: "log_4",
    timestamp: new Date("2024-05-17T11:05:00"),
    action: "USER_CREATED",
    userId: "usr_3",
    userEmail: "user3@example.com",
    details: "New user account created",
    level: "info",
  },
  {
    id: "log_5",
    timestamp: new Date("2024-05-16T16:40:00"),
    action: "USER_SETTINGS_UPDATED",
    userId: "usr_2",
    userEmail: "user2@example.com",
    details: "User updated reminder intervals",
    level: "info",
  },
];

// System statistics (mock data)
export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalCustomers: number;
  totalDebts: number;
  totalReminders: number;
  revenueCollected: number;
  newUsersThisMonth: number;
  remindersEfficiency: number; // percentage
  failedReminders: number;
}

export const getSystemStats = (): SystemStats => {
  return {
    totalUsers: systemUsers.length - 1, // exclude admin
    activeUsers: systemUsers.filter(user => user.status === 'active' && user.role !== 'super_admin').length,
    totalCustomers: customers.length,
    totalDebts: debts.length,
    totalReminders: reminders.length,
    revenueCollected: 10500,
    newUsersThisMonth: 2,
    remindersEfficiency: 68, // 68% of reminders lead to payment
    failedReminders: 3,
  };
};

// User statistics
export interface UserStats {
  userId: string;
  customerCount: number;
  debtCount: number;
  reminderCount: number;
  activeDebtAmount: number;
  collectedAmount: number;
  lastActive: Date;
}

export const getUserStats = (userId: string): UserStats => {
  const userCustomers = customers.filter(c => c.userId === userId);
  const userDebts = debts.filter(d => d.userId === userId);
  const userReminders = reminders.filter(r => r.userId === userId);
  
  return {
    userId,
    customerCount: userCustomers.length,
    debtCount: userDebts.length,
    reminderCount: userReminders.length,
    activeDebtAmount: userDebts.filter(d => d.status !== 'paid').reduce((sum, d) => sum + (d.amount - d.paidAmount), 0),
    collectedAmount: userDebts.reduce((sum, d) => sum + d.paidAmount, 0),
    lastActive: new Date(),
  };
};

// Admin helper functions
export const getAllUsers = (): User[] => {
  return systemUsers.filter(user => user.id !== 'admin_1'); // Exclude the admin from the list
};

export const getUserById = (id: string): User | undefined => {
  return systemUsers.find(user => user.id === id);
};

export const getSystemLogs = (limit: number = 100): SystemLog[] => {
  return [...systemLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
};

// Monthly user growth data for charts
export interface MonthlyData {
  month: string;
  users: number;
}

export const getUserGrowthData = (): MonthlyData[] => {
  return [
    { month: "ינואר", users: 10 },
    { month: "פברואר", users: 12 },
    { month: "מרץ", users: 18 },
    { month: "אפריל", users: 25 },
    { month: "מאי", users: 30 }
  ];
};

// Helper functions
export const getCustomerById = (id: string): Customer | undefined => {
  return customers.find(customer => customer.id === id);
};

export const getDebtsByCustomerId = (customerId: string): Debt[] => {
  return debts.filter(debt => debt.customerId === customerId);
};

export const getRemindersByDebtId = (debtId: string): Reminder[] => {
  return reminders.filter(reminder => reminder.debtId === debtId);
};

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};

// Stats
export const getTotalDebtAmount = (): number => {
  return debts.reduce((total, debt) => {
    if (debt.status !== "paid") {
      return total + (debt.amount - debt.paidAmount);
    }
    return total;
  }, 0);
};

export const getOverdueDebtAmount = (): number => {
  return debts
    .filter(debt => debt.status === "overdue")
    .reduce((total, debt) => total + (debt.amount - debt.paidAmount), 0);
};

export const getTotalCustomers = (): number => {
  return customers.length;
};

export const getRecentReminders = (count: number = 5): Reminder[] => {
  return [...reminders]
    .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
    .slice(0, count);
};
