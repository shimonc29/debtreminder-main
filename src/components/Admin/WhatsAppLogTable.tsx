
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { formatDate } from '@/lib/utils';
import { Eye, RotateCw } from 'lucide-react';

// Mock data for WhatsApp message logs
const mockLogs = [
  {
    id: '1',
    timestamp: new Date('2025-05-19T08:30:00'),
    customerName: 'אבי כהן',
    phoneNumber: '+972501234567',
    messageType: 'תזכורת חוב',
    status: 'delivered',
    templateName: 'תזכורת תשלום חוב',
  },
  {
    id: '2',
    timestamp: new Date('2025-05-19T09:15:00'),
    customerName: 'מיכל לוי',
    phoneNumber: '+972521234567',
    messageType: 'תזכורת חוב',
    status: 'sent',
    templateName: 'תזכורת תשלום חוב',
  },
  {
    id: '3',
    timestamp: new Date('2025-05-19T10:00:00'),
    customerName: 'יעקב ישראלי',
    phoneNumber: '+972541234567',
    messageType: 'תזכורת חוב',
    status: 'failed',
    templateName: 'תזכורת תשלום חוב',
  },
  {
    id: '4',
    timestamp: new Date('2025-05-18T14:30:00'),
    customerName: 'שרה כהן',
    phoneNumber: '+972551234567',
    messageType: 'תזכורת חוב',
    status: 'read',
    templateName: 'תזכורת תשלום חוב',
  },
  {
    id: '5',
    timestamp: new Date('2025-05-18T16:45:00'),
    customerName: 'דוד לוי',
    phoneNumber: '+972561234567',
    messageType: 'תזכורת חוב',
    status: 'delivered',
    templateName: 'תזכורת תשלום חוב',
  },
];

export function WhatsAppLogTable() {
  const [logs, setLogs] = useState(mockLogs);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const logsPerPage = 10;
  const totalPages = Math.ceil(logs.length / logsPerPage);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">נשלח</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">נמסר</Badge>;
      case 'read':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">נקרא</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">נכשל</Badge>;
      default:
        return <Badge variant="outline">לא ידוע</Badge>;
    }
  };
  
  const handleRefreshLogs = () => {
    setIsLoading(true);
    // In a real app, this would fetch logs from the server
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  const handleViewDetails = (logId: string) => {
    // In a real app, this would show a dialog with message details
    console.log('View log details', logId);
  };
  
  if (logs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">לא נמצאו רישומי הודעות WhatsApp</p>
        <Button variant="outline" className="mt-4" onClick={handleRefreshLogs} disabled={isLoading}>
          <RotateCw className="ml-2 h-4 w-4" />
          רענן נתונים
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleRefreshLogs} disabled={isLoading}>
          <RotateCw className={`ml-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'מרענן...' : 'רענן נתונים'}
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>תאריך ושעה</TableHead>
              <TableHead>לקוח</TableHead>
              <TableHead>מספר טלפון</TableHead>
              <TableHead>תבנית</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead>פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{formatDate(log.timestamp)}</TableCell>
                <TableCell>{log.customerName}</TableCell>
                <TableCell dir="ltr">{log.phoneNumber}</TableCell>
                <TableCell>{log.templateName}</TableCell>
                <TableCell>{getStatusBadge(log.status)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetails(log.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            {/* Pagination components would go here */}
          </Pagination>
        </div>
      )}
    </div>
  );
}
