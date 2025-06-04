
import React from 'react';

interface WhatsAppResponseTemplateProps {
  customerName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: Date;
  companyName: string;
}

export function WhatsAppResponseTemplate({
  customerName,
  invoiceNumber,
  amount,
  currency,
  dueDate,
  companyName
}: WhatsAppResponseTemplateProps) {
  const template = `שלום ${customerName},

זוהי תזכורת לתשלום חשבונית מספר ${invoiceNumber} בסך ${amount} ${currency}.
תאריך אחרון לתשלום: ${dueDate.toLocaleDateString('he-IL')}.

נשמח אם תוכל/י להסדיר את התשלום בהקדם.

אם כבר שילמת, אנא השב/י "שולם" להודעה זו ונשלח לך בקשה לפרטים נוספים.

בברכה,
${companyName}`;

  return <div style={{ whiteSpace: 'pre-wrap', direction: 'rtl' }}>{template}</div>;
}
