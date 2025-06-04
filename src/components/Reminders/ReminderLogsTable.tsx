
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data for the logs
const reminderLogs = [
  {
    id: 'log_1',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
    action: 'אוטומטי',
    description: 'נשלחו 3 תזכורות אוטומטיות עבור חובות שמועד התשלום שלהם חלף',
    status: 'success',
  },
  {
    id: 'log_2',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
    action: 'אוטומטי',
    description: 'נשלחו 1 תזכורות אוטומטיות עבור חובות שמועד התשלום שלהם חלף',
    status: 'success',
  },
  {
    id: 'log_3',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 3)),
    action: 'שינוי הגדרות',
    description: 'הגדרות התזכורות האוטומטיות עודכנו',
    status: 'info',
  },
  {
    id: 'log_4',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 5)),
    action: 'אוטומטי',
    description: 'אין חובות שדורשים תזכורת',
    status: 'info',
  },
  {
    id: 'log_5',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 7)),
    action: 'אוטומטי',
    description: 'כשלון בשליחת תזכורת: אימייל לא תקין ללקוח "דניאל אברהם"',
    status: 'error',
  },
];

export function ReminderLogsTable() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">הצלחה</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">אזהרה</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">שגיאה</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">מידע</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>תאריך</TableHead>
            <TableHead>פעולה</TableHead>
            <TableHead>תיאור</TableHead>
            <TableHead>סטטוס</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reminderLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{formatDate(log.timestamp)}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.description}</TableCell>
              <TableCell>{getStatusBadge(log.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
