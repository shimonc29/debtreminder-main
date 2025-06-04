
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import { Check, Download, Loader2, Upload, Bell, Globe, CreditCard, ShieldAlert } from 'lucide-react';
import { ReminderSettings } from '@/lib/models/ReminderSettings';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { templates } from '@/lib/db';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger 
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';

// Mock initial settings
const initialSettings: ReminderSettings = {
  enabled: true,
  reminderDays: [7, 1, -3, -7],
  defaultTemplateId: "tmpl_1",
  defaultChannel: "email"
};

const settingsFormSchema = z.object({
  enabled: z.boolean(),
  defaultTemplateId: z.string(),
  defaultChannel: z.enum(["email", "whatsapp"]),
  reminderDays: z.array(z.number()).optional(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function Settings() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<ReminderSettings>(initialSettings);
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      enabled: currentSettings.enabled,
      defaultTemplateId: currentSettings.defaultTemplateId,
      defaultChannel: currentSettings.defaultChannel,
    },
  });

  function onSubmit(data: SettingsFormValues) {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setCurrentSettings({
        ...currentSettings,
        enabled: data.enabled,
        defaultTemplateId: data.defaultTemplateId,
        defaultChannel: data.defaultChannel,
      });
      toast.success("ההגדרות עודכנו בהצלחה", {
        description: "השינויים נשמרו במערכת."
      });
    }, 1000);
  }

  const handleExport = (type: 'customers' | 'debts' | 'reminders') => {
    toast.success(`מייצא ${type === 'customers' ? 'לקוחות' : type === 'debts' ? 'חובות' : 'תזכורות'}`, {
      description: "הקובץ יורד בקרוב."
    });
  };

  const handleImport = (type: 'customers' | 'debts') => {
    // Here we would normally handle file input
    toast.info(`העלאת קובץ ${type === 'customers' ? 'לקוחות' : 'חובות'}`, {
      description: "לחץ על כפתור העלאה לאחר בחירת הקובץ."
    });
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
          <h1 className="page-header">הגדרות</h1>
          
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="general">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="general">כללי</TabsTrigger>
                <TabsTrigger value="reminders">תזכורות</TabsTrigger>
                <TabsTrigger value="export">נתונים</TabsTrigger>
                <TabsTrigger value="subscription">חשבון</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        הגדרות כלליות
                      </CardTitle>
                      <CardDescription>הגדרות כלליות עבור המערכת</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between space-x-2">
                        <div>
                          <h3 className="font-medium">שפת ממשק</h3>
                          <p className="text-sm text-muted-foreground">בחר את שפת הממשק</p>
                        </div>
                        <Select defaultValue="he">
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="שפה" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="he">עברית</SelectItem>
                            <SelectItem value="en">אנגלית</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between space-x-2">
                        <div>
                          <h3 className="font-medium">התראות מערכת</h3>
                          <p className="text-sm text-muted-foreground">הפעל התראות במערכת</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between space-x-2">
                        <div>
                          <h3 className="font-medium">התראות דוא"ל</h3>
                          <p className="text-sm text-muted-foreground">קבל עדכונים בדוא"ל</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-primary" />
                        אבטחה
                      </CardTitle>
                      <CardDescription>הגדרות אבטחה</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between space-x-2">
                        <div>
                          <h3 className="font-medium">אימות דו-שלבי</h3>
                          <p className="text-sm text-muted-foreground">הגבר את אבטחת החשבון שלך</p>
                        </div>
                        <Drawer>
                          <DrawerTrigger asChild>
                            <Button variant="outline">הגדר</Button>
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>הגדרת אימות דו-שלבי</DrawerTitle>
                              <DrawerDescription>
                                סרוק את קוד ה-QR באמצעות אפליקציית אימות כמו Google Authenticator
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 flex justify-center">
                              <div className="bg-gray-200 w-48 h-48 flex items-center justify-center">
                                <p className="text-sm">קוד QR לסריקה</p>
                              </div>
                            </div>
                            <div className="p-4 space-y-2">
                              <Label htmlFor="code">הזן את הקוד מהאפליקציה</Label>
                              <Input id="code" placeholder="000000" className="text-center" />
                            </div>
                            <DrawerFooter>
                              <Button>הפעל אימות דו-שלבי</Button>
                              <DrawerClose asChild>
                                <Button variant="outline">ביטול</Button>
                              </DrawerClose>
                            </DrawerFooter>
                          </DrawerContent>
                        </Drawer>
                      </div>
                      
                      <div className="flex items-center justify-between space-x-2">
                        <div>
                          <h3 className="font-medium">התנתקות אוטומטית</h3>
                          <p className="text-sm text-muted-foreground">התנתק לאחר חוסר פעילות</p>
                        </div>
                        <Select defaultValue="30">
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="זמן התנתקות" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 דקות</SelectItem>
                            <SelectItem value="30">30 דקות</SelectItem>
                            <SelectItem value="60">שעה</SelectItem>
                            <SelectItem value="never">אף פעם</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="reminders">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      הגדרות תזכורות אוטומטיות
                    </CardTitle>
                    <CardDescription>נהל את הגדרות התזכורות האוטומטיות שלך</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="enabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  תזכורות אוטומטיות
                                </FormLabel>
                                <FormDescription>
                                  המערכת תשלח תזכורות באופן אוטומטי בהתאם להגדרות שלך
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="defaultTemplateId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>תבנית ברירת מחדל</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="בחר תבנית ברירת מחדל" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {templates.map((template) => (
                                      <SelectItem 
                                        key={template.id} 
                                        value={template.id}
                                      >
                                        {template.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  תבנית זו תשמש כברירת מחדל בעת שליחת תזכורות
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="defaultChannel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ערוץ תקשורת מועדף</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="בחר ערוץ תקשורת" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="email">אימייל</SelectItem>
                                    <SelectItem value="whatsapp">וואטסאפ</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  ערוץ זה ישמש לשליחת תזכורות כברירת מחדל
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <FormLabel>מרווחי שליחת תזכורות</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {currentSettings.reminderDays.map((days, index) => (
                              <Card key={index} className="border p-3 text-center">
                                <div className="font-medium text-lg">{days > 0 ? `${days} ימים לפני` : days < 0 ? `${Math.abs(days)} ימים אחרי` : 'ביום התשלום'}</div>
                                <p className="text-sm text-muted-foreground">
                                  {days > 0 ? 'תזכורת מקדימה' : days < 0 ? 'תזכורת מאוחרת' : 'תזכורת ביום'}
                                </p>
                              </Card>
                            ))}
                          </div>
                        </div>
                        
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              שומר...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              שמור הגדרות
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="export">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5 text-primary" />
                      ייצוא ויבוא נתונים
                    </CardTitle>
                    <CardDescription>ייצא או ייבא נתונים מהמערכת</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">ייצוא נתונים</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4">
                          <div className="text-center space-y-3">
                            <h3 className="font-medium">ייצוא לקוחות</h3>
                            <p className="text-sm text-muted-foreground">ייצא את כל רשימת הלקוחות לקובץ CSV</p>
                            <Button onClick={() => handleExport('customers')} className="w-full">
                              <Download className="mr-2 h-4 w-4" />
                              ייצוא לקוחות
                            </Button>
                          </div>
                        </Card>
                        
                        <Card className="p-4">
                          <div className="text-center space-y-3">
                            <h3 className="font-medium">ייצוא חובות</h3>
                            <p className="text-sm text-muted-foreground">ייצא את כל רשימת החובות לקובץ CSV</p>
                            <Button onClick={() => handleExport('debts')} className="w-full">
                              <Download className="mr-2 h-4 w-4" />
                              ייצוא חובות
                            </Button>
                          </div>
                        </Card>
                        
                        <Card className="p-4">
                          <div className="text-center space-y-3">
                            <h3 className="font-medium">ייצוא תזכורות</h3>
                            <p className="text-sm text-muted-foreground">ייצא את היסטוריית התזכורות לקובץ CSV</p>
                            <Button onClick={() => handleExport('reminders')} className="w-full">
                              <Download className="mr-2 h-4 w-4" />
                              ייצוא תזכורות
                            </Button>
                          </div>
                        </Card>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6">
                      <h3 className="text-lg font-medium">ייבוא נתונים</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-4">
                          <div className="space-y-4">
                            <h3 className="font-medium text-center">ייבוא לקוחות</h3>
                            <p className="text-sm text-muted-foreground">העלה קובץ CSV המכיל נתוני לקוחות</p>
                            <div className="border border-dashed rounded-md p-4 text-center">
                              <Input 
                                type="file" 
                                accept=".csv" 
                                className="mb-2" 
                                onChange={() => handleImport('customers')}
                              />
                              <p className="text-xs text-muted-foreground">
                                הקובץ צריך להיות בפורמט: שם, אימייל, טלפון, הערות
                              </p>
                            </div>
                            <Button className="w-full">
                              <Upload className="mr-2 h-4 w-4" />
                              העלה קובץ
                            </Button>
                            <Button variant="link" className="w-full">
                              הורד תבנית לדוגמה
                            </Button>
                          </div>
                        </Card>
                        
                        <Card className="p-4">
                          <div className="space-y-4">
                            <h3 className="font-medium text-center">ייבוא חובות</h3>
                            <p className="text-sm text-muted-foreground">העלה קובץ CSV המכיל נתוני חובות</p>
                            <div className="border border-dashed rounded-md p-4 text-center">
                              <Input 
                                type="file" 
                                accept=".csv" 
                                className="mb-2"
                                onChange={() => handleImport('debts')}
                              />
                              <p className="text-xs text-muted-foreground">
                                הקובץ צריך להיות בפורמט: לקוח, סכום, תיאור, מס' חשבונית, תאריך חשבונית, תאריך תשלום
                              </p>
                            </div>
                            <Button className="w-full">
                              <Upload className="mr-2 h-4 w-4" />
                              העלה קובץ
                            </Button>
                            <Button variant="link" className="w-full">
                              הורד תבנית לדוגמה
                            </Button>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subscription">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      חשבון ותשלומים
                    </CardTitle>
                    <CardDescription>פרטי המנוי והחיוב שלך</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-primary/10 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium">תכנית עסקית</h3>
                          <p className="text-sm text-muted-foreground">חיוב חודשי, מתחדש אוטומטית</p>
                        </div>
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30">פעיל</Badge>
                      </div>
                      <div className="mt-4 text-2xl font-bold">₪99 <span className="text-sm font-normal text-muted-foreground">/ לחודש</span></div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">מאפייני התכנית</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>תמיכה בלתי מוגבלת בלקוחות</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>תזכורות אוטומטיות</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>ייצוא נתונים</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>תמיכה טכנית מועדפת</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      <Button className="w-full">שדרג את החשבון שלך</Button>
                      <Button variant="outline" className="w-full">עדכן פרטי תשלום</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
