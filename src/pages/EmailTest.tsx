import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { sendEmail, testEmailConnection } from '@/lib/resendService';
import { getResendApiKey } from '@/config/env';

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

export default function EmailTest() {
  const [testEmail, setTestEmail] = useState('');
  const [vercelTest, setVercelTest] = useState<TestResult | null>(null);
  const [resendTest, setResendTest] = useState<TestResult | null>(null);
  const [isTestingVercel, setIsTestingVercel] = useState(false);
  const [isTestingResend, setIsTestingResend] = useState(false);

  // Environment variables status
  const envStatus = {
    resendApiKey: !!getResendApiKey(),
    endpointApiKey: !!process.env.ENDPOINT_API_KEY,
  };

  const testVercelApiRoute = async () => {
    if (!testEmail.trim()) {
      setVercelTest({
        success: false,
        message: '❌ אנא הזן כתובת מייל לבדיקה'
      });
      return;
    }

    setIsTestingVercel(true);
    setVercelTest(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer debt_reminder_secure_api_key_2025`
        },
        body: JSON.stringify({
          to: testEmail,
          from: 'noreply@debtreminder.com',
          fromName: 'DebtReminder Test',
          subject: 'בדיקת API Route - Vercel',
          text: 'זהו מייל בדיקה מ-Vercel API Route',
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #4338ca;">✅ בדיקת Vercel API Route הצליחה!</h2>
              <p>זהו מייל בדיקה לוידוא תקינות ה-API Route של Vercel.</p>
              <p>אם אתה רואה את המייל הזה, ה-API עובד בהצלחה!</p>
              <hr style="margin: 20px 0;">
              <p style="font-size: 12px; color: #666;">
                נשלח מ-Vercel API Route<br>
                ${new Date().toLocaleString('he-IL')}
              </p>
            </div>
          `
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      setVercelTest({
        success: true,
        message: '✅ Vercel API Route עובד! מייל נשלח בהצלחה.',
        details: result
      });
    } catch (error: any) {
      setVercelTest({
        success: false,
        message: `❌ Vercel API Route נכשל: ${error.message}`,
        details: { error: error.message }
      });
    } finally {
      setIsTestingVercel(false);
    }
  };

  const testResendDirect = async () => {
    if (!testEmail.trim()) {
      setResendTest({
        success: false,
        message: '❌ אנא הזן כתובת מייל לבדיקה'
      });
      return;
    }

    const apiKey = getResendApiKey();
    if (!apiKey) {
      setResendTest({
        success: false,
        message: '❌ Resend API Key חסר!'
      });
      return;
    }

    setIsTestingResend(true);
    setResendTest(null);

    try {
      const result = await testEmailConnection(apiKey, 'noreply@debtreminder.com');
      
      if (result.success) {
        setResendTest({
          success: true,
          message: result.message || '✅ Resend ישיר עובד! מייל נשלח בהצלחה.',
          details: { messageId: result.messageId }
        });
      } else {
        setResendTest({
          success: false,
          message: result.message || '❌ Resend ישיר נכשל',
          details: { error: result.message }
        });
      }
    } catch (error: any) {
      setResendTest({
        success: false,
        message: `❌ Resend ישיר נכשל: ${error.message}`,
        details: { error: error.message }
      });
    } finally {
      setIsTestingResend(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">בדיקת שירותי מיילים</h1>
        <p className="text-muted-foreground">
          בדיקת תקינות שליחת מיילים דרך שני השירותים הזמינים
        </p>
      </div>

      {/* Environment Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>סטטוס משתני סביבה</CardTitle>
          <CardDescription>
            בדיקת משתני הסביבה הנדרשים לשליחת מיילים
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Badge variant={envStatus.resendApiKey ? "default" : "destructive"}>
                {envStatus.resendApiKey ? "✅" : "❌"} RESEND_API_KEY
              </Badge>
              <span className="text-sm text-muted-foreground">
                {envStatus.resendApiKey ? "מוגדר" : "חסר"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                🔧 ENDPOINT_API_KEY
              </Badge>
              <span className="text-sm text-muted-foreground">
                עבור Vercel API Route
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Email Input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>הגדרת בדיקה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="test-email">כתובת מייל לבדיקה</Label>
            <Input
              id="test-email"
              type="email"
              placeholder="test@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vercel API Route Test */}
        <Card>
          <CardHeader>
            <CardTitle>Vercel API Route</CardTitle>
            <CardDescription>
              בדיקת שליחת מייל דרך /api/send-email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>✅ תיקנו: package.json + dependencies</p>
              <p>✅ תיקנו: משתני סביבה</p>
              <p>✅ תיקנו: TRUSTED_ORIGINS</p>
              <p>✅ תיקנו: ENDPOINT_API_KEY</p>
            </div>

            <Button 
              onClick={testVercelApiRoute}
              disabled={isTestingVercel || !testEmail}
              className="w-full"
            >
              {isTestingVercel ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  שולח מייל דרך Vercel...
                </>
              ) : (
                'בדוק Vercel API Route'
              )}
            </Button>

            {vercelTest && (
              <Alert variant={vercelTest.success ? "default" : "destructive"}>
                <AlertDescription>
                  <div>
                    <p className="font-medium">{vercelTest.message}</p>
                    {vercelTest.details && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm">פרטים נוספים</summary>
                        <pre className="mt-2 text-xs bg-black/10 p-2 rounded overflow-auto">
                          {JSON.stringify(vercelTest.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Direct Resend Test */}
        <Card>
          <CardHeader>
            <CardTitle>Resend ישיר</CardTitle>
            <CardDescription>
              בדיקת חיבור ישיר ל-Resend API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>🔄 ישיר מהקליינט</p>
              <p>⚠️ חושף API key בדפדפן</p>
              <p>✅ פועל ללא תלות ב-backend</p>
            </div>

            <Button 
              onClick={testResendDirect}
              disabled={isTestingResend || !testEmail || !envStatus.resendApiKey}
              className="w-full"
              variant="outline"
            >
              {isTestingResend ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  שולח מייל דרך Resend...
                </>
              ) : (
                'בדוק Resend ישיר'
              )}
            </Button>

            {resendTest && (
              <Alert variant={resendTest.success ? "default" : "destructive"}>
                <AlertDescription>
                  <div>
                    <p className="font-medium">{resendTest.message}</p>
                    {resendTest.details && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm">פרטים נוספים</summary>
                        <pre className="mt-2 text-xs bg-black/10 p-2 rounded overflow-auto">
                          {JSON.stringify(resendTest.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>הוראות השלמת ההגדרה</CardTitle>
          <CardDescription>
            מה עוד צריך לעשות כדי שהמיילים יעבדו מושלם
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">1. ✅ מה כבר תוקן</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>נוסף package.json ל-api directory</li>
              <li>תוקנו משתני סביבה ב-send-email.js</li>
              <li>עודכנו TRUSTED_ORIGINS לדומיינים הנכונים</li>
              <li>נוסף ENDPOINT_API_KEY לאבטחה</li>
              <li>יוצר קובץ .env.local עם כל המשתנים</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">2. 🔧 מה עוד צריך לעשות</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>אמת את הדומיין שלך ב-<a href="https://resend.com/dashboard" target="_blank" className="text-blue-600 underline">Resend Dashboard</a></li>
              <li>החלף 'noreply@debtreminder.com' בכתובת מאומתת שלך</li>
              <li>בדוק שה-ENDPOINT_API_KEY מוגדר נכון בייצור</li>
              <li>עדכן את TRUSTED_ORIGINS לכלול את הדומיין הסופי שלך</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">3. 🚀 פריסה לייצור</h4>
            <p className="text-sm text-muted-foreground mb-2">
              כאשר תפרוס ל-Vercel/Firebase:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>הגדר את משתני הסביבה בפלטפורמת הפריסה</li>
              <li>עדכן את TRUSTED_ORIGINS לכלול את הדומיין של הייצור</li>
              <li>בדוק שכל המיילים מגיעים לתיקיית SPAM גם</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}