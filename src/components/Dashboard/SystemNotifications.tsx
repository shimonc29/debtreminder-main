import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'customer_response';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  link?: string;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'בעיה בשליחת תזכורות',
    message: 'לא הצלחנו לשלוח 3 תזכורות. בדוק את הגדרות האימייל שלך.',
    date: new Date(),
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'עדכון מערכת',
    message: 'המערכת תעבור עדכון ב-25/05/2024 בשעה 02:00.',
    date: new Date(Date.now() - 86400000), // 1 day ago
    read: true,
  },
  {
    id: '3',
    type: 'success',
    title: 'תשלום התקבל',
    message: 'התקבל תשלום עבור חשבונית INV-2024-003.',
    date: new Date(Date.now() - 172800000), // 2 days ago
    read: true,
  },
  {
    id: "notif_1",
    title: "תגובת לקוח חדשה",
    message: "הלקוח דוד לוי טוען ששילם את חשבונית INV-2023-001",
    date: new Date(2023, 4, 17),
    read: false,
    type: "customer_response",
    link: "/customer-responses"
  },
];

export function SystemNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'info': return <Bell className="h-5 w-5 text-blue-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'customer_response': return <XCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      day: 'numeric',
      month: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>התראות מערכת</span>
          {notifications.some(n => !n.read) && (
            <Badge variant="destructive" className="h-6 w-6 rounded-full flex items-center justify-center p-0">
              {notifications.filter(n => !n.read).length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`flex items-start p-3 rounded-md relative ${notification.read ? 'bg-background' : 'bg-muted/50'}`}
              >
                <div className="mr-2">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{notification.title}</h4>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5" 
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">סגור</span>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs" 
                        onClick={() => markAsRead(notification.id)}
                      >
                        סמן כנקרא
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              אין התראות חדשות
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
