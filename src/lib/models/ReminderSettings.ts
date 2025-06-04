
export interface ReminderSettings {
  enabled: boolean;
  reminderDays: number[];
  defaultTemplateId: string;
  defaultChannel: "email" | "whatsapp";
}

// Interface for reminder log entries
export interface ReminderLog {
  id: string;
  timestamp: Date;
  action: string;
  description: string;
  status: "success" | "warning" | "error" | "info";
}

// Interface for reminder response from customer
export interface ReminderResponse {
  token: string;
  reminderId: string;
  responseType: "paid" | "help" | "issue";
  paidAmount?: number;
  paidDate?: Date;
  notes?: string;
  createdAt: Date;
}
