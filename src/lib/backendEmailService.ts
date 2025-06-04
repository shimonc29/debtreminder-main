// Updated Backend Email Service - For calling Vercel API
export interface EmailSettings {
  provider: 'sendgrid' | 'mailgun' | 'ses' | 'resend'
  apiKey: string
  fromEmail: string
  fromName: string
  enableWhiteLabeling: boolean
  maxEmailsPerDay: number
  defaultDailyLimit: number
}

export interface EmailData {
  to: string | string[]
  from: string
  fromName?: string
  subject: string
  text: string
  html: string
}

// Get API URL - will be different for local vs production
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // In browser
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api' // Vercel dev server
    }
    return '/api' // Production - same domain
  }
  return '/api'
}

// Save email settings to database
export const saveEmailSettings = async (settings: any): Promise<{ success: boolean; message?: string }> => {
  try {
    // For now, save to localStorage as temporary solution
    localStorage.setItem('emailSettings', JSON.stringify(settings))
    
    // TODO: Later, save to Supabase:
    // const { error } = await supabase
    //   .from('email_settings')
    //   .upsert([{ ...settings, user_id: user.id }])
    
    return { success: true }
  } catch (error: any) {
    console.error('Failed to save email settings:', error)
    return { success: false, message: error.message }
  }
}

// Load email settings from database
export const loadEmailSettings = async (): Promise<EmailSettings | null> => {
  try {
    // For now, load from localStorage
    const saved = localStorage.getItem('emailSettings')
    if (saved) {
      return JSON.parse(saved)
    }
    
    return null
  } catch (error: any) {
    console.error('Failed to load email settings:', error)
    return null
  }
}

// Test email connection via Vercel API
export const testEmailConnection = async (apiKey: string, fromEmail: string): Promise<{ success: boolean; message: string }> => {
  try {
    if (!apiKey || apiKey.length < 10) {
      return { success: false, message: 'מפתח API לא תקין' }
    }
    
    if (!fromEmail || !fromEmail.includes('@')) {
      return { success: false, message: 'כתובת אימייל לא תקינה' }
    }

    const emailData = {
      apiKey,
      to: fromEmail, // Send test email to yourself
      from: fromEmail,
      fromName: 'DebtReminder System',
      subject: 'בדיקת חיבור - DebtReminder System',
      text: 'זהו מייל בדיקה לוידוא תקינות החיבור למערכת שליחת האימיילים.',
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
    }

    const response = await fetch(`${getApiUrl()}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    })

    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send test email')
    }

    return { 
      success: true, 
      message: 'מייל בדיקה נשלח בהצלחה! בדוק את תיבת המייל שלך (כולל ספאם)'
    }
    
  } catch (error: any) {
    console.error('Email test failed:', error)
    return { 
      success: false, 
      message: `בדיקת החיבור נכשלה: ${error.message}`
    }
  }
}

// Send email via Vercel API 
export const sendEmail = async (emailData: EmailData, apiKey?: string): Promise<{ success: boolean; messageId?: string; message?: string }> => {
  try {
    // Get API key from settings if not provided
    let useApiKey = apiKey
    if (!useApiKey) {
      const settings = await loadEmailSettings()
      useApiKey = settings?.apiKey
    }

    if (!useApiKey) {
      throw new Error('API Key not found. Please configure email settings first.')
    }

    const requestData = {
      apiKey: useApiKey,
      to: emailData.to,
      from: emailData.from,
      fromName: emailData.fromName,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html
    }

    const response = await fetch(`${getApiUrl()}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })

    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send email')
    }

    // Log successful email
    console.log('Email sent successfully:', result)

    return {
      success: true,
      messageId: result.messageId,
      message: 'אימייל נשלח בהצלחה'
    }
    
  } catch (error: any) {
    console.error('Failed to send email:', error)
    return { success: false, message: error.message }
  }
}

// Send debt reminder email
export const sendDebtReminderEmail = async (
  customerEmail: string,
  customerName: string,
  debtAmount: number,
  dueDate: string,
  companyName: string,
  fromEmail: string,
  description?: string
): Promise<{ success: boolean; messageId?: string; message?: string }> => {
  
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
בברכה, ${companyName}
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