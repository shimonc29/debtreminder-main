
import { useState } from 'react';
import { AdminLayout } from '@/components/Admin/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Check, 
  AlertTriangle, 
  AlertCircle, 
  ChevronRight 
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface Notification {
  id: string;
  title: string;
  description: string;
  date: Date;
  read: boolean;
  type: 'info' | 'warning' | 'error';
}

// Mock notifications data
const initialNotifications: Notification[] = [
  {
    id: "n1",
    title: "תזכורות נכשלו בשליחה",
    description: "3 תזכורות נכשלו בשליחה למשתמש user2@example.com",
    date: new Date("2024-05-19T08:30:00"),
    read: false,
    type: 'error'
  },
  {
    id: "n2",
    title: "משתמש חדש נרשם למערכת",
    description: "המשתמש דוד כהן נרשם למערכת",
    date: new Date("2024-05-18T14:45:00"),
    read: false,
    type: 'info'
  },
  {
    id: "n3",
    title: "עדכון מסד הנתונים",
    description: "מסד הנתונים עודכן בהצלחה לגרסה החדשה",
    date: new Date("2024-05-17T11:20:00"),
    read: true,
    type: 'info'
  },
  {
    id: "n4",
    title: "אחוז גבוה של תזכורות ללא תגובה",
    description: "אחוז גבוה של תזכורות נשלחו ללא תגובה בחודש האחרון",
    date: new Date("2024-05-16T09:15:00"),
    read: false,
    type: 'warning'
  },
];

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    
    toast.success("ההתראה סומנה כנקראה");
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    
    toast.success("כל ההתראות סומנו כנקראות");
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', { 
      day: 'numeric',
      month: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };
  
  const getIcon = (type: 'info' | 'warning' | 'error') => {
    switch (type) {
      case 'info':
        return <Bell className="h-5 w-5 text-primary" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
  };
  
  const getTypeText = (type: 'info' | 'warning' | 'error') => {
    switch (type) {
      case 'info':
        return 'מידע';
      case 'warning':
        return 'אזהרה';
      case 'error':
        return 'שגיאה';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AdminLayout title="התראות מערכת">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">התראות מערכת</h1>
          <p className="text-muted-foreground">
            {unreadCount} התראות שלא נקראו
          </p>
        </div>
        <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <Check className="mr-2 h-4 w-4" />
          סמן הכל כנקרא
        </Button>
      </div>
      
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getIcon(notification.type)}
                  <CardTitle className="text-lg">
                    {notification.title}
                  </CardTitle>
                  <Badge variant={
                    notification.type === 'info' ? 'default' :
                    notification.type === 'warning' ? 'secondary' :
                    'destructive'
                  }>
                    {getTypeText(notification.type)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(notification.date)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {notification.description}
              </CardDescription>
            </CardContent>
            <div className="px-6 pb-4 flex justify-between items-center">
              <Button variant="ghost" size="sm" className="text-primary">
                צפה בפרטים
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              {!notification.read && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => markAsRead(notification.id)}
                >
                  <Check className="mr-2 h-4 w-4" />
                  סמן כנקרא
                </Button>
              )}
            </div>
          </Card>
        ))}
        
        {notifications.length === 0 && (
          <Card className="py-8">
            <div className="text-center text-muted-foreground">
              <Bell className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p>אין התראות חדשות</p>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
