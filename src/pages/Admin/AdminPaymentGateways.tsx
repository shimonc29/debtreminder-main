
import { useState } from 'react';
import { AdminLayout } from '@/components/Admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CircleDollarSign, Smartphone } from "lucide-react";

const AdminPaymentGateways = () => {
  const { toast } = useToast();
  
  // State for payment gateways
  const [stripeSettings, setStripeSettings] = useState({
    publishableKey: '',
    secretKey: '',
    webhookSecret: '',
    isActive: false
  });
  
  const [cardcomSettings, setCardcomSettings] = useState({
    terminalNumber: '',
    username: '',
    apiKey: '',
    isActive: false
  });
  
  const [growSettings, setGrowSettings] = useState({
    businessId: '',
    apiToken: '',
    isActive: false
  });

  const handleStripeSubmit = () => {
    // In a real app, this would save to the database
    setStripeSettings({...stripeSettings, isActive: true});
    toast({
      title: "הגדרות Stripe נשמרו",
      description: "הגדרות שער התשלום עודכנו בהצלחה",
    });
  };

  const handleCardcomSubmit = () => {
    // In a real app, this would save to the database
    setCardcomSettings({...cardcomSettings, isActive: true});
    toast({
      title: "הגדרות Cardcom נשמרו",
      description: "הגדרות שער התשלום עודכנו בהצלחה",
    });
  };

  const handleGrowSubmit = () => {
    // In a real app, this would save to the database
    setGrowSettings({...growSettings, isActive: true});
    toast({
      title: "הגדרות Grow נשמרו",
      description: "הגדרות שער התשלום עודכנו בהצלחה",
    });
  };

  const toggleStripeActive = (value: boolean) => {
    setStripeSettings({...stripeSettings, isActive: value});
    toast({
      title: value ? "Stripe הופעל" : "Stripe הושבת",
      description: `שער התשלום ${value ? 'הופעל' : 'הושבת'} בהצלחה`,
    });
  };

  const toggleCardcomActive = (value: boolean) => {
    setCardcomSettings({...cardcomSettings, isActive: value});
    toast({
      title: value ? "Cardcom הופעל" : "Cardcom הושבת",
      description: `שער התשלום ${value ? 'הופעל' : 'הושבת'} בהצלחה`,
    });
  };

  const toggleGrowActive = (value: boolean) => {
    setGrowSettings({...growSettings, isActive: value});
    toast({
      title: value ? "Grow הופעל" : "Grow הושבת",
      description: `שער התשלום ${value ? 'הופעל' : 'הושבת'} בהצלחה`,
    });
  };

  return (
    <AdminLayout title="ניהול שערי תשלום">
      <div className="space-y-6">
        <Tabs defaultValue="stripe">
          <TabsList className="grid grid-cols-3 max-w-md mb-6">
            <TabsTrigger value="stripe">Stripe</TabsTrigger>
            <TabsTrigger value="cardcom">Cardcom</TabsTrigger>
            <TabsTrigger value="grow">Grow</TabsTrigger>
          </TabsList>
          
          {/* Stripe Tab */}
          <TabsContent value="stripe">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>Stripe</CardTitle>
                      <CardDescription>
                        הגדרות חיבור ל-Stripe לעיבוד תשלומים בינלאומיים
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="stripe-active"
                      checked={stripeSettings.isActive}
                      onCheckedChange={toggleStripeActive}
                    />
                    <Badge variant={stripeSettings.isActive ? "default" : "outline"}>
                      {stripeSettings.isActive ? "פעיל" : "לא פעיל"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stripe-publishable-key">Publishable Key</Label>
                  <Input 
                    id="stripe-publishable-key"
                    value={stripeSettings.publishableKey}
                    onChange={(e) => setStripeSettings({...stripeSettings, publishableKey: e.target.value})}
                    placeholder="pk_test_..."
                  />
                  <p className="text-sm text-muted-foreground">
                    The publishable key is used to initialize Stripe in the browser.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stripe-secret-key">Secret Key</Label>
                  <Input 
                    id="stripe-secret-key"
                    type="password"
                    value={stripeSettings.secretKey}
                    onChange={(e) => setStripeSettings({...stripeSettings, secretKey: e.target.value})}
                    placeholder="sk_test_..."
                  />
                  <p className="text-sm text-muted-foreground">
                    The secret key is used for API calls from your server.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stripe-webhook-secret">Webhook Secret</Label>
                  <Input 
                    id="stripe-webhook-secret"
                    type="password"
                    value={stripeSettings.webhookSecret}
                    onChange={(e) => setStripeSettings({...stripeSettings, webhookSecret: e.target.value})}
                    placeholder="whsec_..."
                  />
                  <p className="text-sm text-muted-foreground">
                    Used to verify incoming webhook events from Stripe.
                  </p>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-md border border-border">
                  <h4 className="font-medium mb-2">הגדרת Webhook</h4>
                  <p className="text-sm text-muted-foreground">
                    הגדר את ה-Webhook URL בלוח הבקרה של Stripe:<br />
                    <code className="bg-muted p-1 rounded">https://yourapp.com/api/webhooks/stripe</code>
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleStripeSubmit}>שמור הגדרות</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Cardcom Tab */}
          <TabsContent value="cardcom">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>Cardcom</CardTitle>
                      <CardDescription>
                        הגדרות חיבור ל-Cardcom לעיבוד תשלומים בישראל
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="cardcom-active"
                      checked={cardcomSettings.isActive}
                      onCheckedChange={toggleCardcomActive}
                    />
                    <Badge variant={cardcomSettings.isActive ? "default" : "outline"}>
                      {cardcomSettings.isActive ? "פעיל" : "לא פעיל"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardcom-terminal">מספר מסוף</Label>
                  <Input 
                    id="cardcom-terminal"
                    value={cardcomSettings.terminalNumber}
                    onChange={(e) => setCardcomSettings({...cardcomSettings, terminalNumber: e.target.value})}
                    placeholder="1000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardcom-username">שם משתמש</Label>
                  <Input 
                    id="cardcom-username"
                    value={cardcomSettings.username}
                    onChange={(e) => setCardcomSettings({...cardcomSettings, username: e.target.value})}
                    placeholder="username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardcom-api-key">מפתח API</Label>
                  <Input 
                    id="cardcom-api-key"
                    type="password"
                    value={cardcomSettings.apiKey}
                    onChange={(e) => setCardcomSettings({...cardcomSettings, apiKey: e.target.value})}
                    placeholder="api_key"
                  />
                </div>
                
                <div className="bg-muted/50 p-4 rounded-md border border-border">
                  <h4 className="font-medium mb-2">הגדרת URL להחזרה</h4>
                  <p className="text-sm text-muted-foreground">
                    יש להגדיר את כתובת החזרה בממשק הניהול של Cardcom:<br />
                    <code className="bg-muted p-1 rounded">https://yourapp.com/api/payment/cardcom-callback</code>
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCardcomSubmit}>שמור הגדרות</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Grow Tab */}
          <TabsContent value="grow">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CircleDollarSign className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>Grow</CardTitle>
                      <CardDescription>
                        הגדרות חיבור ל-Grow לעיבוד תשלומים בישראל
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="grow-active"
                      checked={growSettings.isActive}
                      onCheckedChange={toggleGrowActive}
                    />
                    <Badge variant={growSettings.isActive ? "default" : "outline"}>
                      {growSettings.isActive ? "פעיל" : "לא פעיל"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grow-business-id">מזהה עסק</Label>
                  <Input 
                    id="grow-business-id"
                    value={growSettings.businessId}
                    onChange={(e) => setGrowSettings({...growSettings, businessId: e.target.value})}
                    placeholder="business_id"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="grow-api-token">API Token</Label>
                  <Input 
                    id="grow-api-token"
                    type="password"
                    value={growSettings.apiToken}
                    onChange={(e) => setGrowSettings({...growSettings, apiToken: e.target.value})}
                    placeholder="api_token"
                  />
                </div>
                
                <div className="bg-muted/50 p-4 rounded-md border border-border">
                  <h4 className="font-medium mb-2">הגדרת Callback</h4>
                  <p className="text-sm text-muted-foreground">
                    יש להגדיר את כתובת ה-Callback API בממשק הניהול של Grow:<br />
                    <code className="bg-muted p-1 rounded">https://yourapp.com/api/payment/grow-callback</code>
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleGrowSubmit}>שמור הגדרות</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminPaymentGateways;
