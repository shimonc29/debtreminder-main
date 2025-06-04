
// Interface for WhatsApp integration settings
export interface WhatsAppSettings {
  enabled: boolean;
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  whatsappBusinessId: string;
  quotaSettings: {
    freePlanLimit: number;
    basicPlanLimit: number;
    proPlanLimit: number;
    enterprisePlanLimit: number;
  };
}

// Interface for WhatsApp message log
export interface WhatsAppLog {
  id: string;
  timestamp: Date;
  customerId: string;
  customerName: string;
  phoneNumber: string;
  messageType: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  templateId: string;
  templateName: string;
  content: string;
}

// Interface for WhatsApp templates
export interface WhatsAppTemplate {
  id: string;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
  category: string;
  createdAt: Date;
  components: {
    type: 'HEADER' | 'BODY' | 'FOOTER';
    text: string;
  }[];
}

// Interface for WhatsApp template submission
export interface WhatsAppTemplateSubmission {
  name: string;
  category: string;
  language: string;
  components: {
    type: string;
    text: string;
    example?: string[];
  }[];
}
