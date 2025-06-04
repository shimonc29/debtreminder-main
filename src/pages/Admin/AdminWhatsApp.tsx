
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/Admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { WhatsAppLogTable } from '@/components/Admin/WhatsAppLogTable';
import { WhatsAppTemplatesList } from '@/components/Admin/WhatsAppTemplatesList';
import { WhatsAppTemplateForm } from '@/components/Admin/WhatsAppTemplateForm';

const AdminWhatsApp = () => {
  const { toast } = useToast();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [twilioSettings, setTwilioSettings] = useState({
    accountSid: '',
    authToken: '',
    phoneNumber: '',
    whatsappBusinessId: ''
  });

  const [quotaSettings, setQuotaSettings] = useState({
    freePlanLimit: 0,
    basicPlanLimit: 100,
    proPlanLimit: 1000,
    enterprisePlanLimit: 10000,
  });

  // Mock connection check
  useEffect(() => {
    // In a real app, this would check the actual connection status
    const checkConnection = async () => {
      // Simulate API call
      setLoading(true);
      setTimeout(() => {
        setConnected(twilioSettings.accountSid !== '' && twilioSettings.authToken !== '');
        setLoading(false);
      }, 1000);
    };
    
    checkConnection();
  }, [twilioSettings.accountSid, twilioSettings.authToken]);

  const handleSaveSettings = () => {
    // In a real app, this would save to the database
    toast({
      title: "הגדרות נשמרו",
      description: "הגדרות WhatsApp נשמרו בהצלחה",
    });
  };

  const handleConnect = () => {
    setLoading(true);
    // In a real app, this would validate and connect to Twilio
    setTimeout(() => {
      if (twilioSettings.accountSid && twilioSettings.authToken && twilioSettings.phoneNumber) {
        setConnected(true);
        toast({
          title: "חיבור הצליח",
          description: "המערכת מחוברת בהצלחה ל-WhatsApp Business API",
        });
      } else {
        toast({
          title: "חיבור נכשל",
          description: "אנא ודא שכל השדות הנדרשים מולאו",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 1500);
  };

  const handleDisconnect = () => {
    setLoading(true);
    // In a real app, this would disconnect from Twilio
    setTimeout(() => {
      setConnected(false);
      toast({
        title: "ניתוק הצליח",
        description: "המערכת נותקה בהצלחה מ-WhatsApp Business API",
      });
      setLoading(false);
    }, 1000);
  };

  const handleSaveQuota = () => {
    toast({
      title: "מכסות נשמרו",
      description: "הגדרות מכסות השליחה נשמרו בהצלחה",
    });
  };

  const handleTemplateSubmit = (template: any) => {
    // In a real app, this would submit the template to WhatsApp for approval
    toast({
      title: "תבנית נשמרה",
      description: "התבנית נשלחה לאישור WhatsApp",
    });
  };

  const handleTemplateCancel = () => {
    // This would simply close the form or reset it
    toast({
      title: "ביטול",
      description: "הפעולה בוטלה",
    });
  };

  return (
    <AdminLayout title="ניהול WhatsApp">
      <div className="space-y-6">
        <Tabs defaultValue="settings">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mb-6">
            <TabsTrigger value="settings">הגדרות חיבור</TabsTrigger>
            <TabsTrigger value="templates">תבניות הודעה</TabsTrigger>
            <TabsTrigger value="quotas">מכסות שליחה</TabsTrigger>
            <TabsTrigger value="logs">לוג הודעות</TabsTrigger>
          </TabsList>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>הגדרות WhatsApp Business API</CardTitle>
                    <CardDescription>
                      הגדרות לחיבור המערכת ל-Twilio עבור שליחת הודעות WhatsApp
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={connected ? "default" : "outline"}
                    className={connected ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                  >
                    {connected ? "מחובר" : "מנותק"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountSid">Twilio Account SID</Label>
                    <Input 
                      id="accountSid"
                      value={twilioSettings.accountSid}
                      onChange={(e) => setTwilioSettings({...twilioSettings, accountSid: e.target.value})}
                      placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                    <p className="text-sm text-muted-foreground">
                      ניתן למצוא את Account SID בלוח הבקרה של Twilio
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="authToken">Twilio Auth Token</Label>
                    <Input 
                      id="authToken" 
                      type="password"
                      value={twilioSettings.authToken}
                      onChange={(e) => setTwilioSettings({...twilioSettings, authToken: e.target.value})}
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                    <p className="text-sm text-muted-foreground">
                      ניתן למצוא את Auth Token בלוח הבקרה של Twilio
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">מספר טלפון WhatsApp</Label>
                    <Input 
                      id="phoneNumber"
                      value={twilioSettings.phoneNumber}
                      onChange={(e) => setTwilioSettings({...twilioSettings, phoneNumber: e.target.value})}
                      placeholder="+972xxxxxxxxx"
                    />
                    <p className="text-sm text-muted-foreground">
                      מספר הטלפון שהוגדר ב-WhatsApp Business API, כולל קידומת מדינה
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="whatsappBusinessId">WhatsApp Business ID</Label>
                    <Input 
                      id="whatsappBusinessId"
                      value={twilioSettings.whatsappBusinessId}
                      onChange={(e) => setTwilioSettings({...twilioSettings, whatsappBusinessId: e.target.value})}
                      placeholder="xxxxxxxxxxxxxxxx"
                    />
                    <p className="text-sm text-muted-foreground">
                      מזהה העסק ב-WhatsApp Business (אופציונלי)
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {!connected ? (
                  <Button onClick={handleConnect} disabled={loading}>
                    {loading ? 'מתחבר...' : 'התחבר ל-WhatsApp Business API'}
                  </Button>
                ) : (
                  <Button variant="destructive" onClick={handleDisconnect} disabled={loading}>
                    {loading ? 'מנתק...' : 'נתק חיבור'}
                  </Button>
                )}
                <Button onClick={handleSaveSettings}>שמור הגדרות</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Templates Tab */}
          <TabsContent value="templates">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="xl:col-span-1">
                <CardHeader>
                  <CardTitle>תבניות הודעה מאושרות</CardTitle>
                  <CardDescription>
                    תבניות הודעה שאושרו ע"י WhatsApp לשימוש בממשק ה-API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WhatsAppTemplatesList />
                </CardContent>
              </Card>
              
              <Card className="xl:col-span-1">
                <CardHeader>
                  <CardTitle>הגשת תבנית חדשה לאישור</CardTitle>
                  <CardDescription>
                    יצירת תבנית חדשה והגשתה לאישור WhatsApp Business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WhatsAppTemplateForm 
                    onSubmit={handleTemplateSubmit}
                    onCancel={handleTemplateCancel}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Quotas Tab */}
          <TabsContent value="quotas">
            <Card>
              <CardHeader>
                <CardTitle>הגדרת מכסות שליחה לפי סוג מסלול</CardTitle>
                <CardDescription>
                  הגדרת כמות ההודעות המקסימלית שניתן לשלוח בחודש לפי סוג המסלול
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="freePlanLimit">מסלול חינמי</Label>
                    <Input 
                      id="freePlanLimit" 
                      type="number"
                      value={quotaSettings.freePlanLimit}
                      onChange={(e) => setQuotaSettings({...quotaSettings, freePlanLimit: Number(e.target.value)})}
                    />
                    <p className="text-sm text-muted-foreground">
                      0 = ללא אפשרות לשליחת הודעות WhatsApp במסלול זה
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="basicPlanLimit">מסלול בסיסי</Label>
                    <Input 
                      id="basicPlanLimit" 
                      type="number"
                      value={quotaSettings.basicPlanLimit}
                      onChange={(e) => setQuotaSettings({...quotaSettings, basicPlanLimit: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="proPlanLimit">מסלול מקצועי</Label>
                    <Input 
                      id="proPlanLimit" 
                      type="number"
                      value={quotaSettings.proPlanLimit}
                      onChange={(e) => setQuotaSettings({...quotaSettings, proPlanLimit: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="enterprisePlanLimit">מסלול ארגוני</Label>
                    <Input 
                      id="enterprisePlanLimit" 
                      type="number"
                      value={quotaSettings.enterprisePlanLimit}
                      onChange={(e) => setQuotaSettings({...quotaSettings, enterprisePlanLimit: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveQuota}>שמור מכסות</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Logs Tab */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>לוג הודעות WhatsApp</CardTitle>
                <CardDescription>
                  היסטוריית הודעות WhatsApp שנשלחו מהמערכת וסטטוס השליחה שלהן
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WhatsAppLogTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminWhatsApp;
