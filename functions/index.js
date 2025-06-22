/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const { Resend } = require('resend');
const { createClient } = require('@supabase/supabase-js');

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Get environment variables from Firebase Functions config
const RESEND_API_KEY = functions.config().resend.api_key;
const SUPABASE_URL = functions.config().supabase.url;
const SUPABASE_SERVICE_ROLE_KEY = functions.config().supabase.service_role_key;

// Initialize Supabase with service role key for server-side operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Initialize Resend
const resend = new Resend(RESEND_API_KEY);

// Helper functions
function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function sanitizeString(str, maxLength = 255) {
  if (!str) return '';
  return String(str).replace(/[\r\n]/g, '').slice(0, maxLength);
}

function sanitizeHtml(html, maxLength = 5000) {
  return String(html || '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .slice(0, maxLength);
}

// Main email sending function
exports.sendEmail = functions.https.onCall(async (data, context) => {
  // Enable CORS
  const cors = require('cors')({ origin: true });

  return new Promise((resolve, reject) => {
    cors(data, { headers: { 'Access-Control-Allow-Origin': '*' } }, async () => {
      try {
        const { to, from, fromName, subject, text, html, userId } = data;

        // Validate required fields
        if (!to || !from || !subject) {
          resolve({
            success: false,
            error: 'Missing required fields: to, from, subject'
          });
          return;
        }

        // Validate email addresses
        if (!isValidEmail(to) || !isValidEmail(from)) {
          resolve({
            success: false,
            error: 'Invalid email address'
          });
          return;
        }

        // Sanitize input
        const safeFromName = sanitizeString(fromName, 100);
        const safeSubject = sanitizeString(subject, 255);
        const safeText = sanitizeString(text, 2000);
        const safeHtml = sanitizeHtml(html, 5000);
        const fromAddress = safeFromName ? `${safeFromName} <${from}>` : from;

        // Send email via Resend
        const { data: emailData, error: resendError } = await resend.emails.send({
          from: fromAddress,
          to: to,
          subject: safeSubject,
          text: safeText,
          html: safeHtml || safeText,
        });

        if (resendError) {
          console.error('Resend Error:', resendError.message);
          
          // Log failed email to database
          await logEmailToDatabase({
            to,
            from,
            subject: safeSubject,
            status: 'failed',
            error: resendError.message,
            userId
          });

          resolve({
            success: false,
            error: resendError.message
          });
          return;
        }

        // Log successful email to database
        await logEmailToDatabase({
          to,
          from,
          subject: safeSubject,
          status: 'sent',
          messageId: emailData.id,
          userId
        });

        console.log('Email sent successfully:', { id: emailData.id, to });

        resolve({
          success: true,
          messageId: emailData.id,
          message: 'Email sent successfully'
        });

      } catch (error) {
        console.error('Function Error:', error.message);
        resolve({
          success: false,
          error: 'Internal server error',
          details: error.message
        });
      }
    });
  });
});

// Function to send debt reminder emails
exports.sendDebtReminder = functions.https.onCall(async (data, context) => {
  try {
    const { 
      customerEmail, 
      customerName, 
      debtAmount, 
      dueDate, 
      companyName, 
      fromEmail, 
      description,
      userId 
    } = data;

    const isOverdue = new Date(dueDate) < new Date();
    const subject = isOverdue 
      ? `⚠️ תזכורת דחופה לתשלום - ${companyName}`
      : `🔔 תזכורת תשלום - ${companyName}`;

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
            
            ${isOverdue ? `
              <div class="overdue-warning">
                ⚠️ החוב שלך עבר את תאריך הפירעון!
              </div>
            ` : ''}
            
            <p>זהו תזכורת לתשלום החוב שלך אצל ${companyName}.</p>
            
            <div class="amount-box">
              <div style="font-size: 16px; margin-bottom: 10px;">סכום לתשלום:</div>
              <div class="amount">₪${debtAmount.toLocaleString()}</div>
              <div class="due-date">
                תאריך פירעון: ${new Date(dueDate).toLocaleDateString('he-IL')}
              </div>
            </div>
            
            ${description ? `
              <p><strong>תיאור:</strong> ${description}</p>
            ` : ''}
            
            <p>אנא דאג לסילוק החוב בהקדם האפשרי.</p>
            
            <div class="contact-info">
              <strong>לשאלות ובירורים:</strong><br>
              ${companyName}<br>
              טלפון: [מספר הטלפון שלך]<br>
              אימייל: ${fromEmail}
            </div>
            
            <p style="margin-top: 30px;">
              בברכה,<br>
              <strong>${companyName}</strong>
            </p>
          </div>
          
          <div class="footer">
            <p>תזכורת זו נשלחה אוטומטית ממערכת ניהול החובות של ${companyName}</p>
            <p>תאריך שליחה: ${new Date().toLocaleString('he-IL')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

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
    `.trim();

    // Call the main sendEmail function
    const result = await exports.sendEmail({
      to: customerEmail,
      from: fromEmail,
      fromName: companyName,
      subject,
      text,
      html,
      userId
    });

    return result;

  } catch (error) {
    console.error('Debt Reminder Error:', error.message);
    return {
      success: false,
      error: 'Failed to send debt reminder',
      details: error.message
    };
  }
});

// Function to test email connection
exports.testEmailConnection = functions.https.onCall(async (data, context) => {
  try {
    const { testEmail } = data;

    if (!testEmail || !isValidEmail(testEmail)) {
      return {
        success: false,
        error: 'Invalid test email address'
      };
    }

    const { data: emailData, error } = await resend.emails.send({
      from: testEmail,
      to: testEmail,
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
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      message: 'מייל בדיקה נשלח בהצלחה!',
      messageId: emailData.id
    };

  } catch (error) {
    console.error('Test Connection Error:', error.message);
    return {
      success: false,
      error: 'Failed to test email connection',
      details: error.message
    };
  }
});

// Helper function to log emails to Supabase
async function logEmailToDatabase(emailLog) {
  try {
    const { error } = await supabase
      .from('email_logs')
      .insert([{
        to: emailLog.to,
        from: emailLog.from,
        subject: emailLog.subject,
        status: emailLog.status,
        sent_at: new Date().toISOString(),
        message_id: emailLog.messageId,
        error: emailLog.error,
        user_id: emailLog.userId
      }]);

    if (error) {
      console.error('Failed to log email to database:', error);
    }
  } catch (error) {
    console.error('Error logging email to database:', error);
  }
}
