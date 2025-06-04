
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { currentUser, templates } from '@/lib/db';
import { ReminderSettings as ReminderSettingsType } from '@/lib/models/ReminderSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { Clock, Mail, Send, Plus, Trash2, MessageSquare, Smartphone } from 'lucide-react';
import { ReminderLogsTable } from '@/components/Reminders/ReminderLogsTable';
import { WhatsAppChannelOption } from '@/components/Reminders/WhatsAppChannelOption';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

// Replace the missing WhatsApp icon with Smartphone icon which is already imported
// We'll use Smartphone as a replacement for WhatsApp

const ReminderSettingsPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock settings based on user settings
  const [settings, setSettings] = useState<ReminderSettingsType>({
    enabled: true,
    reminderDays: currentUser.settings.reminderIntervals,
    defaultTemplateId: currentUser.settings.defaultEmailTemplateId,
    defaultChannel: 'email'
  });
  
  // For the input field (adding new reminder days)
  const [newReminderDay, setNewReminderDay] = useState<string>('');
  
  // WhatsApp related state
  const [isWhatsAppEnabled, setIsWhatsAppEnabled] = useState(false);
  const [isActivationDialogOpen, setIsActivationDialogOpen] = useState(false);
  const [userPlan, setUserPlan] = useState('basic'); // free, basic, pro, enterprise
  const [whatsappRemainingQuota, setWhatsappRemainingQuota] = useState(100);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);
  
  const handleToggleEnabled = () => {
    setSettings(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };
  
  const handleAddReminderDay = () => {
    const day = parseInt(newReminderDay);
    if (!isNaN(day) && day > 0 && !settings.reminderDays.includes(day)) {
      setSettings(prev => ({
        ...prev,
        reminderDays: [...prev.reminderDays, day].sort((a, b) => a - b)
      }));
      setNewReminderDay('');
    }
  };
  
  const handleRemoveReminderDay = (day: number) => {
    setSettings(prev => ({
      ...prev,
      reminderDays: prev.reminderDays.filter(d => d !== day)
    }));
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would call an API to save the settings
    toast({
      title: "הגדרות נשמרו",
      description: "הגדרות התזכורות האוטומטיות נשמרו בהצלחה",
      variant: "default",
    });
  };
  
  const handleActivateWhatsApp = () => {
    // In a real app, this would verify phone and connect to WhatsApp
    toast({
      title: "WhatsApp מופעל",
      description: "כעת תוכל לשלוח תזכורות באמצעות WhatsApp",
    });
    setIsWhatsAppEnabled(true);
    setIsActivationDialogOpen(false);
  };
  
  const getTemplateById = (id: string) => {
    return templates.find(t => t.id === id);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">טוען...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1">
        <Navbar />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="page-header">הגדרות תזכורות</h1>
          </div>
          
          <Tabs defaultValue="settings">
            <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
              <TabsTrigger value="settings">הגדרות כלליות</TabsTrigger>
              <TabsTrigger value="channels">ערוצי תקשורת</TabsTrigger>
              <TabsTrigger value="logs">לוג פעילות</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="ml-2 h-5 w-5" />
                      תזכורות אוטומטיות
                    </CardTitle>
                    <CardDescription>
                      הגדר מתי ישלחו תזכורות באופן אוטומטי
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>הפעל תזכורות אוטומטיות</Label>
                        <p className="text-sm text-muted-foreground">
                          התזכורות יישלחו באופן אוטומטי בהתאם להגדרות שלהלן
                        </p>
                      </div>
                      <Switch 
                        checked={settings.enabled} 
                        onCheckedChange={handleToggleEnabled}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>ימים לשליחת תזכורות</Label>
                      <p className="text-sm text-muted-foreground">
                        התזכורות יישלחו במספר הימים שמוגדר לאחר תאריך היעד של החוב
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {settings.reminderDays.map(day => (
                          <Badge key={day} variant="secondary" className="flex items-center gap-1">
                            {day > 0 ? `${day} ימים אחרי` : `${Math.abs(day)} ימים לפני`}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-5 w-5 p-0 ml-1"
                              onClick={() => handleRemoveReminderDay(day)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex mt-2">
                        <Input
                          type="number"
                          placeholder="מספר ימים"
                          value={newReminderDay}
                          onChange={e => setNewReminderDay(e.target.value)}
                          className="max-w-[120px]"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleAddReminderDay}
                          className="mr-2"
                        >
                          <Plus className="h-4 w-4 ml-1" />
                          הוסף
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        הזן מספר חיובי לימים אחרי התאריך, או מספר שלילי לימים לפני התאריך
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="ml-2 h-5 w-5" />
                      הגדרות ברירת מחדל
                    </CardTitle>
                    <CardDescription>
                      הגדר את התבנית וערוץ התקשורת לתזכורות אוטומטיות
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>ערוץ תקשורת ברירת מחדל</Label>
                      <Select 
                        value={settings.defaultChannel} 
                        onValueChange={value => setSettings(prev => ({ ...prev, defaultChannel: value as "email" | "whatsapp" }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">אימייל</SelectItem>
                          <SelectItem value="whatsapp" disabled={!isWhatsAppEnabled || userPlan === 'free'}>
                            WhatsApp {!isWhatsAppEnabled && '(לא מופעל)'}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>תבנית ברירת מחדל</Label>
                      <Select 
                        value={settings.defaultTemplateId} 
                        onValueChange={value => setSettings(prev => ({ ...prev, defaultTemplateId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="בחר תבנית" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates
                            .filter(t => t.channel === settings.defaultChannel)
                            .map(template => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-4">
                      <p className="text-sm font-medium">תבנית נבחרת:</p>
                      <p className="text-sm text-muted-foreground">
                        {getTemplateById(settings.defaultTemplateId)?.name || 'לא נבחרה תבנית'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveSettings}>
                  שמור הגדרות
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="channels">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="ml-2 h-5 w-5" />
                      אימייל
                    </CardTitle>
                    <CardDescription>
                      הגדרות שליחת תזכורות באמצעות אימייל
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">אימייל</span>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">מופעל</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        הודעות אימייל נשלחות מכתובת המייל של החשבון שלך
                      </p>
                      <p className="text-sm mt-2">
                        כתובת שולח: {currentUser.email}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Smartphone className="ml-2 h-5 w-5" />
                      WhatsApp
                    </CardTitle>
                    <CardDescription>
                      הגדרות שליחת תזכורות באמצעות WhatsApp
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WhatsAppChannelOption
                      isWhatsAppEnabled={isWhatsAppEnabled}
                      userPlan={userPlan}
                      remainingQuota={whatsappRemainingQuota}
                      onActivate={() => setIsActivationDialogOpen(true)}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>לוג פעילות תזכורות אוטומטיות</CardTitle>
                  <CardDescription>
                    רשימת הפעולות האחרונות של מנגנון התזכורות האוטומטיות
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReminderLogsTable />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* WhatsApp Activation Dialog */}
      <Dialog open={isActivationDialogOpen} onOpenChange={setIsActivationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>הפעלת WhatsApp</DialogTitle>
            <DialogDescription>
              הזן את מספר הטלפון שלך כדי להפעיל שליחת תזכורות באמצעות WhatsApp
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">מספר טלפון</Label>
              <Input
                id="phoneNumber"
                placeholder="+972501234567"
                dir="ltr"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                הזן מספר טלפון כולל קידומת מדינה (לדוגמה: 972+)
              </p>
            </div>
            
            <div className="pt-2 space-y-2 text-sm">
              <p>חשוב לדעת:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>הודעות WhatsApp נשלחות מהמספר המרכזי של המערכת</li>
                <li>שליחת הודעות WhatsApp כפופה למכסה חודשית בהתאם למסלול שלך</li>
                <li>הודעות WhatsApp נשלחות רק מתבניות מאושרות ע"י WhatsApp</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActivationDialogOpen(false)}>
              ביטול
            </Button>
            <Button onClick={handleActivateWhatsApp}>
              הפעל WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReminderSettingsPage;
