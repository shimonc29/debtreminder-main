// Vercel API Route for sending emails

import { Resend } from 'resend';


export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { apiKey, to, from, fromName, subject, text, html } = req.body;

    if (!apiKey || !to || !from || !subject) {
      return res.status(400).json({ 
        error: 'Missing required fields: apiKey, to, from, subject' 
      });
    }

    // Initialize Resend with the provided API key
    const resend = new Resend(apiKey);

    const fromAddress = fromName ? `${fromName} <${from}>` : from;

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: to,
      subject: subject,
      text: text || '',
      html: html || text || '',
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('Email sent successfully:', data);
    
    return res.status(200).json({
      success: true,
      messageId: data.id,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}