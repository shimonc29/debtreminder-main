
import { Reminder, getCustomerById, getTemplateById } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Send } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface RemindersTableProps {
  reminders: Reminder[];
}

export function RemindersTable({ reminders }: RemindersTableProps) {
  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'אימייל';
      case 'whatsapp':
        return 'וואטסאפ';
      default:
        return channel;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">נשלח</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">נמסר</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">נכשל</Badge>;
      default:
        return null;
    }
  };
  
  const handleViewDetail = (reminder: Reminder) => {
    // In a real app, this would navigate to a reminder detail page or show a dialog
    console.log('View reminder details', reminder);
  };
  
  const handleResend = (reminder: Reminder) => {
    // In a real app, this would trigger resending the reminder
    console.log('Resend reminder', reminder);
  };
  
  if (reminders.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-background">
        <p className="text-muted-foreground">לא נמצאו תזכורות התואמות את הסינון</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>תאריך שליחה</TableHead>
            <TableHead>לקוח</TableHead>
            <TableHead>ערוץ</TableHead>
            <TableHead>תבנית</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead>תגובה</TableHead>
            <TableHead>פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reminders.map((reminder) => {
            const customer = getCustomerById(reminder.customerId);
            const template = getTemplateById(reminder.templateId);
            
            return (
              <TableRow key={reminder.id}>
                <TableCell>{formatDate(reminder.sentAt)}</TableCell>
                <TableCell>{customer?.name || 'לקוח לא ידוע'}</TableCell>
                <TableCell>{getChannelLabel(reminder.channel)}</TableCell>
                <TableCell>{template?.name || 'תבנית לא ידועה'}</TableCell>
                <TableCell>{getStatusBadge(reminder.status)}</TableCell>
                <TableCell>{reminder.response || '-'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetail(reminder)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleResend(reminder)}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
