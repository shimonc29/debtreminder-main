import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeApp } from 'firebase/app';

// Firebase config - you'll need to add this to your environment
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "debt-reminder-2354-9102f.firebaseapp.com",
  projectId: "debt-reminder-2354-9102f",
  storageBucket: "debt-reminder-2354-9102f.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// Email sending function
export const sendEmail = async (emailData: {
  to: string;
  from: string;
  fromName?: string;
  subject: string;
  text?: string;
  html?: string;
  userId?: string;
}) => {
  try {
    const sendEmailFunction = httpsCallable(functions, 'sendEmail');
    const result = await sendEmailFunction(emailData);
    return result.data;
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new Error(error.message || 'Failed to send email');
  }
};

// Debt reminder function
export const sendDebtReminder = async (reminderData: {
  customerEmail: string;
  customerName: string;
  debtAmount: number;
  dueDate: string;
  companyName: string;
  fromEmail: string;
  description?: string;
  userId?: string;
}) => {
  try {
    const sendDebtReminderFunction = httpsCallable(functions, 'sendDebtReminder');
    const result = await sendDebtReminderFunction(reminderData);
    return result.data;
  } catch (error: any) {
    console.error('Error sending debt reminder:', error);
    throw new Error(error.message || 'Failed to send debt reminder');
  }
};

// Test email connection function
export const testEmailConnection = async (testEmail: string) => {
  try {
    const testConnectionFunction = httpsCallable(functions, 'testEmailConnection');
    const result = await testConnectionFunction({ testEmail });
    return result.data;
  } catch (error: any) {
    console.error('Error testing email connection:', error);
    throw new Error(error.message || 'Failed to test email connection');
  }
}; 