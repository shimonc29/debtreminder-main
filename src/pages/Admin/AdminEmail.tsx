
import { useState } from 'react';
import { AdminLayout } from '@/components/Admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, MailCheck, ShieldCheck, Globe, BarChart } from 'lucide-react';
import { EmailLogTable } from '@/components/Admin/EmailLogTable';
import { EmailTemplateForm } from '@/components/Admin/EmailTemplateForm';
import { initializeResendService } from '@/lib/resendService'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveEmailSettings, loadEmailSettings, testEmailConnection, sendEmail } from '@/lib/backendEmailService'
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from '@/components/ui/sonner';

// Type definition for email service provider
type EmailProvider = 'sendgrid' | 'mailgun' | 'ses';

// Form schema for email settings
const emailSettingsSchema = z.object({
  provider: z.enum(['sendgrid', 'mailgun', 'ses', 'resend']),
  apiKey: z.string().min(1, { message: 'מפתח API נדרש' }),
  fromEmail: z.string().email({ message: 'יש להזין כתובת אימייל תקינה' }),
  fromName: z.string().min(1, { message: 'שם השולח נדרש' }),
  enableWhiteLabeling: z.boolean(),
  maxEmailsPerDay: z.number().min(1).max(100000),
  defaultDailyLimit: z.number().min(1).max(1000),
});

export default function AdminEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const [providerStatus, setProviderStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Initialize form with default values
  const form = useForm<z.infer<typeof emailSettingsSchema>>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      provider: 'resend',
      apiKey: '',
      fromEmail: 'noreply@yourapp.com',
      fromName: 'DebtReminder App',
      enableWhiteLabeling: false,
      maxEmailsPerDay: 10000,
      defaultDailyLimit: 100,
    },
  });
// Load saved settings on component mount
useEffect(() => {
  const loadSavedSettings = async () => {
    try {
      const savedSettings = await loadEmailSettings()
      if (savedSettings) {
        form.reset(savedSettings)
        if (savedSettings.apiKey && savedSettings.fromEmail) {
          setProviderStatus('connected')
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }
  
  loadSavedSettings()
}, [form])

  // Mock stats for demonstration
  const emailStats = {
    totalSent: 12543,
    delivered: 12320,
    opened: 8765,
    clicked: 3421,
    bounced: 223,
    deliveryRate: 98.2,
    openRate: 71.1,
    clickRate: 27.8,
    lastUpdated: '2025-05-19T09:30:00'
  };

  // Mock domains for demonstration
  const verifiedDomains = [
    { domain: 'example.com', status: 'verified', dateAdded: '2025-04-15' },
    { domain: 'company.co.il', status: 'pending', dateAdded: '2025-05-18' }
  ];

  // Handle form submission
  // Handle form submission
async function onSubmit(data: z.infer<typeof emailSettingsSchema>) {
  setIsLoading(true);
  
  try {
    // Convert form data to EmailSettings with required fields
    const emailSettings = {
      provider: data.provider,
      apiKey: data.apiKey,
      fromEmail: data.fromEmail,
      fromName: data.fromName,
      enableWhiteLabeling: data.enableWhiteLabeling,
      maxEmailsPerDay: data.maxEmailsPerDay,
      defaultDailyLimit: data.defaultDailyLimit,
    } as const;
    
    const result = await saveEmailSettings(emailSettings)
    
    if (result.success) {
      setProviderStatus('connected');
      toast.success('הגדרות האימייל נשמרו בהצלחה', {
        description: 'ההגדרות נשמרו במערכת'
      });
    } else {
      throw new Error(result.message)
    }
  } catch (error: any) {
    toast.error('שגיאה בשמירת ההגדרות', {
      description: error.message
    });
  } finally {
    setIsLoading(false);
  }
}
  // Handle connection test
  const handleTestConnection = async () => {
  setProviderStatus('checking');
  
  const apiKey = form.getValues('apiKey');
  const fromEmail = form.getValues('fromEmail');
  
  if (!apiKey || !fromEmail) {
    toast.error('יש למלא מפתח API וכתובת מייל');
    setProviderStatus('disconnected');
    return;
  }
  
  try {
    const result = await testEmailConnection(apiKey, fromEmail);
    
    if (result.success) {
      setProviderStatus('connected');
      toast.success('החיבור לשירות האימיילים תקין', {
        description: 'מייל בדיקה נשלח בהצלחה!'
      });
    } else {
      setProviderStatus('disconnected');
      toast.error('בדיקת החיבור נכשלה', {
        description: result.message
      });
    }
  } catch (error: any) {
    setProviderStatus('disconnected');
    toast.error('שגיאה בבדיקת החיבור', {
      description: error.message
    });
  }
};

  // Handle send test email
  const handleSendTestEmail = async () => {
  const apiKey = form.getValues('apiKey');
  const fromEmail = form.getValues('fromEmail');
  const fromName = form.getValues('fromName');
  
  if (!apiKey || !fromEmail) {
    toast.error('יש למלא מפתח API וכתובת מייל קודם');
    return;
  }
  
  try {
    // Initialize service first
    initializeResendService(apiKey);
    
    toast.info('שולח אימייל בדיקה...', {
      description: 'המתן בבקשה'
    });
    
    const result = await testEmailConnection(apiKey, fromEmail);
    
    if (result.success) {
      toast.success('אימייל בדיקה נשלח בהצלחה', {
        description: 'בדוק את תיבת האימייל שלך (כולל ספאם)'
      });
    } else {
      toast.error('שליחת אימייל נכשלה', {
        description: result.message
      });
    }
  } catch (error: any) {
    toast.error('שגיאה בשליחת אימייל', {
      description: error.message
    });
  }
};

  return (
    <AdminLayout title="ניהול אימיילים">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="settings">הגדרות</TabsTrigger>
            <TabsTrigger value="statistics">סטטיסטיקות</TabsTrigger>
            <TabsTrigger value="whitelabel">מיתוג מותאם</TabsTrigger>
            <TabsTrigger value="logs">לוג שליחה</TabsTrigger>
          </TabsList>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  הגדרות שירות אימייל
                </CardTitle>
                <CardDescription>
                  הגדר את פרטי החיבור לשירות שליחת האימיילים
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="provider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ספק שירות</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="בחר ספק שירות" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
  <SelectItem value="resend">Resend</SelectItem>
  <SelectItem value="sendgrid">SendGrid</SelectItem>
  <SelectItem value="mailgun">Mailgun</SelectItem>
  <SelectItem value="ses">Amazon SES</SelectItem>
</SelectContent>
                          </Select>
                          <FormDescription>
                            בחר את ספק שירות האימיילים שברצונך לחבר
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>מפתח API</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
  הזן את מפתח ה-API של שירות האימיילים שלך (Resend/SendGrid/Mailgun/SES)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fromEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>כתובת המוען (From)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              כתובת האימייל שתופיע כשולח
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fromName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>שם השולח</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              השם שיופיע לצד כתובת האימייל
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="enableWhiteLabeling"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              אפשר מיתוג מותאם (White labeling)
                            </FormLabel>
                            <FormDescription>
                              אפשר למשתמשים בתשלום לשלוח אימיילים מהדומיין שלהם
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="maxEmailsPerDay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>מכסה יומית מקסימלית</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              מספר האימיילים המקסימלי שהמערכת תשלח ביום
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="defaultDailyLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>מכסה יומית ברירת מחדל למשתמש</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              מספר האימיילים היומי לחשבון חינמי
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex gap-3">
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              שומר...
                            </>
                          ) : (
                            'שמור הגדרות'
                          )}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleTestConnection}>
                          בדוק חיבור
                        </Button>
                        <Button type="button" variant="outline" onClick={handleSendTestEmail}>
                          שלח אימייל בדיקה
                        </Button>
                      </div>
                      <div>
                        <Badge 
                          variant={providerStatus === 'connected' ? 'default' : 'outline'}
                          className={
                            providerStatus === 'connected' ? 'bg-green-500 hover:bg-green-500' : 
                            providerStatus === 'checking' ? 'bg-orange-500 hover:bg-orange-500' : ''
                          }
                        >
                          {providerStatus === 'connected' ? 'מחובר' : 
                           providerStatus === 'checking' ? 'בודק חיבור...' : 'לא מחובר'}
                        </Badge>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  הגדרות תאימות ופרטיות
                </CardTitle>
                <CardDescription>
                  וודא עמידה בתקנות GDPR ו-CAN-SPAM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">כלול קישור הסרה בכל אימייל</h3>
                      <p className="text-sm text-muted-foreground">
                        נדרש לפי תקנות CAN-SPAM
                      </p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>

                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">כלול כתובת פיזית בכל אימייל</h3>
                      <p className="text-sm text-muted-foreground">
                        נדרש לפי תקנות CAN-SPAM
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">שמור לוגים ל-24 חודשים</h3>
                      <p className="text-sm text-muted-foreground">
                        שמירת מעקב אחר הסכמות והודעות שנשלחו לצורך עמידה בדרישות GDPR
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  סטטיסטיקות שליחת אימיילים
                </CardTitle>
                <CardDescription>
                  מעקב אחר ביצועי השליחה, פתיחה והקלקות
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{emailStats.totalSent}</div>
                      <p className="text-xs text-muted-foreground">סה"כ נשלחו</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{emailStats.deliveryRate}%</div>
                      <p className="text-xs text-muted-foreground">אחוז מסירה</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{emailStats.openRate}%</div>
                      <p className="text-xs text-muted-foreground">אחוז פתיחה</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{emailStats.clickRate}%</div>
                      <p className="text-xs text-muted-foreground">אחוז הקלקות</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">פירוט מצטבר</h3>
                    <div className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>אימיילים שנשלחו:</span>
                        <span>{emailStats.totalSent}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>אימיילים שנמסרו:</span>
                        <span>{emailStats.delivered}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>אימיילים שנפתחו:</span>
                        <span>{emailStats.opened}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>הקלקות על קישורים:</span>
                        <span>{emailStats.clicked}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>אימיילים שחזרו (bounced):</span>
                        <span>{emailStats.bounced}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-muted/30">
                    <p className="text-sm">עדכון אחרון: {new Date(emailStats.lastUpdated).toLocaleString('he-IL')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* White Label Tab */}
          <TabsContent value="whitelabel">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  הגדרות מיתוג מותאם (White Labeling)
                </CardTitle>
                <CardDescription>
                  אפשר למשתמשים בתשלום לשלוח אימיילים מהדומיין שלהם
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">דומיינים מאומתים</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="py-3 px-4 text-right font-medium">דומיין</th>
                            <th className="py-3 px-4 text-right font-medium">סטטוס</th>
                            <th className="py-3 px-4 text-right font-medium">תאריך הוספה</th>
                            <th className="py-3 px-4 text-right font-medium">פעולות</th>
                          </tr>
                        </thead>
                        <tbody>
                          {verifiedDomains.map((domain, index) => (
                            <tr key={index} className="border-t">
                              <td className="py-3 px-4">{domain.domain}</td>
                              <td className="py-3 px-4">
                                <Badge variant={domain.status === 'verified' ? 'default' : 'outline'}>
                                  {domain.status === 'verified' ? 'מאומת' : 'ממתין לאימות'}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">{domain.dateAdded}</td>
                              <td className="py-3 px-4">
                                <Button variant="ghost" size="sm">
                                  {domain.status === 'verified' ? 'הסר' : 'הוראות אימות'}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-4">הוסף דומיין חדש</h3>
                    <div className="flex gap-2">
                      <Input placeholder="example.com" className="max-w-xs" />
                      <Button>הוסף דומיין</Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      לאחר הוספת הדומיין תידרש לאמת את הבעלות עליו באמצעות הוספת רשומות DNS
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-4">התאמה אישית של תבניות</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="mb-2">לוגו ברירת המחדל (600 x 200px)</p>
                        <div className="border border-dashed rounded p-6 flex items-center justify-center bg-muted/50">
                          <Button variant="outline">העלה לוגו</Button>
                        </div>
                      </div>
                      <div>
                        <p className="mb-2">צבע ראשי</p>
                        <div className="flex gap-2">
                          <Input type="color" defaultValue="#4338ca" className="w-16 h-10" />
                          <Input defaultValue="#4338ca" className="w-32" />
                        </div>
                      </div>
                    </div>
                    <Button className="mt-4">שמור הגדרות מיתוג</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MailCheck className="h-5 w-5 text-primary" />
                  לוג שליחת אימיילים
                </CardTitle>
                <CardDescription>
                  מעקב אחר כל האימיילים שנשלחו במערכת
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmailLogTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
