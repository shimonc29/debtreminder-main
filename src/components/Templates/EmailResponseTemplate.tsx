
import React from 'react';

interface EmailResponseTemplateProps {
  customerName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: Date;
  companyName: string;
  responseUrl: string;
}

export function EmailResponseTemplate({
  customerName,
  invoiceNumber,
  amount,
  currency,
  dueDate,
  companyName,
  responseUrl
}: EmailResponseTemplateProps) {
  return (
    <div style={{ direction: 'rtl', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#1f2937', fontSize: '24px', marginBottom: '10px' }}>תזכורת תשלום</h1>
        <p style={{ color: '#4b5563', fontSize: '16px' }}>חשבונית מספר {invoiceNumber}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: '#1f2937', fontSize: '16px' }}>שלום {customerName},</p>
        <p style={{ color: '#4b5563', fontSize: '16px', marginBottom: '10px' }}>
          אנו מזכירים לך שטרם התקבל תשלום עבור חשבונית מספר {invoiceNumber} בסך {amount} {currency}, שמועד התשלום שלה היה בתאריך {dueDate.toLocaleDateString('he-IL')}.
        </p>
        <p style={{ color: '#4b5563', fontSize: '16px', marginBottom: '10px' }}>
          נודה לך אם תוכל/י להסדיר את התשלום בהקדם.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ color: '#4b5563', fontSize: '16px', marginBottom: '10px', fontWeight: 'bold' }}>
          האם כבר שילמת עבור חשבונית זו?
        </p>
        <a 
          href={responseUrl}
          style={{ 
            display: 'inline-block', 
            backgroundColor: '#10b981', 
            color: 'white', 
            padding: '12px 24px', 
            borderRadius: '6px', 
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          כן, כבר שילמתי
        </a>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', color: '#6b7280', fontSize: '14px', textAlign: 'center' }}>
        <p>בברכה,</p>
        <p>{companyName}</p>
      </div>
    </div>
  );
}
