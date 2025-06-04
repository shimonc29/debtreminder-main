
import { Reminder, getTemplateById } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface CustomerRemindersProps {
  reminders: Reminder[];
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'sent':
      return 'נשלח';
    case 'delivered':
      return 'נמסר';
    case 'failed':
      return 'נכשל';
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'sent':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'delivered':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'failed':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    default:
      return '';
  }
};

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

export function CustomerReminders({ reminders }: CustomerRemindersProps) {
  if (reminders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        לא נשלחו תזכורות ללקוח זה
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>תאריך שליחה</TableHead>
            <TableHead>ערוץ</TableHead>
            <TableHead>תבנית</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead>תגובה</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reminders.map((reminder) => {
            const template = getTemplateById(reminder.templateId);
            
            return (
              <TableRow key={reminder.id}>
                <TableCell>{formatDate(reminder.sentAt)}</TableCell>
                <TableCell>{getChannelLabel(reminder.channel)}</TableCell>
                <TableCell>{template?.name || 'תבנית לא ידועה'}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(reminder.status)}>
                    {getStatusLabel(reminder.status)}
                  </Badge>
                </TableCell>
                <TableCell>{reminder.response || '-'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
