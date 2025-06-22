import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
import { testEmailConnection } from '@/lib/resendService';
import { getSupabaseUrl, getSupabaseAnonKey, getResendApiKey } from '@/config/env';

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

export default function IntegrationTest() {
  const [supabaseTest, setSupabaseTest] = useState<TestResult | null>(null);
  const [resendTest, setResendTest] = useState<TestResult | null>(null);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isTestingResend, setIsTestingResend] = useState(false);
  const [resendApiKey, setResendApiKey] = useState('');
  const [testEmail, setTestEmail] = useState('');

  // Environment variables status
  const envVars = {
    supabase: {
      url: !!getSupabaseUrl(),
      key: !!getSupabaseAnonKey(),
    },
    resend: {
      key: !!getResendApiKey(),
    },
  };

  const testSupabaseConnection = async () => {
    setIsTestingSupabase(true);
    setSupabaseTest(null);

    try {
      // Test basic connection
      const { data, error } = await supabase.from('customers').select('count').limit(1);
      
      if (error) {
        throw error;
      }

      setSupabaseTest({
        success: true,
        message: '✅ Supabase connection successful! Database is accessible.',
        details: { data }
      });
    } catch (error: any) {
      setSupabaseTest({
        success: false,
        message: `❌ Supabase connection failed: ${error.message}`,
        details: { error: error.message }
      });
    } finally {
      setIsTestingSupabase(false);
    }
  };

  const testResendConnection = async () => {
    if (!resendApiKey.trim()) {
      setResendTest({
        success: false,
        message: '❌ Please enter a Resend API key'
      });
      return;
    }

    if (!testEmail.trim()) {
      setResendTest({
        success: false,
        message: '❌ Please enter a test email address'
      });
      return;
    }

    setIsTestingResend(true);
    setResendTest(null);

    try {
      const result = await testEmailConnection(resendApiKey, testEmail);
      
      if (result.success) {
        setResendTest({
          success: true,
          message: '✅ Resend connection successful! Test email sent.',
          details: { messageId: result.messageId }
        });
      } else {
        setResendTest({
          success: false,
          message: `❌ Resend connection failed: ${result.message}`,
          details: { error: result.message }
        });
      }
    } catch (error: any) {
      setResendTest({
        success: false,
        message: `❌ Resend connection failed: ${error.message}`,
        details: { error: error.message }
      });
    } finally {
      setIsTestingResend(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Integration Test</h1>
        <p className="text-muted-foreground">
          Verify Supabase database and Resend email integrations
        </p>
      </div>

      {/* Environment Variables Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Environment Variables Status</CardTitle>
          <CardDescription>
            Check if all required environment variables are configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Supabase</h4>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <Badge variant={envVars.supabase.url ? "default" : "destructive"}>
                    {envVars.supabase.url ? "✅" : "❌"} URL
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {envVars.supabase.url ? "Configured" : "Missing"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={envVars.supabase.key ? "default" : "destructive"}>
                    {envVars.supabase.key ? "✅" : "❌"} API Key
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {envVars.supabase.key ? "Configured" : "Missing"}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium">Resend</h4>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <Badge variant={envVars.resend.key ? "default" : "destructive"}>
                    {envVars.resend.key ? "✅" : "❌"} API Key
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {envVars.resend.key ? "Configured" : "Missing"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supabase Test */}
        <Card>
          <CardHeader>
            <CardTitle>Supabase Database Test</CardTitle>
            <CardDescription>
              Test connection to Supabase database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testSupabaseConnection}
              disabled={isTestingSupabase}
              className="w-full"
            >
              {isTestingSupabase ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Testing...
                </>
              ) : (
                'Test Supabase Connection'
              )}
            </Button>

            {supabaseTest && (
              <Alert variant={supabaseTest.success ? "default" : "destructive"}>
                <AlertDescription>
                  {supabaseTest.success ? (
                    <div>
                      <p className="font-medium">{supabaseTest.message}</p>
                      {supabaseTest.details && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm">View Details</summary>
                          <pre className="mt-2 text-xs bg-black/10 p-2 rounded overflow-auto">
                            {JSON.stringify(supabaseTest.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">{supabaseTest.message}</p>
                      {supabaseTest.details && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm">View Details</summary>
                          <pre className="mt-2 text-xs bg-black/10 p-2 rounded overflow-auto">
                            {JSON.stringify(supabaseTest.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Resend Test */}
        <Card>
          <CardHeader>
            <CardTitle>Resend Email Service</CardTitle>
            <CardDescription>
              Test email sending with Resend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resend-api-key">Resend API Key</Label>
              <Input
                id="resend-api-key"
                type="password"
                placeholder="re_..."
                value={resendApiKey}
                onChange={(e) => setResendApiKey(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="test-email">Test Email Address</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>

            <Button 
              onClick={testResendConnection}
              disabled={isTestingResend || !resendApiKey || !testEmail}
              className="w-full"
            >
              {isTestingResend ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending Test Email...
                </>
              ) : (
                'Send Test Email'
              )}
            </Button>

            {resendTest && (
              <Alert variant={resendTest.success ? "default" : "destructive"}>
                <AlertDescription>
                  {resendTest.success ? (
                    <div>
                      <p className="font-medium">{resendTest.message}</p>
                      {resendTest.details && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm">View Details</summary>
                          <pre className="mt-2 text-xs bg-black/10 p-2 rounded overflow-auto">
                            {JSON.stringify(resendTest.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">{resendTest.message}</p>
                      {resendTest.details && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm">View Details</summary>
                          <pre className="mt-2 text-xs bg-black/10 p-2 rounded overflow-auto">
                            {JSON.stringify(resendTest.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Configuration Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Instructions</CardTitle>
          <CardDescription>
            How to set up environment variables for this application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">1. Supabase Configuration</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Add these variables to your environment:
            </p>
            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium mb-2">2. Resend Configuration</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Add this variable to your environment:
            </p>
            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`VITE_RESEND_API_KEY=re_your_resend_api_key_here`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium mb-2">3. For Production (Firebase)</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Set these environment variables in Firebase Console:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Go to Firebase Console → Your Project → Functions</li>
              <li>Click on "Configuration" tab</li>
              <li>Add environment variables under "Environment variables"</li>
              <li>Redeploy your functions after adding variables</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 