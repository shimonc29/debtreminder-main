// Vercel API Route for sending emails

import { Resend } from 'resend';

// Set your trusted origins here
const TRUSTED_ORIGINS = [
  'https://your-production-domain.com',
  'http://localhost:3000',
];

// Use a static API key from environment
const SERVER_API_KEY = process.env.RESEND_API_KEY;
const ENDPOINT_API_KEY = process.env.ENDPOINT_API_KEY; // for authenticating requests

function isValidEmail(email) {
  // Simple email regex
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function sanitizeString(str, maxLength = 255) {
  if (!str) return '';
  return String(str).replace(/[\r\n]/g, '').slice(0, maxLength);
}

function sanitizeHtml(html, maxLength = 5000) {
  // Remove <script> tags and limit length
  return String(html || '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .slice(0, maxLength);
}

export default async function handler(req, res) {
  // Restrict CORS to trusted origins
  const origin = req.headers.origin;
  if (TRUSTED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic authentication using static API key in Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ENDPOINT_API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { to, from, fromName, subject, text, html } = req.body;

    // Validate required fields
    if (!to || !from || !subject) {
      return res.status(400).json({ 
        error: 'Missing required fields: to, from, subject' 
      });
    }
    if (!isValidEmail(to) || !isValidEmail(from)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Sanitize input
    const safeFromName = sanitizeString(fromName, 100);
    const safeSubject = sanitizeString(subject, 255);
    const safeText = sanitizeString(text, 2000);
    const safeHtml = sanitizeHtml(html, 5000);
    const fromAddress = safeFromName ? `${safeFromName} <${from}>` : from;

    // Initialize Resend with the server-side API key
    const resend = new Resend(SERVER_API_KEY);

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: to,
      subject: safeSubject,
      text: safeText,
      html: safeHtml || safeText,
    });

    if (error) {
      console.error('Resend Error:', error.message);
      return res.status(400).json({ error: error.message });
    }

    // Only log non-sensitive info
    console.log('Email sent successfully:', { id: data.id, to });
    
    return res.status(200).json({
      success: true,
      messageId: data.id,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('API Error:', error.message);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}