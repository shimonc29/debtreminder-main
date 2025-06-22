import { getResendApiKey } from '@/config/env'

const RESEND_API_KEY = getResendApiKey()

if (!RESEND_API_KEY) {
  throw new Error('Missing Resend API key')
}

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
  fromName?: string
}

export const sendEmail = async (emailData: EmailData): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const fromAddress = emailData.fromName 
      ? `${emailData.fromName} <${emailData.from || 'noreply@debtreminder.com'}>`
      : emailData.from || 'Debt Reminder <noreply@debtreminder.com>'

    const requestBody: any = {
      from: fromAddress,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    }

    // Add text if provided
    if (emailData.text) {
      requestBody.text = emailData.text
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return {
      success: true,
      message: 'Email sent successfully',
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

// Function to test email connection
export const testEmailConnection = async (apiKey: string, fromEmail: string) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: fromEmail, // Send test email to yourself
        subject: 'בדיקת חיבור - DebtReminder System',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4338ca;">✅ בדיקת חיבור הצליחה!</h2>
            <p>זהו מייל בדיקה לוידוא תקינות החיבור למערכת שליחת האימיילים.</p>
            <p>אם אתה רואה את המייל הזה, החיבור ל-Resend עובד בהצלחה!</p>
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              נשלח ממערכת DebtReminder<br>
              ${new Date().toLocaleString('he-IL')}
            </p>
          </div>
        `
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return { 
      success: true, 
      message: 'מייל בדיקה נשלח בהצלחה!',
      messageId: result?.id
    }
  } catch (error: any) {
    console.error('Email test failed:', error)
    return { 
      success: false, 
      message: `בדיקת החיבור נכשלה: ${error.message}`
    }
  }
}

// Function to send debt reminder email
export const sendDebtReminderEmail = async (
  customerEmail: string,
  customerName: string,
  debtAmount: number,
  dueDate: string,
  companyName: string,
  fromEmail: string,
  description?: string
) => {
  const isOverdue = new Date(dueDate) < new Date()
  const subject = isOverdue 
    ? `⚠️ תזכורת דחופה לתשלום - ${companyName}`
    : `🔔 תזכורת תשלום - ${companyName}`
  
  const html = `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 0; 
          background-color: #f8fafc;
          direction: rtl;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white; 
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header { 
          background: ${isOverdue ? '#dc2626' : '#4338ca'}; 
          color: white; 
          padding: 30px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 24px; 
        }
        .content { 
          padding: 30px; 
        }
        .amount-box { 
          background: ${isOverdue ? '#fef2f2' : '#f0f9ff'}; 
          border: 2px solid ${isOverdue ? '#dc2626' : '#4338ca'}; 
          border-radius: 8px; 
          padding: 20px; 
          margin: 20px 0; 
          text-align: center; 
        }
        .amount { 
          font-size: 28px; 
          font-weight: bold; 
          color: ${isOverdue ? '#dc2626' : '#4338ca'}; 
          margin: 10px 0; 
        }
        .due-date { 
          color: ${isOverdue ? '#dc2626' : '#ea580c'}; 
          font-weight: bold; 
          font-size: 18px;
        }
        .overdue-warning {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer { 
          background: #f8fafc; 
          padding: 20px; 
          text-align: center; 
          font-size: 12px; 
          color: #6b7280; 
          border-top: 1px solid #e5e7eb;
        }
        .contact-info {
          background: #f0f9ff;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          background: ${isOverdue ? '#dc2626' : '#4338ca'};
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${isOverdue ? '⚠️ תזכורת דחופה לתשלום' : '🔔 תזכורת תשלום'}</h1>
        </div>
        
        <div class="content">
          <p style="font-size: 18px;">שלום ${customerName},</p>
          
          <p>אנו מזכירים לך כי יש לך חוב פתוח במערכת שלנו:</p>
          
          ${description ? `<p><strong>תיאור:</strong> ${description}</p>` : ''}
          
          <div class="amount-box">
            <div style="font-size: 16px; margin-bottom: 10px;">סכום לתשלום:</div>
            <div class="amount">₪${debtAmount.toLocaleString()}</div>
            <div class="due-date">תאריך פירעון: ${new Date(dueDate).toLocaleDateString('he-IL')}</div>
          </div>
          
          ${isOverdue ? `
            <div class="overdue-warning">
              ⚠️ שים לב: החוב עבר את תאריך הפירעון ונחשב לחוב בפיגור
            </div>
          ` : ''}
          
          <p>אנא דאג לסילוק החוב בהקדם האפשרי כדי למנוע עלויות נוספות.</p>
          
          <div class="contact-info">
            <strong>לשאלות ובירורים:</strong><br>
            ניתן לפנות אלינו בכל עת ואנו נשמח לעזור
          </div>
          
          <p style="margin-top: 30px;">
            בברכה,<br>
            <strong>${companyName}</strong>
          </p>
        </div>
        
        <div class="footer">
          <p>הודעה זו נשלחה אוטומטית ממערכת ניהול החובות של ${companyName}</p>
          <p>תאריך שליחה: ${new Date().toLocaleString('he-IL')}</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const text = `
שלום ${customerName},

תזכורת תשלום מ${companyName}

${description ? `תיאור: ${description}` : ''}
סכום לתשלום: ₪${debtAmount.toLocaleString()}
תאריך פירעון: ${new Date(dueDate).toLocaleDateString('he-IL')}

${isOverdue ? 'שים לב: החוב עבר את תאריך הפירעון ונחשב לחוב בפיגור' : ''}

אנא דאג לסילוק החוב בהקדם האפשרי.

לשאלות ובירורים ניתן לפנות אלינו.

בברכה,
${companyName}

---
הודעה זו נשלחה אוטומטית ממערכת ניהול החובות
  `.trim()

  return await sendEmail({
    to: customerEmail,
    from: fromEmail,
    fromName: companyName,
    subject,
    text,
    html
  })
}

// Function to send payment confirmation email
export const sendPaymentConfirmationEmail = async (
  customerEmail: string,
  customerName: string,
  paidAmount: number,
  companyName: string,
  fromEmail: string,
  originalAmount?: number
) => {
  const subject = `✅ אישור תשלום - ${companyName}`
  
  const html = `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 0; 
          background-color: #f8fafc;
          direction: rtl;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white; 
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header { 
          background: #059669; 
          color: white; 
          padding: 30px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 24px; 
        }
        .content { 
          padding: 30px; 
        }
        .amount-box { 
          background: #f0fdf4; 
          border: 2px solid #059669; 
          border-radius: 8px; 
          padding: 20px; 
          margin: 20px 0; 
          text-align: center; 
        }
        .amount { 
          font-size: 28px; 
          font-weight: bold; 
          color: #059669; 
          margin: 10px 0; 
        }
        .footer { 
          background: #f8fafc; 
          padding: 20px; 
          text-align: center; 
          font-size: 12px; 
          color: #6b7280; 
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ אישור תשלום</h1>
        </div>
        
        <div class="content">
          <p style="font-size: 18px;">שלום ${customerName},</p>
          
          <p>תשלומך התקבל בהצלחה במערכת שלנו!</p>
          
          <div class="amount-box">
            <div style="font-size: 16px; margin-bottom: 10px;">סכום שהתקבל:</div>
            <div class="amount">₪${paidAmount.toLocaleString()}</div>
            <div style="color: #059669; font-weight: bold;">תאריך תשלום: ${new Date().toLocaleDateString('he-IL')}</div>
          </div>
          
          ${originalAmount && paidAmount < originalAmount ? `
            <p style="color: #ea580c;">
              <strong>שים לב:</strong> נותר יתרת חוב של ₪${(originalAmount - paidAmount).toLocaleString()}
            </p>
          ` : ''}
          
          <p>תודה רבה על התשלום!</p>
          
          <p style="margin-top: 30px;">
            בברכה,<br>
            <strong>${companyName}</strong>
          </p>
        </div>
        
        <div class="footer">
          <p>אישור תשלום זה נשלח אוטומטית ממערכת ניהול החובות של ${companyName}</p>
          <p>תאריך שליחה: ${new Date().toLocaleString('he-IL')}</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const text = `
שלום ${customerName},

אישור תשלום מ${companyName}

תשלומך התקבל בהצלחה!

סכום שהתקבל: ₪${paidAmount.toLocaleString()}
תאריך תשלום: ${new Date().toLocaleDateString('he-IL')}

${originalAmount && paidAmount < originalAmount ? 
  `שים לב: נותר יתרת חוב של ₪${(originalAmount - paidAmount).toLocaleString()}` : ''}

תודה רבה על התשלום!

בברכה,
${companyName}
  `.trim()

  return await sendEmail({
    to: customerEmail,
    from: fromEmail,
    fromName: companyName,
    subject,
    text,
    html
  })
}

// Log email to database (implement based on your DB structure)
const logEmail = async (emailLog: {
  to: string
  from: string
  subject: string
  status: 'sent' | 'failed' | 'delivered' | 'opened'
  sentAt: Date
  messageId?: string
  error?: string
}) => {
  // TODO: Save to your Supabase database
  console.log('Email Log:', emailLog)
  
  // You can implement this to save to Supabase:
  // const { error } = await supabase
  //   .from('email_logs')
  //   .insert([emailLog])
}

// Legacy function for backward compatibility
export const initializeResendService = (apiKey: string) => {
  console.log('Resend service initialized with API key')
  // This function is kept for backward compatibility but doesn't do anything
  // since we're now using the API key from environment variables
}