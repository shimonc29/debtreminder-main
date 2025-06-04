
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { getRecentReminders, getCustomerById, getTemplateById } from '@/lib/db';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

export function RecentActivity() {
  const recentReminders = getRecentReminders();
  
  // Format date to display in Hebrew
  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: he 
    });
  };
  
  // Get channel icon
  const getChannelIcon = (channel: 'email' | 'whatsapp') => {
    return channel === 'email' ? '📧' : '📱';
  };
  
  // Get status color
  const getStatusColor = (status: 'sent' | 'delivered' | 'failed') => {
    switch (status) {
      case 'delivered': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>פעילות אחרונה</CardTitle>
        <CardDescription>תזכורות שנשלחו לאחרונה</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
        {recentReminders.map(reminder => {
          const customer = getCustomerById(reminder.customerId);
          const template = getTemplateById(reminder.templateId);
          
          return (
            <div key={reminder.id} className="flex items-start gap-3">
              <div className="text-2xl">{getChannelIcon(reminder.channel)}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{customer?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {template?.name}
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${getStatusColor(reminder.status)}`}>
                    {reminder.status === 'delivered' ? 'נמסר' : 
                     reminder.status === 'failed' ? 'נכשל' : 'נשלח'}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDate(reminder.sentAt)}
                </div>
                {reminder.response && (
                  <div className="mt-1 text-sm p-2 bg-muted rounded-md">
                    תגובה: {reminder.response}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {recentReminders.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            אין פעילות אחרונה להצגה
          </div>
        )}
      </CardContent>
    </Card>
  );
}
